import {parse, stringify} from 'csv/sync';
import fs from 'node:fs/promises'

const __dirname = new URL('.', import.meta.url).pathname;
const RAW_DATA_DIR = __dirname + 'raw_data/';
const PROCESSED_DATA_DIR = __dirname + 'processed_data/';

const GTFS_FEEDS = ['septa_bus', 'septa_rail'];

for (const gtfsFeed of GTFS_FEEDS) {
  const gtfsFeedFolder = RAW_DATA_DIR + gtfsFeed + '/';
  for (const gtfsFileName of await fs.readdir(gtfsFeedFolder)) {

    // Read the data from the raw GTFS CSV file.
    const gtfsFilePath = gtfsFeedFolder + gtfsFileName;
    const content = await fs.readFile(gtfsFilePath, 'utf8');
    const data = parse(content, {skip_empty_lines: true});

    // Write the data to a new processed CSV file, creating the folder if it
    // doesn't exist.
    const outputFolder = PROCESSED_DATA_DIR + gtfsFeed + '/';
    const outputPath = outputFolder + gtfsFileName.replace('.txt', '.csv');
    await fs.mkdir(outputFolder, {recursive: true});
    await fs.writeFile(outputPath, stringify(data), 'utf8');
  }
}