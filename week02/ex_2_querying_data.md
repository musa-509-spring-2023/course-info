1.  Query all the data in the `indego_stations` table.

    ```sql
    SELECT * FROM indego_stations
    ```

    Look through the `go_live_date` values. There are a few dates that have a number of stations going live.

2.  Say we want to see all the stations that went live on a given date. You can filter based on equality.

    ```sql
    SELECT * FROM indego_stations
    WHERE go_live_date = '5/3/2016'
    ```

    You should see 4 resulting records, all with `go_live_date` of May 3, 2016.

3.  Now say we want to see all stations that went live _after_ a given date. You can also use inequalities to filter.

    ```sql
    SELECT * FROM indego_stations
    WHERE go_live_date > '5/3/2016'
    ```

    Depending on how you loaded the station information data into PostgreSQL, this may not do what you expect. If you loaded the data using Python, R, or `csvkit`, or you defined the `go_live_date` column in the table to have a type of `TEXT`, then the ordering is incorrect. This is why data types are important. Depending on the _type_ of data, we have different sets of operations to choose from, and those operations may behave differently.

    [Complete list of _built-in_ PostgreSQL data types](https://www.postgresql.org/docs/current/datatype.html#DATATYPE-TABLE)

    The `go_live_date` is stored as a `text` field. We can see this by clicking on the `indego_stations` table in the tree in PGAdmin and browsing to the **SQL** tab.

4.  We can convert the field to a `DATE` type using an `ALTER TABLE` statement. See if you can use the [`ALTER TABLE` documentation](https://www.postgresql.org/docs/current/sql-altertable.html) to construct a statement that changes the type of the `go_live_date` column to a `DATE`.

5.  Re-run the command:

    ```sql
    SELECT * FROM indego_stations
    WHERE go_live_date > '5/3/2016'
    ```

    You should see results that begin...:

    | id | name | go_live_date | status |
    |----|------|--------------|--------|
    | 3110 | Del. River Trail & Penn St. | 2016-05-04 | Active |
    | 3107 | 33rd & Reservoir | 2016-05-04 | Active |
    | 3108 | 15th & Market | 2016-05-04 | Inactive |
    | 3115 | 19th & Girard, PTTI | 2016-05-04 | Active |
    | 3106 | 33rd & Dauphin | 2016-05-05 | Active |
    | 3111 | Parkside & Belmont, Case Building | 2016-05-05 | Active |
    | 3112 | 48th & Spruce | 2016-05-05 | Active |
    | 3114 | 22nd & Federal | 2016-05-05 | Active |
    | 3109 | Parkside & Girard | 2016-05-06 | Inactive |
    | 3113 | Philadelphia Zoo | 2016-05-06 | Active |
    | ...  | ... | ... | ... |