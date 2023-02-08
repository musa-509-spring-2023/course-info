---
marp: true
style: |
  .columns-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# Query optimization

---

## Agenda
1. Testing your code
1. Things to look out for in your assignment (Meyerson location, integer division)
1. Database Indexes
1. Explaining/analyzing your query plans

---

## Testing your code

---

## Location of Meyerson Hall

* Use this: `POINT(-75.1925955 39.9524158)`
* This is the location that [Google Maps](https://www.google.com/maps/place/Meyerson+Hall,+210+S+34th+St,+Philadelphia,+PA+19104/@39.9522514,-75.1947521,17z/data=!3m1!4b1!4m6!3m5!1s0x89c6c65a636cfff1:0x7f6ed003cb68de7f!8m2!3d39.9522514!4d-75.1925634!16s%2Fm%2F02pm0q8) reports. It is not necessarily a more correct location of Meyerson Hall than you might otherwise use, but it'll play nicely with the tests.
* If I were extra, I would use this (from the PWD parcel file):
  ```
  POLYGON( (
    -75.1924253044264 39.9517947876639, -75.1925208267821 39.9518069641069, -75.192519869178 39.9518114216403,
    -75.1925179216305 39.9518288248176, -75.1925197461088 39.951846236254, -75.1925252932057 39.9518631773488,
    -75.1925344111058 39.9518791853401, -75.1925468482809 39.9518938208802, -75.1925622651678 39.9519066831849,
    -75.19258023866 39.9519174189861, -75.1926002764807 39.9519257342383, -75.1926218297594 39.9519314016933,
    -75.1926443074044 39.9519342657204, -75.1926670922733 39.9519342471273, -75.1926895618335 39.9519313472912,
    -75.1927110998407 39.9519256454046, -75.1927311152036 39.9519172977865, -75.1927490590514 39.9519065330626,
    -75.192764440904 39.9518936466558, -75.1927768385532 39.9518789911453, -75.1927859115376 39.9518629686927,
    -75.1927914128204 39.9518460179569, -75.192809914522 39.9517600315581, -75.1929970794097 39.9517838851938,
    -75.1928595590178 39.9524230285545, -75.1927682129299 39.9524113879745, -75.1927436808378 39.9524249036904,
    -75.1927322336061 39.9524781084969, -75.1924782062134 39.9524457340154, -75.1924896552417 39.9523925298724,
    -75.1924720949745 39.9523736490404, -75.192305308369 39.9523523917432, -75.1924253044264 39.9517947876639
  ) )
  ```


---

## Division

Try this:
```sql
select 10 / 4
```

* You might expect `2.5`. What's the actual result?
* Why?

---

## Integer Division

- Divide two numbers and return the integer part of the result
* Kind of like division with real-world non-divisible objects (e.g., I have 10 dollar bills, and want to distribute to 4 people -- each gets 2 and I have 2 left over)
* You can get the remainder with the modulus (`%`) operation:
  ```sql
  select 10 % 2
  ```

---

## Some functions always result in integer values

For example, `COUNT`.

---

## Floating-point Numbers

- Floating-point number are _an approximation of_ real numbers. For example, try:
  ```sql
  select (0.1)::double precision + (0.2)::double precision;
  ```
- In SQL `1` is an integer, but `1.0` is a floating-point number.
- When you multiply or divide between floating-point numbers and integers, you get floating-point numbers.
  ```sql
  select 1.0 * 10 / 4
  ```

---

## Quick aside: It's because of binary

* Computers* represent data in "bits" (binary digits)
* All integers (up to a certain maximum) can be exactly represented in a finite number of bits
* Some real numbers _cannot_ be represented in a **finite** number of bits (just like in decimal, e.g. ⅔ is an _infinite_ repeating decimal)
* In decimal we often choose some max number of digits (some "precision"), and round the number (e.g., `0.6666666667`)
* Some neat tools:
  * [Converting decimal to binary](https://www.rapidtables.com/convert/number/decimal-to-binary.html)
  * [Exploring floating point representations](https://www.binaryconvert.com/result_float.html)

---

# Database Indexes

<!--  We're going to be talking about how to make slow queries run faster, but note that for Assignment 1, none of this should be necessary. If your Assignment 1 queries are taking longer than a few seconds, then maybe rethink your approach. -->

---

## Let’s try an example - _Show distribution of transit stops by census block group_

1.  Load Philadelphia 2010 Census Block Groups [from OpenDataPhilly](https://opendataphilly.org/dataset/census-block-groups)
    - I downloaded the GeoJSON and used **ogr2ogr** to load into a table named `census.block_groups_2010`.
2.  Load SEPTA city transit ("bus") stop locations [from SEPTA’s GitHub](https://github.com/septadev/GTFS/releases)
    - I downloaded the latest **gtfs_public.zip** file, extracted the **google_bus.zip** file, and extracted the **stops.txt** file from there. Then I used **csvsql** to load into a table named `septa.bus_stops`.

---

Creating the schemas in PG Admin:
```sql
create schema if not exists census;
create schema if not exists septa;
```

---

Loading the census block groups in a terminal:

```sh
ogr2ogr \
  -f "PostgreSQL" \
  -nln "census.block_groups_2010" \
  -lco "OVERWRITE=yes" \
  -lco "GEOM_TYPE=geography" \
  -lco "GEOMETRY_NAME=geog" \
  PG:"host=localhost port=5432 dbname=musa_509 user=postgres password=postgres" \
  ~/Downloads/Census_Block_Groups_2010.geojson
```

_(remember on, Windows PowerShell, replace backslashes (`\`) with backticks (``` ` ```))_

---

Loading the bus stops in a terminal:

```sh
csvsql \
  --db "postgresql://postgres:postgres@localhost:5432/musa_509" \
  --insert \
  --overwrite \
  --create-if-not-exists \
  --db-schema "septa" \
  --tables "bus_stops" \
  ~/Downloads/stops.txt
```

---

This query will give us our densities:

```sql
with

-- Create a CTE for the bus stops that includes a geography column
septa_bus_stops as (
    select
        *,
        st_makepoint(stop_lon, stop_lat)::geography as geog
    from septa.bus_stops
)

-- Select the geoid, geography, and the number of bus stops per sq km.
select
    block_groups.geoid10,
    block_groups.geog,
    count(bus_stops.*) / st_area(block_groups.geog) * 1000000 as bus_stops_per_sqkm
from census.block_groups_2010 as block_groups
left join septa_bus_stops as bus_stops
    on st_covers(block_groups.geog, bus_stops.geog)
group by
    block_groups.geoid10, block_groups.geog
order by
    bus_stops_per_sqkm desc
```

<!-- I know this may be a lot for you to manually type out from this slide, but I'm including it here so that you can copy and paste it. I'm going to walk through the logic, so if you need time to find the slide feel free. 

First, the septa_bus_stops table does not have a geometry or geography column. Instead, as per the GTFS specification, it contains a stop_lon column and a stop_lat column. So that we have a table where we can just use a geography column, we create a CTE that has the columns from the bus_stops table, along with an additional geography column made from the lat and lon columns.

(~~ Copy the CTE into PG Admin and show what that looks like. ~~)

Then we take that table and join it with the census block groups, where the matching condition checks whether the bus stop geography is inside of the block group geography. We use st_covers because that works fine with geographies whereas st_contains does not.

(~~ Take the query without the "group by", order by the geoid10, and show what the joined table looks like ~~)

Finally we aggregate all the stops within each census block group to end up with one row for each block group.

(~~ Run that. Highlight how long it takes. Ask how long it takes for the students. ~~)

So, why is it so quick on my computer and so much slower on yours? -->

---

# Why is mine so fast?

https://docs.google.com/presentation/d/1xlsOwURtjUM9GQ7K1QvY4YFhLp0bNkki3opGjI1WoCs/edit?usp=sharing

---

## **ogr2ogr** creates indexes by default

- When you load a spatial dataset with ogr2ogr it will create an index on the spatial column by default. So will QGIS.

  ```sql
  CREATE INDEX IF NOT EXISTS block_groups_2010_geog_geom_idx
      ON census.block_groups_2010 USING gist
      (geog)
      TABLESPACE pg_default;
  ```

- Check on your `census.block_groups_2010` table in PG Admin.

* So, if you have an index, why is mine so much faster?

* _Because I created an index on the bus stops table too!_

---

## Index experiment

_Let’s look at the performance of a spatial join with and without an index._

---

## Manipulating Indexes

* An index is a database object, and I can manipulate it with SQL (DDL). For example, I get delete (`drop`) my index with:
  ```sql
  DROP INDEX IF EXISTS bus_stops_geog_idx;
  ```

<!-- After I drop my index, if I run the bus stop density query it takes on the order of 30 seconds. -->

* And I can create an index with:
  ```sql
  CREATE INDEX IF NOT EXISTS bus_stops_geog_idx
      ON septa.bus_stops USING gist
      ( (ST_MakePoint(stop_lon, stop_lat)::geography) )
      TABLESPACE pg_default;
  ```

<!-- I can create an index with DDL as well, like this code, but before I run this, let's talk about how I might go about figuring out where my query might be slow. -->

---

## Explaining Queries

* SQL is a **declarative** language.

<!-- In imperative languages (like JS or Python) you give the engine (e.g. the Python kernel, or the browser, or whatever is running your code) step-by-step instructions to get to your final result.

In declarative languages, you tell the engine _what_ you want to achieve, but not _how_ you want to achieve it. So CSS is a declarative language -- you create rules for how elements should be laid out on a page, but you don't actually place the elements those locations yourself.

Likewise, in SQL you specify the logic that the final data set should conform to, but you don't write the functions, loops, the algorithms that actually build the final dataset. -->

* But something has to figure out algorithms

<!-- But even with declarative languages something has to figure out those algorithms. In the case of CSS, it's the browser's layout engine. You provide it the rules and the layout engine figures out how to make all the elements on the page conform to those rules -- determining what all the widths of elements should be to fit in a flex container, for example. -->

* In SQL, that thing is the **"query planner"**

<!-- In the case of SQL, the thing that determines how data will be retrieved from the database to fit your query logic is called the "query planner. -->

* Use `EXPLAIN` to see what the query planner thinks it should do

---

# Let's `EXPLAIN` the transit stop density query.

<!--

(~~ THINGS TO NOTE:

1.  You can use the EXPLAIN keyword, and it has some useful context, but we won't go deep into it. Instead we'll use the Explain feature in PG Admin.

2.  There are different ways that PostgreSQL can go through the data in a table. The first way we'll see is a "sequential scan". This means PostgreSQL is going to start with the first row of the table, perform some operations to manipulate it or determine whether it should be included in the final results, and then move on to the second row, do the same thing, then move on to the third row, etc. until it gets all the way to the end of a table. That's a sequential scan -- go row-by-row and do the same thing for every row.

~~)

-->

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**0103000020E61000000100000021000000CFD159…**|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|421010109002|0103000020E61000000100000012000000B11195…|
|421010110002|0103000020E610000001000000170000001D8814…|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|421010110003|0103000020E6100000010000001C00000074968D…|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|**421010108002**|**0103000020E6100000010000000F000000D7CB06…**|
|421010109002|0103000020E61000000100000012000000B11195…|
|421010110002|0103000020E610000001000000170000001D8814…|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|421010110003|0103000020E6100000010000001C00000074968D…|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|**421010109002**|**0103000020E61000000100000012000000B11195…**|
|421010110002|0103000020E610000001000000170000001D8814…|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|421010110003|0103000020E6100000010000001C00000074968D…|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|421010109002|0103000020E61000000100000012000000B11195…|
|**421010110002**|**0103000020E610000001000000170000001D8814…**|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|421010110003|0103000020E6100000010000001C00000074968D…|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|421010109002|0103000020E61000000100000012000000B11195…|
|421010110002|0103000020E610000001000000170000001D8814…|
|**421010110001**|**0103000020E6100000010000004D000000B543F5…**|
|421010110003|0103000020E6100000010000001C00000074968D…|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|421010109002|0103000020E61000000100000012000000B11195…|
|421010110002|0103000020E610000001000000170000001D8814…|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|**421010110003**|**0103000020E6100000010000001C00000074968D…**|
|421010111004|0103000020E61000000100000017000000BC14E7…|

---

## Sequential Scan

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|0103000020E61000000100000021000000CFD159…|
|421010108002|0103000020E6100000010000000F000000D7CB06…|
|421010109002|0103000020E61000000100000012000000B11195…|
|421010110002|0103000020E610000001000000170000001D8814…|
|421010110001|0103000020E6100000010000004D000000B543F5…|
|421010110003|0103000020E6100000010000001C00000074968D…|
|**421010111004**|**0103000020E61000000100000017000000BC14E7…**|

<!--

(~~ Back to PG Admin ~~)

3.  We see we have two sequential scans in our query, one for the block groups table and one for the bus stops table. But it's not really just one for each because the query engine plans to combine the tables with a nested loop.

When you see a nested loop over two tables that are being sequentially scanned, and you know those tables aren't small, you should raise a red flag.

-->

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|**Ridge Av & Wissahickon**|**…** |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

<!-- Like before, our sequential scan means we'll go record-by-record through our stops table... -->
---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|**Roosevelt Blvd & Broad St**    |**…** |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|**Roosevelt Blvd & 5th St**      |**…** |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|****421010108001****|****…****|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|****Roosevelt Blvd & Pratt St****    |****…**** |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|**Roosevelt Blvd & Cottman Av**  |**…** |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|**Roosevelt Blvd & Holme Av**    |**…** |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|**421010108001**|**…**|
|421010108002|…|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|**Roosevelt Blvd & Woodward** |**…** |

</div>
</div>

<!-- However, the nested loop means we're also going to do this for each record in our block groups table! -->

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|**Ridge Av & Wissahickon**|**…** |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|**Roosevelt Blvd & Broad St**    |**…** |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|**Roosevelt Blvd & 5th St**      |**…** |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|**Roosevelt Blvd & Pratt St**    |**…** |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|**Roosevelt Blvd & Cottman Av**  |**…** |
|Roosevelt Blvd & Holme Av    |… |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|**Roosevelt Blvd & Holme Av**    |**…** |
|Roosevelt Blvd & Woodward St |… |

</div>
</div>

---

## Nested Loop

<div class="columns-2">
<div>

|geoid10     |geog                                       |
|------------|-------------------------------------------|
|421010108001|…|
|**421010108002**|**…**|
|421010109002|…|
|421010110002|…|
|421010110001|…|
|421010110003|…|
|421010111004|…|

</div>
<div>

|stop_name   |geog |
|------------|-------------|
|Ridge Av & Wissahickon|… |
|Roosevelt Blvd & Broad St    |… |
|Roosevelt Blvd & 5th St      |… |
|Roosevelt Blvd & Pratt St    |… |
|Roosevelt Blvd & Cottman Av  |… |
|Roosevelt Blvd & Holme Av    |… |
|**Roosevelt Blvd & Woodward** |**…** |

</div>
</div>

<!-- 

(~~ Back to PG Admin ~~)

We can use the EXPLAIN ANALYZE feature to see what kind of impact this is really going to have on our query.

(~~ Do the EXPLAIN ANALYZE ~~)

What explain analyze is going to do is actually run our query so that the engine can tell us not just what it planned to do, but what actually happened when it did it.

Click each of the sequential scan tables. Note the actual rows and loops numbers.

Click the nested loop join. Show the join condition, the actual rows, and the rows removed ... 18M! That's a lot of wasted effort.

-->

---

## Recreating the index

```sql
CREATE INDEX IF NOT EXISTS bus_stops_geog_idx
    ON septa.bus_stops USING gist
    ( (ST_MakePoint(stop_lon, stop_lat)::geography) );
```

<!-- To specify an index on a table:

1.  You give the index a name. Here I've used "bus_stops_geog_idx". There's nothing special about anything in that name, you can name it whatever you want, but be descriptive.

2.  Specify the table

3.  Specify the type of index. You almost always want gist for spatial values. B-tree is a decent choice for everything else, hash for special cases.

4. Specify the expression you want to index on. This will usually just be the name of a column, but sometimes will be some expression that returns a value.

-->

> Note that the index expression is more complicated than the one on the `census.block_groups_2010` table. That's because the value we wanted to index was just the `geog` column. However, `septa.bus_stops` doesn't have a `geog` column.

<!-- This is basically telling PostGIS whenever I make a point from the longitude and latitude on this table, treat it as efficiently as if it already existed. -->

---

## Things to watch while optimizing queries:

* Avoid sequential scans when possible (especially on large data sets)

<!-- Since you don't really decide whether to use sequential scans or not (the query planner does) the way you can try to control that is with good indexes. -->

* Use the query planner's explanations to identify bottlenecks
  * ![Sequential scan icon](images/sequential-scan-icon.png) If you see nested loops with sequential scans, take note!
  * ![Index scan icon](images/index-scan-icon.png) If you see nested loops with index scans, you're probably ok.

---

# Let's try an example -- _Find the nearest bus stop to each property parcel in Philadelphia_

---

```sql
with

-- Create a CTE for the bus stops that includes a geography column
septa_bus_stops as (
    select
        *,
        st_makepoint(stop_lon, stop_lat)::geography as geog
    from septa.bus_stops
)

-- Find the bus stop nearest to each property parcel. This is a K-Nearest
-- Neighbors (KNN) calculation with K=1.
select
    pwd_parcels.address,
    pwd_parcels.geog,
    nearest_bus_stop.*
from phl.pwd_parcels
cross join lateral (
    select *
    from septa_bus_stops as bus_stops
    order by pwd_parcels.geog <-> bus_stops.geog
    limit 1
) as nearest_bus_stop
```

---

## Notes on the example:

- The query uses a `LATERAL` join to essentially create a new table for each row of the `pwd_parcels` table. Lateral joins are frequently used for [KNN calculations in PostGIS](https://postgis.net/workshops/postgis-intro/knn.html#nearest-neighbor-join). We could increase the value of `K` by increasing the number of results returned in the subquery (e.g., `limit 5` for the nearest 5 transit stations).

- The query uses a [PostGIS distance operator](https://postgis.net/docs/geometry_distance_knn.html) instead of the `ST_Distance` function -- the latter does not use spatial indexes. The distance operator is only intended to be used when ordering results by distance (which is such a common thing that it gets it own operator!).