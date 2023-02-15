---
marp: true
style: |
  .columns-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# Into the Cloud 😶‍🌫️

---

## Agenda

1. Intro to Cloud Services (and GCP specifically)
2. Intro to Data Warehouses (and BigQuery specifically)
3. Intro to Business Intelligence Platforms (and Carto specifically)
3. A Data-visualization-in-the-cloud Exercise

---

## Intro to Cloud Services
https://docs.google.com/presentation/d/1WcuSZ3BJz5wPfrbS9qNCJ20Axr6m0PIKLFMu-ljfdoI/edit?usp=sharing

---

## Let's try out BigQuery!

<!-- We're going to load a dataset into BigQuery and then do some light visualization with it. To load it into BigQuery we're going to use something called "external tables".

External tables allow us to upload data to Google Cloud Storage and query it from there as if it were a native table in BigQuery. In other words, loading data into BigQuery could often be as easy as uploading a CSV file to a Google Cloud Storage folder.

CSV isn't the only format that's supported for external tables; for example, we're going to use a format called Newline Delimited JSON, or "JSON-L".

But we'll get to that. -->

---

### 1. Download the OPA Properties dataset

Download the Office of Property Assessment's (OPA) property data from [OpenDataPhilly](https://opendataphilly.org/dataset/opa-property-assessments) in GeoJSON format.

<!-- Download the OPA property data from opendataphilly in GeoJSON format. We could use the CSV, but we're going to make a point. -->

---

### 2. Convert the OPA Properties dataset to JSON-L

<!-- In the Data Pipelines Pocket Reference you're going to read about different patterns used in data pipelines. People often talk about "ETL" and "ELT", but Densmore (the author) also refers to "EtLT", which is a pattern we're going to employ often.

We can use a small script to load the raw data that we downloaded and transform it into a format that's more suitable for BigQuery. -->

<div class="columns-2">
<div>

![Python h:32](images/Python_icon.png)

```python
import json

# Load the data from the GeoJSON file
with open('opa_properties.geojson') as f:
    data = json.load(f)

# Write the data to a JSONL file
with open('opa_properties.jsonl', 'w') as f:
    for feature in data['features']:
        row = feature['properties']
        row['geog'] = json.dumps(feature['geometry'])
        f.write(json.dumps(row) + '\n')
```

</div>
<div>

![Node.js h:32](images/Node.js_icon.png)

```javascript
import fs from 'node:fs';

// Load the data from the GeoJSON file
const data = JSON.parse(
  fs.readFileSync('opa_properties.geojson'));

// Write the data to a JSONL file
const f = fs.createWriteStream('opa_properties.jsonl');
for (const feature of data.features) {
  const row = feature.properties;
  row.geog = JSON.stringify(feature.geometry);
  f.write(JSON.stringify(row) + '\n');
}
```

</div>
</div>

_Copy the code above into a file called `opa_properties.py` or `opa_properties.js` and run it._

<div class="columns-2">
<div>

```bash
python3 opa_properties.py
```

</div>
<div>

```bash
node opa_properties.js
```

</div>
</div>

---

### 3. Upload the resulting JSONL file to Google Cloud Storage

- Log in to the **Google Cloud Console** (https://console.cloud.google.com)
- Find the **Google Cloud Storage** service
- Create a new bucket in Google Cloud Storage (maybe call it `data_lake`)
- Create a new folder in the bucket (maybe call it `phl_opa_properties`)
- Upload the JSONL file to the folder

---

### 4. Create a new dataset in BigQuery

- Navigare to the **BigQuery** service
- Create a new dataset in BigQuery (maybe call it `data_lake`)
- Also create a new dataset in Carto (maybe call it `phl`; we'll use this later)

---

### 5. Create the external table

```sql
CREATE OR REPLACE EXTERNAL TABLE `data_lake.phl_opa_properties` (
  `opa_account_num` STRING,
  `owner_name` STRING,
  `mailing_address` STRING,
  `mailing_city` STRING,
  ...
)
OPTIONS (
  description = 'Philadelphia OPA Properties - Raw Data',
  uris = ['gs://data_lake/phl_opa_properties/*.jsonl'],
  format = 'JSON',
  max_bad_records = 0
)
```

---

### 6. Create a native table from the external table

```sql
CREATE OR REPLACE TABLE `phl.opa_properties`
CLUSTER BY (geog)
AS (
  SELECT *
  FROM `data_lake.phl_opa_properties`
)
```

---

## Let's try out Carto!
