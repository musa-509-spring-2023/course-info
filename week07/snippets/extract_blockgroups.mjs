import fetch from 'node-fetch';
import Zip from 'adm-zip';

const __dirname = new URL('.', import.meta.url).pathname;
const DATA_DIR = __dirname + 'raw_data/';

// Get the 2020 Census block group shapefile for PA from the Census Bureau
const url = 'https://www2.census.gov/geo/tiger/TIGER2020/BG/tl_2020_42_bg.zip';
const response = await fetch(url);

// Extract the zip file into the data directory
const buffer = Buffer.from(await response.arrayBuffer());
const shapefile = new Zip({input: buffer});
shapefile.extractAllTo(DATA_DIR + 'census_blockgroups_2020', true);
