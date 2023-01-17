---
marp: true
style: |
  .columns-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# Welcome to MUSA509: Geospatial Cloud Computing & Visualization

---

## Agenda

1.  Course content overview
    - Goals
    - Content overview
1.  Logistics
1.  Interactive: Set up tools
    - PostgreSQL & PG Admin
    - VS Code (with useful extensions)
    - A Terminal
    - GitHub

---

## Goals of this _track_ (611 & 509)

Give you the skills to build **data-centric cloud-based applications and reports**, powered by data pipelines that take raw data (spatial and otherwise) from around the web, **to provide answers to operational questions**.

By the end of _this_ course, you'll have built your own data-centric operational tool in the cloud.

---

## Data-centric Cloud-based Tools?

- Let's talk about it.
  https://docs.google.com/presentation/d/1JX-y6-s0PUilrR6_NlFmqc7w_2F_OaznORmtu-TTlpI/edit?usp=sharing

---

# Overview of Skills & Technologies

---

## Spatial Databases

![bg vertical right:30% 80%](PostgreSQL_logo.webp)
![bg right:30% 80%](PostGIS_logo.png)

Databases are a super power once you learn a bit about them. We’ll learn lots of **SQL**, a very transferable skill

How we’ll use them:
- Querying data efficiently
- Managing datasets with explicit relationships between them
- Query geography (e.g., give me all bike share stations within 500 meters of a cafe), etc.

---

## Large, messy datasets

![bg vertical right:30% 80%](dbt-signature_tm.png)
![bg right:30% 80%](GoogleBigQuery_logo.png)

We will work with large and/or messy datasets such as OpenStreetMap (global), US Census (national), Philadelphia Office of Property Assessment (local), SafeGraph (proprietary) and more, in a variety of formats.

We’ll cover:
- Techniques for taming these datasets
- Using tools to access, store, and transform datasets
- Best practices for modeling and organizing data

---

## Data Visualization Platforms

![bg vertical right:30% 70%](Carto_logo.png)
![bg vertical right:30% 80%](Metabase_logo.png)
![bg vertical right:30% 60%](Redash_logo.png)

We'll get introduced to some common platforms for visualizing data stored in cloud repositories. These can be good for lightweight exploration of data, or quick prototyping of dashboards.

---

## Enough scripting to be dangerous

![bg vertical right:30% 80%](Python_logo.png)
![bg right:30% 80%](Node.js_logo.png)
![bg right:30% 80%](GoogleCloudFunctions_logo.png)

**Python** and **JavaScript** are powerful programming languages with a huge communities, which means that there are a lot of amazing packages.

We need these scripting languages to:
- Fetch process data from around the web
- Build APIs to serve up processed data
- Provide glue between a user interaction on a webpage and a database transaction

---

## API basics and HTTP requests

An Application Programming Interface (**API**) gives an interface for computers to communicate with one another. We will learn patterns that will help us extract dynamic data from a number of sources through APIs, and to create our own APIs.

Where possible, examples will be given in the approximately equivalent Python and JavaScript.

<div class="columns-2">
<div>

![Python h:32](Python_icon.png)

```py
from flask import Flask
app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello, World!'
```
</div>

<div>

![Node.js h:32](Node.js_icon.png)

```js
import express from 'express';
const app = express();
  
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
```
</div>

---

## Cloud Services

![bg vertical right:30% 80%](GoogleCloudPlatform_logo.png)
![bg right:30% 80%](MicrosoftAzure_logo.png)
![bg right:30% 60%](AmazonWebServices_logo.png)

Our final work will all be in the cloud!

- Data will be stored in Google Cloud Storage
- Pipelines and servers will be run in Google Cloud Functions
- We’ll use Google Cloud for accessing data in BigQuery

Though we'll work in Google Cloud for this class, I'll mention analagous services in Amazon Web Services (AWS), Microsoft Azure, etc. when applicable.

---

# Logistics

---

## Living Course Info

https://github.com/musa-509-spring-2023/course-info

Contains the syllabus, schedule, assignments, etc.

---

## Class format

...

---

## Books

There will occasionally be readings from the following books to provide more depth on certain core topics. Both are available from [O'Reilly for Higher Education](http://pwp.library.upenn.edu.proxy.library.upenn.edu/loggedin/pwp/pw-oreilly.html):
  - _Data Pipelines Pocket Reference_ by James Densmore
  - _Designing Data-Intensive Applications_ by Martin Kleppmann

---

# Questions?

---

## Let's get configured!

- **VS Code** (or your editor of choice) and extensions
  - sqlfluff
  - eslint (for JavaScript)
  - flake8 (for Python)
- A command line terminal (you can use the one embedded in VS Code)
- A **git** client (e.g. **GitHub Desktop**, or the VS Code git tools, _but also ensure that you can run `git` on the command line_, just in case you need it)
- **PostgreSQL** and a client such as **PGAdmin** ([sneak peek at next week's slides](https://docs.google.com/presentation/d/1v-nMrK1-xhoOSA4Euq3B5xq6pSm0uv-D_485J4d_yZo/edit#slide=id.g1d409c96e66_0_0))
  - [PostgreSQL setup instructions](ex_postgres.md)
