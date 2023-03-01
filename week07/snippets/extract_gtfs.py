import io
import re
import requests
import pathlib
import zipfile

DATA_DIR = pathlib.Path(__file__).parent / 'raw_data'

# Get the GTFS data from the SEPTA GitHub repository
url = 'https://github.com/septadev/GTFS/releases/download/v202302261/gtfs_public.zip'
response = requests.get(url)

print(f'Received {response.status_code} response...')
print(f'Content-Length: {response.headers.get("Content-Length")}')

# The response contains a zip file. Wrap the response in a file-like object
# and open it as a zipfile.
buffer = io.BytesIO(response.content)
full_zip = zipfile.ZipFile(buffer)

# There should be two other zip files inside the one. Unzip them both and save
# the contents to the ./raw_data directory.
for gtfs_feed_name in full_zip.namelist():
    with full_zip.open(gtfs_feed_name) as gtfs_feed_file:
        gtfs_feed_zip = zipfile.ZipFile(gtfs_feed_file)
        gtfs_type = re.search(r'google_(\w+).zip', gtfs_feed_name).group(1)

        gtfs_feed_zip.extractall(DATA_DIR / f'septa_{gtfs_type}')
        print(f'Extracted into {DATA_DIR}/septa_{gtfs_type}...')
