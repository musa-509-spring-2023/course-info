import gdal from 'gdal-async';
import fs from 'fs/promises';
import {stringify} from 'csv/sync';

const __dirname = new URL('.', import.meta.url).pathname;
const RAW_DATA_DIR = __dirname + 'raw_data/';
const PROCESSED_DATA_DIR = __dirname + 'processed_data/';

// Read in the census block group shapefile
const shapefile = gdal.open(RAW_DATA_DIR + 'census_blockgroups_2020/tl_2020_42_bg.shp');
const layer = shapefile.layers.get(0);
const blockgroups = layer.features;

// Create a header row for the CSV file with all lower-case field names
const fieldnames = layer.fields
  .getNames()
  .map((name) => name.toLowerCase());

// Create a spatial reference object for EPSG:4326, as we'll need to transform
// the geometries to this projection before writing them to the CSV file. The
// Census Bureau uses EPSG:4269. https://gis.stackexchange.com/a/170854/8583
const epsg4326 = gdal.SpatialReference.fromEPSG(4326);

// Create a CSV row for each blockgroup
const rows = [];
for (const blockgroup of blockgroups) {
  const row = blockgroup.fields.toArray();
  const geometry = blockgroup.getGeometry();
  geometry.transformTo(epsg4326);
  const jsonGeometry = geometry.toJSON();
  rows.push([...row, jsonGeometry]);
}

// Write the CSV file
const csv = stringify(rows, {
  columns: [...fieldnames, 'geog'],
  header: true,
});
const csvPath = PROCESSED_DATA_DIR + 'census_blockgroups_2020.csv';
await fs.writeFile(csvPath, csv, 'utf8');