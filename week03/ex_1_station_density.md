# Bike Share Station Density by Neighborhood

In the exercises this week, we're going to use PostGIS to surface some basic information that could be used when deciding which geographic areas to focus on for new bike share stations.

These exercises depend on:
* **Bikeshare station location data** (the _easiest_ way to get this is through the [station status GeoJSON download](http://www.rideindego.com/stations/json/), though I would normally advocate for using the GBFS resources)
* **Neighborhood polygon data** (there is no official source of neighborhood boundaries in Philadelphia, but Azavea, a local Philadelphia company that creates geospatial web-based applications and analyses, has created [the go-to source](https://github.com/azavea/geo-data/tree/master/Neighborhoods_Philadelphia))
* **Park polygon data** (I recommend using the [Philadelphia Parks and Recreation (PPR) Properties dataset](https://opendataphilly.org/dataset/ppr-properties))

Load those three datasets into a database.

1.  Write a query that lists which neighborhoods have the highest density of bikeshare stations. Let's say "density" means number of stations per square km.
    * Your query should return results containing:
      * The neighborhood name (in a column named `name`)
      * The neighborhood polygon as a `geography` (in a column named `geog`)
      * The number of bike share stations per square kilometer in the neighborhood (in a column named `density_sqkm`)
    * Your results should be ordered from most dense to least dense.
    * Be sure to include neighborhoods that have zero bike share stations in your results.
    * Note that the neighborhoods dataset has an area field; don't trust that field. Calculate the area using `ST_Area` yourself.

2.  Write a query to get the average bikeshare station density across _all the neighborhoods that have a non-zero bike share station density_.
    * The query should return a single record with a single field named `avg_density_sqkm`
    * Try using a common table expressions (CTE) to write this query.

3.  Write a query that lists which neighborhoods have a density above the average, and which have a density below average.
    * Your query should return results containing:
      * The neighborhood name (in a column named `name`)
      * The neighborhood polygon as a `geography` (in a column named `geog`)
      * The number of bike share stations per square kilometer in the neighborhood (in a column named `density_sqkm`)
      * The status relative to the average density (in a column named `rel_to_avg_density`). If the density is greater than or equal the average, the field should have a value of `'above'`. If the density is less than the average, the field should have a value of `'below'`.
