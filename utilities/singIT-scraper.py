#!/usr/bin/env python3

from pathlib import Path
from PIL import Image
import PIL
import chardet
import hashlib
import json
import argparse
import sys

image_dir = Path('.') / 'images'

def main(args):
    l = []
    root = Path(args.directory)
    if not root.exists():
        print('Specify a readable directory kthx')
        sys.exit(0)
    root = Path(args.directory).resolve()
    if not root.parts[-1] == 'songs':
        new_root = root / 'songs'
        if not new_root.exists():
            print('Specified path does not end in, or contain, a \'songs\' directory')
            sys.exit(0)
        else:
            root = new_root
    for txt in root.rglob('*.txt'):
        if txt.is_file():
            try:
                song = get_metadata(txt)
                song_hash = get_hash(txt)
                if 'cover' in song:
                    cover_file = txt.parent / song['cover']
                    if cover_file.exists():
                        make_small_image(cover_file, song_hash)
                    else:
                        del song['cover']
                l.append(song)
            except:
                print(str(txt)+" is broken!")
                print(get_encoding(txt))
                pass

    print('Outputting JSON for', len(l), 'songs')
    with open('output.txt', 'w') as outfile:
        json.dump(l, outfile)

def get_metadata(filename):
    song = {}
    song['song_hash'] = get_hash(filename)
    f_encoding = get_encoding(filename)['encoding']
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Parse Ultrastar DX song files into JSON.')
    parser.add_argument('directory',help='directory to use',action='store')
    args = parser.parse_args()

    if not image_dir.exists():
        image_dir.mkdir()

    main(args)
