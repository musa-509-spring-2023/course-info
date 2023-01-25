1.  Query all the data in the `indego_station_statuses` table.

    ```sql
    SELECT * FROM indego_station_statuses
    ```

    Scroll over to the geometry column and map all the stations.

2.  Say we want to see all the stations that are north of Meyerson Hall. Find a latitude for Meyerson Hall, and we can use the PostGIS function `ST_Y` to find the results:

    ```sql
    SELECT * FROM indego_station_statuses
    WHERE ST_Y(geometry) > ...  -- Meyerson Hall latitude
    ORDER BY ST_Y(geometry);
    ```

    Map those results to verify the outcomem (you should have around 105 records, possibly starting with "23rd & Chestnut", "12th & Filbert", "9th & Arch", "19th & Market", and "Race Street Pier").
