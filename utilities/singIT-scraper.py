#!/usr/bin/env python3

from pathlib import Path
from PIL import Image
import requests
import time
import PIL
import chardet
import hashlib
import json
import argparse
import sys

config = {}
api_key = ''
image_dir = Path('.') / 'images'

def main(args):
  l = []
  root = get_root(args.directory)
  for txt in root.rglob('*.txt'):
    if txt.is_file():
      try:
        song = build_song_object(txt)
        l.append(song)
      except:
        print(str(txt)+" is broken!")
        print(get_encoding(txt))
        pass
  post_content(l, args)

def single(args):
  filename = Path(args.single)
  if not (filename.exists() and filename.suffix == '.txt'):
    print('Specify a readable txt file kthx')
    sys.exit(0)
  song = build_song_object(filename)
  post_content([song], args)

def get_root(directory):
  root = Path(directory)
  if not root.exists():
    print('Specify a readable directory kthx')
    sys.exit(0)
  root = root.resolve()
  if not root.parts[-1] == 'songs':
    new_root = root / 'songs'
    if not new_root.exists():
      print('Specified path does not end in, or contain, a \'songs\' directory')
      sys.exit(0)
    else:
      root = new_root
  return(root)

def build_song_object(filename):
  song = get_metadata(filename)
  if 'cover' in song:
    cover_file = filename.parent / song['cover']
    if cover_file.exists():
      make_small_image(cover_file, song['song_hash'])
    else:
      song['cover'] = None
  else:
    song['cover'] = None
  return(song)

def get_metadata(filename):
  song = {}
  song['song_hash'] = get_hash(filename)
  f_encoding = get_encoding(filename)['encoding']
  if f_encoding == 'ISO-8859-2':
    f_encoding = 'ISO-8859-1'
  with filename.open(encoding=f_encoding) as f:
    for line in f:
      if line.startswith('#'):
        key_end = line.find(':')
        key = line[1:key_end].lower()
        value = line[key_end+1:]
        song[key] = value.rstrip('\n')
  return(song)

def get_encoding(filename):
  byte_object = filename.open('rb').read()
  return(chardet.detect(byte_object))

def get_hash(filename):
  h = hashlib.md5()
  h.update(str(filename).encode('utf-8'))
  return(h.hexdigest())

def make_small_image(filename, song_hash):
  dest_fname = song_hash + '.png'
  destination_file = image_dir.resolve()
  destination_file = destination_file / dest_fname
  if not destination_file.exists():
    basewidth = 200
    try:
      img = Image.open(filename)
      wpercent = (basewidth/float(img.size[0]))
      hsize = int((float(img.size[1]) * float(wpercent)))
      sml_img = img.resize((basewidth, hsize), PIL.Image.ANTIALIAS)
      img.close()
      sml_img.save(str(destination_file), 'PNG')
      sml_img.close()
    except IOError:
      pass

def post_content(songlist, args):
  d = {'songs': songlist}
  if not args.file:
    print('Posting', len(songlist), 'songs')
    h = {
      'Content-Type': 'application/json',
      'Authorization': 'Token token=' + api_key
      }
    r = requests.post(config['api'], data=json.dumps(d), headers=h)
    color = '\033[32m' if r.status_code == requests.codes.created else '\033[91m'
    reset = '\033[0m'  # reset color
    print("[{}] {:2} -> {} -> {}{} {}{}"
          .format(time.strftime("%F %T"),
                  len(songlist), config['api'], color, r.status_code,
                  r.reason, reset), flush=True)
  else:
    print('Outputting', len(songlist), 'songs')
    with open('output.txt', 'w') as outfile:
      json.dump(d, outfile)

if __name__ == "__main__":
  try:
    with open('config.json', 'r') as f:
      the_config = json.load(f)
  except FileNotFoundError:
    print('config.json not found')
    sys.exit(0)
  except Exception as e:
    raise e
  api_key = the_config['api_key']
  del the_config['api_key']
  config = the_config

  parser = argparse.ArgumentParser(description='Parse Ultrastar DX song files into JSON.')
  group = parser.add_mutually_exclusive_group(required=True)
  group.add_argument('-d','--directory', 
    help='directory to use', 
    action='store')
  group.add_argument('-s','--single', 
    help='txt file to use', 
    action='store')
  parser.add_argument('-f','--file',
    help='parse to file instead of upload',
    action='store_true',
    default=False)
  args = parser.parse_args()

  if not image_dir.exists():
    image_dir.mkdir()

  if args.single:
    single(args)
  else:
    main(args)
