---
marp: true
paginate: true
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

# Data types, Aggregations, Geospatial Operations, and Joins

---

## Agenda

- Data types
  - Functions and operators
  - Dates
  - Spatial types
- Spatial operations
- Joins

---

## PostgreSQL Data Types, a sampling

| Data Type | Example |
|---|---|
| Boolean | `true`, `false`, `null` |
| Numbers | `1`, `3.1415`, `-1.2e-7`, `null` |
| Text | `‘Musa’`, `‘a’`, `‘1234’`, `null` |
| Date/time (timestamp/time with/without time zone, date, interval) | `‘2020-09-08’::date` <br> `to_timestamp(1599572175)` <br> `Interval ‘4 days 3 hours 13 seconds’` |
| Money | `$10`, `¥10`, `€10`, `null` |
| Arrays of any type | `[1, 2, 3, 4]`, `[‘banana’, ‘orange’, ‘apple’]`, `null` |
| JSON (as JSONB) | `{‘a’: 1, ‘b’: 2, …}`, `null` |

---

## Each data types has functions and operators

- Boolean - `AND`, `OR`
- Numbers (integers, floating point numbers) - `+`, `-`, `AVG`, `SUM`, `CORR`
- Text - `STRING_AGG`, `||` (concatenate), `LIKE`, substrings, etc.
- Date/time - `-` (intervals), `EXTRACT` date parts, timezone conversion

---

## You can "cast" data between types

**cast** (_v._) - Convert a value from one data type to another.

```sql
SELECT CAST('121' AS integer);

SELECT CAST(121 AS text);

SELECT CAST('SRID=4326;POINT(-75.16 39.95)' AS geometry);
```

<!-- Here some examples of casting data -- from text to integer, from integer to text, and from text to geometry. -->

---

## Casting data (_PostgreSQL-specific syntax_)

**cast** (_v._) - Convert a value from one data type to another.

```sql
SELECT '121'::integer;

SELECT 121::text;

SELECT 'SRID=4326;POINT(-75.16 39.95)'::geometry;
```

<!-- PostgreSQL also has a specific casting syntax using two consecutive colons. Each of these do exactly the same thing as the Cast operator above. I like the colon syntax, however it's worth noting that the "cast" syntax is easier to port to other databases, for cases where that matters. -->

---

## Working with `date` data

- Some of you may have run into problems reading the date columns in last week's exercises
- Dates are ambiguous (e.g. `6/10/2016`)
- It helps to be explicit when casting from `text` to `date`

---

## Converting `text` to `date`

Try the following SQL:

```sql
SELECT '6/10/2016'::date;
```

Depending on what language/region your computer is configured for, this may:
* Give the date value June 10, 2016
* Give the date value October 6, 2016
* Result in an error

---

## Converting `text` to `date`

Try the following SQL:

```sql
SHOW DateStyle;
```

My setting is `ISO,MDY`. That's not right or wrong, it's just what's expected in a computer set to a US/English region and language.

`ISO` refers to [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) -- i.e. **`YYYY-MM-DD`**. Pretty much any DB will accept this. The other value (e.g. `MDY`) is specific to the "locale" (the region and language).

<!-- I say region AND language because it's not just language. For example, for UK English, DMY is expected. -->

---

## Converting `text` to `date`

To be safe, specify the expected date format if at all possible.

```sql
SELECT to_date('6/10/2016', 'DD/MM/YYYY');
```
The above will _always_ result in October 6, 2016. If you have a column named `my_date` on a table `my_table` and want to convert the whole column, you can:

```sql
ALTER TABLE my_table
ALTER COLUMN my_date TYPE date
    USING to_date(my_date, 'DD/MM/YYYY');
```

---

## Spatial data types

The PostGIS extension to PostgreSQL adds two data types:
- `geometry`
- `geography`

---

## `geometry` vs `geography`

|   | Speed | Simplicity |
| --- | --- | --- |
| `geometry` | 🏅 |   |
| `geography` |   | 🏅 |

Interesting (slightly technical) discussion on the speed differences at:
https://medium.com/coord/postgis-performance-showdown-geometry-vs-geography-ec99967da4f0

---

## `geometry` vs `geography`

