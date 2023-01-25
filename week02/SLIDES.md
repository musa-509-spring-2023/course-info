---
marp: true
style: |
  .focus p {
    text-align: center;
    font-size: 1.5em;
    text-decoration: underline;
  }
  .columns-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# Spatial Databases & Querying Geospatial Data

---

## Agenda

- Overview of databases
  - All different types of DBs
  - Focus on "relational databases"
  - **PostgreSQL** and **PostGIS**
- Loading data into PostgreSQL and PostGIS
  - **`ogr2ogr`** and **QGIS**
- Querying data

---

# Introduction to Databases
Let's talk about them. https://docs.google.com/presentation/d/1v-nMrK1-xhoOSA4Euq3B5xq6pSm0uv-D_485J4d_yZo/edit?usp=sharing

---

# Loading data into PostGIS

... can be a chore.

<!-- You would think it would be pretty painless, as the main reason for PostgreSQL and PostGIS to exist is to operate on stored data. However, loading data (geospatial or otherwise) can be a fairly technical and manual endeavor. -->

---

## Tabular data (in CSV format) -- the careful way

1.  Inspect the header and first few rows of the CSV file
2.  Write `CREATE TABLE` SQL statement
3.  Write `COPY` SQL statement

---

### 1. Inspect the header and first few rows

https://www.rideindego.com/wp-content/uploads/2022/12/indego-stations-2022-10-01.csv

Sometimes you may notice that some preliminary cleaning or correction must be done (as is the case with the above file).

---

### 2. `CREATE TABLE`

```sql
CREATE TABLE IF NOT EXISTS indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date DATE,
  status       TEXT
);
```

---

### 2. `CREATE TABLE`

<div class="columns-2">
<div>

```sql
CREATE TABLE IF NOT EXISTS indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date DATE,
  status       TEXT
);
```

</div>
<div>

It's almost always a good idea to use `IF NOT EXISTS`, unless you want the command to explicitly fail when the table already exists.

</div>
</div>

---

### 2. `CREATE TABLE`

<div class="columns-2">
<div>

```sql
DROP TABLE IF EXISTS indego_stations;

CREATE TABLE indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date DATE,
  status       TEXT
);
```

</div>
<div>

If you want to _replace_ the table, you would use a `DROP TABLE IF EXISTS` statement first, and then a `CREATE TABLE`.

</div>
</div>

---

### 2. `CREATE TABLE`

<div class="columns-2">
<div>

```sql
DROP TABLE IF EXISTS indego_stations;

CREATE TABLE indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date DATE,
  status       TEXT
);
```

</div>
<div>

Each of the fields on the tablel is specified in the form:

```
  field_name  FIELD_TYPE
```

I recommend that field names be in "snake_case" -- i.e. lower-case with underscores (`_`) connecting words.

</div>
</div>

---

### 2. `CREATE TABLE`

<div class="columns-2">
<div>

```sql
DROP TABLE IF EXISTS indego_stations;

CREATE TABLE indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date DATE,
  status       TEXT
);
```

</div>
<div>

