import io
import requests
import pathlib
import zipfile

DATA_DIR = pathlib.Path(__file__).parent / 'raw_data'

# Get the 2020 Census block group shapefile for PA from the Census Bureau
url = 'https://www2.census.gov/geo/tiger/TIGER2020/BG/tl_2020_42_bg.zip'
response = requests.get(url)

# Extract the zip file into the data directory
buffer = io.BytesIO(response.content)
shapefile = zipfile.ZipFile(buffer)
shapefile.extractall(DATA_DIR / 'census_blockgroups_2020')
