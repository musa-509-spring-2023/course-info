import https from 'https';
import fs from 'fs';

const url = 'https://phl.carto.com/api/v2/sql?q=SELECT+*+FROM+business_licenses&filename=business_licenses&format=geojson&skipfields=cartodb_id';
const filename = 'business_licenses.geojson';

https.get(url, (response) => {
  const f = fs.createWriteStream(filename);
  response.pipe(f);
});