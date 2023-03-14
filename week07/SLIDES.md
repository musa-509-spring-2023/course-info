---
marp: true
style: |
  .columns-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# More **E**xtracting and **t**ransforming

---

## Agenda

1.  More extracting and (little-t) transforming files
    * Common libraries
    * Zip files like shapefiles
    * Zip files like GTFS
    * API resources like Census
2.  Loading into BigQuery (via Google Cloud Storage)
3.  Deploying to Google Cloud Platform (GCP)?
    * Service Accounts
    * Cloud Functions
    * Cloud Scheduler
    * Workflows
4.  Estimating costs

---

## More extracting and (little-t) transforming files

This is the **Et** of **EtLT**. We will:
1.  **Extract** -- Download data from somewhere on the web and save it to a file (unzipping if necessary).
3.  **transform** -- Read the data from the file, convert to a format that can be loaded into BigQuery (we used JSON-L the other day, but we'll use CSV today), and save to a new file.

<!-- We're going to prepare a bunch of different file types for loading into BigQuery. Specifically, we'll be working with:
- GTFS (General Transit Feed Specification) feeds
- Decenial census data from the census API
- Shapefiles from the Census Bureau
-->

---

### But first ... files, and streams, and buffers (oh my 🦁!)

<div class="columns-2">
<div>

![Python h:32](images/Python_icon.png)

In python there are **file-like objects**. Typically any functions that read or write data will take a file-like object argument.
- For example, `csv.reader`, `json.load`, `zipfile.ZipFile` all accept file-like objects
- We can use `open` to open a file on disk, or we can use `io.StringIO` or `io.BytesIO` to treat any `str` or `byte` data like a file.

</div>
<div>

![Node.js h:32](images/Node.js_icon.png)

In Node.js, we'll most frequently either use **streams** or **buffers**. Streams are a way to read and write data in chunks.  Buffers are used to represent a sequence of bytes.
- For example, `fs.createReadStream` and `fs.createWriteStream` are used to read and write data in chunks
- We can use `Buffer.from` to convert a `String` or `Array` object into a buffer.


</div>
</div>

---

### Common libraries

Last week we used `urllib.urlopen` in Python and `https.get` in Node.js to download files from the web.  This week we'll use a few more common libraries.

<div class="columns-2">
<div>

![Python h:32](images/Python_icon.png)

* [`requests`](https://requests.readthedocs.io/en/master/)
* [`csv`](https://docs.python.org/3/library/csv.html) _(core)_
* [`zipfile`](https://docs.python.org/3/library/zipfile.html) _(core)_
* [`fiona`](https://fiona.readthedocs.io/en/latest/) & [`pyproj`](https://pypi.org/project/pyproj/)

Install dependencies:
```bash
pip install requests fiona pyproj
pip freeze > requirements.txt
```

</div>
<div>

![Node.js h:32](images/Node.js_icon.png)

* [`node-fetch`](https://www.npmjs.com/package/node-fetch)
* [`csv`](https://www.npmjs.com/package/csv)
* [`adm-zip`](https://www.npmjs.com/package/adm-zip)
* [`gdal-async`](https://www.npmjs.com/package/gdal-async)

Install dependencies:
```bash
npm install --save \
  node-fetch csv adm-zip gdal-async
```

</div>
</div>

