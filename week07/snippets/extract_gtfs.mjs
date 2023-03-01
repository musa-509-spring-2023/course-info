import fetch from 'node-fetch';
import Zip from 'adm-zip';

const __dirname = new URL('.', import.meta.url).pathname;
const DATA_DIR = __dirname + 'raw_data/';

// Get the GTFS data from the SEPTA GitHub repository
const url = 'https://github.com/septadev/GTFS/releases/download/v202302261/gtfs_public.zip';
const response = await fetch(url);

console.log(`Received ${response.status} response...`);
console.log(`Content-Length: ${response.headers.get('content-length')}`);

// The response contains a zip file. Wrap the response in a buffer and open it
// with the adm-zip library.
const buffer = Buffer.from(await response.arrayBuffer());
const fullZip = new Zip({input: buffer});

// There should be two other zip files inside the one. Unzip them both and save
// the contents to the ./raw_data directory.
for (const gtfsFeed of fullZip.getEntries()) {
  const gtfsFeedName = gtfsFeed.entryName;
  const gtfsFeedData = gtfsFeed.getData();
  const gtfsFeedZip = new Zip(gtfsFeedData);
  const gtfsType = /google_(\w+).zip/.exec(gtfsFeedName)[1];

  gtfsFeedZip.extractAllTo(DATA_DIR + 'septa_' + gtfsType, true);
  console.log(`Extracted into ${DATA_DIR}septa_${gtfsType}...`);
}