The PostgreSQL documentation on the `CREATE TABLE` statement is [here](https://www.postgresql.org/docs/current/sql-createtable.html).

Even though SQL is standard, each DB's flavor of SQL has its own documentation. E.g., here's the [docs for `CREATE TABLE` for SQLite](https://www.sqlite.org/lang_createtable.html).

Try to get good at reading those statemetn diagrams.

</div>
</div>

---

### 3. `COPY`

```sql
COPY indego_stations
FROM '...path to file goes here...'
WITH (FORMAT csv, HEADER true);
```

---

### 3. `COPY`

<div class="columns-2">
<div>

```sql
COPY indego_stations
FROM '...path to file goes here...'
WITH (FORMAT csv, HEADER true);
```

</div>
<div>

The `FROM` value should contain the **full path** to the CSV file you're trying to load.

</div>
</div>

---

### 3. `COPY`

<div class="columns-2">
<div>

```sql
COPY indego_stations
FROM '...path to file goes here...'
WITH (FORMAT csv, HEADER true);
```

</div>
<div>

You can do things like specify column order, use different CSV delimiters (e.g. if your file is a tab-separated instead of comma-separated), and many more options. Refer to the full [`COPY` documentation](https://www.postgresql.org/docs/current/sql-copy.html).

</div>
</div>

---

## Tabular data (in CSV format) -- the GUI way

- You can also load with pgAdmin (but you still have to manually specify the table columns)
  1.  Right-click on a schema and select **Create > Table...**
  2.  Give the table a name -- remember the

---

## Tabular data -- quick ways

- With a tool like `csvsql` (a part of csvkit)
- With Pandas
- With R

---

### Loading with `csvsql`

- Comes from a _very handy_ library called `csvkit`
- ```bash
  csvsql \
    --db postgresql://postgres:postgres@localhost:5432/musa_509 \
    --tables csvkit_indego_stations \
    --create-if-not-exists \
    --insert \
    --overwrite \
    data/indego_stations.csv
  ```
  (replace the back slashes (`\`) above with back ticks (`` ` ``) if you're in Windows PowerShell)

---

### Loading tabular data with Pandas

```python
import pandas as pd

# Load the CSV into a DataFrame.
df = pd.read_csv('data/indego_stations.csv')

# Load the DataFrame into the database.
USERNAME = 'postgres'
PASSWORD = 'postgres'
DATABASE = 'musa_509'

df.to_sql(
    'indego_stations',
    f'postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DATABASE}',
    if_exists='replace',
    index=False,
)
```

---

### Loading tabular data with R

```r
library(RPostgreSQL)

# Load the CSV into a DataFrame.
df <- read.csv('data/indego_stations.csv')

# Load the DataFrame into the database.
drv <- dbDriver('PostgreSQL')
con <- dbConnect(drv,
    user = 'postgres', password = 'postgres',
    dbname = 'musa_509', host = 'localhost')

if (dbExistsTable(con, 'r_indego_stations'))
    dbRemoveTable(con, 'r_indego_stations')

dbWriteTable(con,
    name = 'r_indego_stations',
    value = df, row.names = FALSE)
```

---

## Loading spatial data files

- With `ogr2ogr`
- With `shp2pgsql` (or the `shp2pgsql` GUI on Windows only)
- With QGIS
- With Python/R

<!-- These aren't the only ways to get data into your database; e.g. you could also use SQL with `CREATE TABLE` and `ST_GeomFromText` or `ST_GeomFromGeoJSON` if you have GeoJSON -->

---

## A quick aside: Frequent acronyms

Acronyms you may see over and over:
- OSGeo
- OGC/OpenGIS
- OGR (as in `ogr2ogr`)
- GDAL
- GEOS
- PROJ (as in `proj.db contains DATABASE.LAYOUT.VERSION.MINOR = 0 whereas a number >= 2 is expected. It comes from another PROJ instillation.`)

---

### **OSGeo** -- _Open Source Geospatial Foundation (https://www.osgeo.org/)_

"a not-for-profit organization whose mission is to foster global adoption of open geospatial technology by being an inclusive software foundation devoted to an open philosophy and participatory community driven development."

<!-- If you're not familiar with what open source is ... there are various philosophical frameworks for OS, but generally it's software where you have access to the source code, and frequently where you can participate in the shaping or writing of that software.  -->

---

<div class="focus">

**OSGeo is a software community.**

</div>

---

### **OGC** -- _Open Geospatial (OpenGIS) Consortium (https://www.ogc.org/)_

"a worldwide community committed to improving access to geospatial, or location information. … Our community creates free, publicly available geospatial standards that enable new technologies."  The difference with OSGeo is that "OGC is the place where many collaborate on creating standards, OSGeo is the place where many collaborate on implementing software" https://wiki.osgeo.org/wiki/The_definition_of_Open_in_OGC,_OSGeo_and_OSM

---

<div class="focus">

**OGC/OpenGIS is a standards community.**

</div>

---

### **OGR** -- Kinda stands for _OpenGIS Reference_, but also not really anymore...and it kinda never did. Now it's just OGR (like KFC)

"OGR used to be a separate vector IO library inspired by [**OpenGIS** Simple Features](https://www.ogc.org/standards/sfa) which was separated from GDAL. With the GDAL 2.0 release, the GDAL and OGR components were integrated together. [You'll often see people refer to **GDAL/OGR**] … OGR used to stand for _OpenGIS Simple Features Reference Implementation_. However, since OGR is not fully compliant with the OpenGIS Simple Feature specification and is not approved as a reference implementation of the spec the name was changed to OGR Simple Features Library. The only meaning of OGR in this name is historical." https://gdal.org/faq.html

---

### **GDAL** -- _Geospatial Data Abstraction Library (https://gdal.org/)_

**An OSGeo project** and a "translator library for raster and vector geospatial data formats"

<!-- GDAL knows how to read data from a number of formats, and write data to a number of formats. So, it's good at translating between data file formats. It does this by using an internal data model that is independent of any particular file format. That's what OGR was for originally, and why it's part of GDAL. -->

---

### **GEOS** -- _Geometry Engine - Open Source (https://libgeos.org/)_

**An OSGeo project** and "a C/C++ library for computational geometry with a focus on algorithms used in geographic information systems (GIS) software. It implements the OGC Simple Features geometry model and provides all the spatial functions in that standard as well as many others."

---

### **PROJ** -- I don't know whether it stands for something or is just short for _projection_ (https://proj.org/)

**An OSGeo project** and "a generic coordinate transformation software [system] that transforms geospatial coordinates from one coordinate reference system (CRS) to another."

<!-- There are a lot of libraries like this where you look at it and say "that seems oddly specific", and they're often built to manage ostensibly mathematical processes that are based around very socially constructed realities. For example there are multiple libraries in Python and JavaScript that just deal with managing time zones on temporal data. -->

---

### Loading data with `ogr2ogr`

Let's use http://www.rideindego.com/stations/json/

We saw something like this last week:

```sh
ogr2ogr \
  -f "PostgreSQL" \
  -nln "indego_station_statuses" \
  -lco "OVERWRITE=yes" \
  -lco "GEOM_TYPE=geography" \
  -lco "GEOMETRY_NAME=the_geog" \
  PG:"host=localhost port=5432 dbname=musa_509 user=postgres password=postgres" \
  "data/indego_station_statuses.geojson"
```

**Reading from GeoJSON format ⇨ Writing to PostgreSQL tabular format**

---

### Loading data with `ogr2ogr`

- "Drivers" determine the types of formats `ogr2ogr` can translate between. A driver just has to know how to convert data from a single format into an OGR model (or vice versa).
- Full documentation at https://gdal.org/programs/ogr2ogr.html (so many options 😵‍💫)
- Each driver may have even more driver-specific options; e.g., [the options for PostGIS](https://gdal.org/drivers/vector/pg.html#dataset-open-options).
- Here are some common commands you might need: https://morphocode.com/using-ogr2ogr-convert-data-formats-geojson-postgis-esri-geodatabase-shapefiles/

<!-- One of the _most useful_ but _least friendly_ command line interfaces. -->

---

### Loading data with QGIS

- Remember that PostgreSQL is just a server running on a computer, and many clients can potentially connect to it. QGIS can act as one of those clients.
- A walkthrough: https://www.crunchydata.com/blog/loading-data-into-postgis-an-overview
  - In our case we have to deselect the JSON field `bikes`, and maybe the array field `coordinates`.

---

### Loading data with GeoPandas

```python
import geopandas as gpd
import sqlalchemy as sqa

# Load the shp into a DataFrame.
df = gpd.read_file('data/indego_station_statuses.geojson')

# Load the DataFrame into the database.
USERNAME = 'postgres'
PASSWORD = 'postgres'
DATABASE = 'musa_509'

engine = sqa.create_engine(
    f'postgresql://{USERNAME}:{PASSWORD}@localhost:5432/{DATABASE}'
)
df.to_postgis(
    'pandas_indego_station_statuses',
    engine,
    if_exists='replace',
    index=False,
)
```

---

### Loading data with R

?

(someone who knows R better than I do, let me kno how to do this)