This walkthrough uses data downloaded from the [Indego Data](https://www.rideindego.com/about/data/) page, specifically:
* [Station Information (CSV)](https://www.rideindego.com/wp-content/uploads/2022/12/indego-stations-2022-10-01.csv) (link current as of Jan 10 2023)
* [Real-time Station Status (GeoJSON)](https://kiosks.bicycletransit.workers.dev/phl) (should be different if you access it at different times.)

Download those files and load them into PostgreSQL tables named `indego_stations` and `indego_station_statuses`, respectively.

**For the `indego_stations` table, use R, Pandas, `csvkit`, or a `COPY` command. Ensure that the field names are `id`, `name`, `go_live_date`, and `status`. If you use a `COPY` command, create the table with the following schema:**

```sql
DROP TABLE IF EXISTS indego_stations;
CREATE TABLE indego_stations
(
  id           INTEGER,
  name         TEXT,
  go_live_date TEXT,
  status       TEXT
);
```