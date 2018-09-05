# Utilities
Utilities related to the singIT project

### singIT-scraper
singIT-scraper is a Python 3 script which parses Ultrastar DX song files into JSON and creates small thumbnails of all the cover images. Depends on the Python 3 libraries PIL and chardet to work.

```sh
$ python3 singIT-scraper.py -d /path/to/.ultrastardx/folder
```

If the script throws an `422 Unprocessable Entity`, then there might be some metadata missing. Run this in the ultrastar folder: 

```sh
$ find . -wholename "*.txt" -exec grep -L "#ARTIST" {} \;
```
