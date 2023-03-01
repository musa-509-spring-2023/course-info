# Load Data Into Bigquery

We're going to use external tables to load data into BigQuery. Note that there are [many ways](https://cloud.google.com/bigquery/docs/tables#create-table) to create tables in BigQuery, but we're going to use external tables. After you write your `CREATE EXTERNAL TABLE` statement, be sure to save it somewhere so that you can re-run it if necessary.

Let's use the following datasets:
* The OPA Properties dataset
* The L&I Zoning permits back to 2016
* The PWD Parcels dataset

1.  Write a script that takes the raw data and converts the PWD parcels to CSV or JSON-L (do the same for the other datasets as desired -- not as important, since you can download them as CSVs)
2.  Upload your data to a Google Cloud Storage bucket
    - Create a bucket in your GCP project named `external_tables` or `data_lake` something obvious like that.
    - Create a folder in the bucket for each table. Name them something like `phl_opa_properties`, `phl_li_permits`, and `phl_pwd_parcels`.
    - Upload the data to the appropriate folder
3.  Create external tables in BigQuery based on the data in storage
    - Create a dataset in your GCP project named `external_tables` or `data_lake` to mirror your storage bucket.
    - Construct a `CREATE OR REPLACE EXTERNAL TABLE` statement for each table. Write the statement in a file so that you can save it and re-run it if necessary
4.  Copy your data to native BigQuery tables
    - Create a dataset in your GCP project named `phl`
    - Copy the data from your external tables using a `CREATE TABLE AS ...` statement
3.  Create a few maps in Carto:
    - Find hotspots of properties that have been sold in the last 5 years
    - Find hotspots of properties that have been rezoned within the last 3 years
    - Find recently sold properties within a a half kilometer of a rail station