**The PostGIS documentation [recommends](http://postgis.net/workshops/postgis-intro/geography.html#why-not-use-geography):**
* If your data is geographically compact, use the `geometry` type with an [appropriate projection](http://epsg.io).
* If you need to measure distance with a dataset that is geographically dispersed, use the `geography` type.

**My recommendation? ...**

---

<div style="text-align: center">

<div style="font-size: 2em">

**Use `geography`**

<!-- Most of the data that you're going to put in the database is already going to be in degrees of longitude and latitude, and it's just a cognitive burden that you don't have to worry about. And if you need one of the functions that's only available for geometries, casting to `geometry` is pretty easy if you know the target SRID. -->

</div>

...until you can't

<!-- If you determine that your queries are too slow, and measuring spatial distance is a common operation, then you may be well served by converting to geometry. In those cases, you may want to note the difference explicitly. For example, you could have a `geog` column and a `geom_32129`.

Generally, you should always allow simplicity to win (unless you _need_ the complexity). Do things simple way and switch to the complex way if it proves to be a bottleneck. -->

</div>

---

# Spatial Operations
https://postgis.net/docs/PostGIS_Special_Functions_Index.html#PostGIS_SQLMM_Functions

---

## _Constructors_: Create spatial data values

- Casting from text to geometry/geography
  [Well-known Text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)
- Functions
  - `ST_GeomFromText`, `ST_GeomFromGeoJSON`
  - `ST_MakePoint`, `ST_MakeLine`, etc. (e.g., on a table with only lat and lng)

<!-- When you have a static value (like the location of Meyerson Hall) it may be easiest to use ST_GeomFromText. When you have a table of latitudes and longitudes, like the Indego trip history, ST_MakePoint may be best. -->

---

## _Transformers_: Generate new geometries from the input of one or more other geometries

- `ST_Buffer`
- `ST_ClosestPoint`
- `ST_ConvexHull`
- `ST_Difference`
- `ST_Intersection`
- `ST_Union`

---

## _Accessors_: Getting components of spatial values

- `ST_X`
- `ST_Y`
- `ST_Endpoint`
- `ST_Centroid`

---

## _Predicates_: Determine whether relationships between geometries are true or false

- `ST_Contains`
- `ST_Intersects`
- `ST_Disjoint`
- `ST_Equals`
- `ST_DWithin`

---

## _Measures_: Compute measurements with respect to one or more geometries

- `ST_Angle`
- `ST_Area`
- `ST_Azimuth`
- `ST_Perimiter`
- `ST_Distance`

---

# Joins
https://docs.google.com/presentation/d/1cygMG2NvRY6jalYG8rNPv6s8IqSVxEvii1cmhGKXDLU/edit?usp=sharing

---

# A few tips for writing queries

---

## Tip 1: Each entity should have a unique identifier

- Think of an "entity" as a real-world thing that is being represented in a table. For example:
  - a bike share station
  - a neighborhood
- Ideally, each table has a column that uniquely identifies each entity (I like calling this column `id`).
- Helps with joins and aggregations.

---

## Tip 2: Be consistent in your style

- It doesn't matter whether you use uppercase or lowercase keywords; just be consistent.
- Always use lowercase/snake_case identifiers (table names, field names, schema names, etc.)
- The linter will help.

---

## Tip 3: Use common table expressions to keep your queries readable*

<!-- Occasionally you'll have to use a query to calculate some intermediate step in your analysis. For those times you'll either use subqueries embedded directly in your query, or you'll use common table expressions.

* I'm aware that, especially if this is all your first introduction to SQL, none of it may look very readable. Once you are more comfortable with the syntax I hope you'll recognize the difference that CTEs make. For now, let's lean toward the CTE syntax. -->

* Common table expressions (CTEs) are a good way to represent intermediate steps in your queries.
* Example: Which neighborhoods have an above- or below-average density of trees?

---

**Without CTEs...**

Step 1: What's the density of trees in each neighborhood?

```sql
SELECT
    nbd.id AS neighborhood_id,
    COUNT(*) / ST_Area(nbd.geog) AS tree_density
FROM azavea.neighborhoods AS nbd
LEFT JOIN phl.ppr_tree_inventory AS tree
    ON ST_Contains(nbd.geog::geometry, tree.geog::geometry)
GROUP BY neighborhood_id
```

---

**Without CTEs...**

Step 2: What's the average neighborhood tree density?

```sql
SELECT
    AVG(tree_density) AS avg_tree_density
FROM (

    -- Calculate tree density in each neighborhood...
    SELECT
        nbd.id AS neighborhood_id,
        COUNT(*) / ST_Area(nbd.geog) AS tree_density
    FROM azavea.neighborhoods AS nbd
    LEFT JOIN phl.ppr_tree_inventory AS tree
        ON ST_Contains(nbd.geog::geometry, tree.geog::geometry)
    GROUP BY neighborhood_id

) AS neighborhood_tree_densities
```

---

**Without CTEs...**

Step 3: Which neighborhoods have an above-average tree density?

```sql
SELECT
    nbd.id,
    CASE
        WHEN COUNT(*) / ST_Area(nbd.geog) > avg_tree_density THEN 'above'
        WHEN COUNT(*) / ST_Area(nbd.geog) = avg_tree_density THEN 'equal'
        ELSE 'below'
    END AS rel_to_avg_density
FROM azavea.neighborhoods AS nbd
LEFT JOIN phl.ppr_tree_inventory AS tree
    ON ST_Contains(nbd.geog::geometry, tree.geog::geometry)
CROSS JOIN (

    -- Calculate average tree density across neighborhoods...
    SELECT AVG(tree_density) AS avg_tree_density
    FROM (

        -- Calculate tree density in each neighborhood...
        SELECT
            nbd.id,
            COUNT(*) / ST_Area(nbd.geog) AS tree_density
        FROM azavea.neighborhoods AS nbd
        LEFT JOIN phl.ppr_tree_inventory AS tree
            ON ST_Contains(nbd.geog::geometry, tree.geog::geometry)
        GROUP BY nbd.id
    ) AS neighborhood_tree_densities
) AS avg_density
GROUP BY nbd.id, avg_tree_density
```

---

**With CTEs...**

Which neighborhoods have an above-average tree density?

```sql
WITH

-- Calculate tree density in each neighborhood...
neighborhood_tree_densities AS (
    SELECT
        nbd.id,
        COUNT(*) / ST_Area(nbd.geog) AS tree_density
    FROM azavea.neighborhoods AS nbd
    LEFT JOIN phl.ppr_tree_inventory AS tree
        ON ST_Contains(nbd.geog::geometry, tree.geog::geometry)
    GROUP BY nbd.id
),

-- Calculate average tree density across neighborhoods...
avg_density AS (
    SELECT AVG(tree_density) AS avg_tree_density
    FROM neighborhood_tree_densities
)

SELECT
    nbd.id,
    CASE
        WHEN nbd.tree_density > avg_tree_density THEN 'above'
        WHEN nbd.tree_density = avg_tree_density THEN 'equal'
        ELSE 'below'
    END AS rel_to_avg_density
FROM neighborhood_tree_densities AS nbd
CROSS JOIN avg_density
```

---

# Let's Practice!

---

## Review results