# Bike Share Access at City Parks

A few years ago, the [William Penn Foundation introduced an initiative](https://williampennfoundation.org/newsroom/philadelphia-and-indianapolis-are-getting-people-parks-bike-share) to "help Philadelphians make the most of natural resources" available to them in the city by adding bike share stations around Philadelphia's parks. This exercise asks you to construct a couple queries inspired by that initiative.

1.  Write a query that returns the number of bike share docks near (within 500 meters of) each park in the city (_note that a station usually has multiple docks; see the `totalDocks` field in the station statuses dataset_).
    * Your results should contain:
      * The public name of the park (in a field named `name`)
      * The shape of the park (as a geography in a field named `geog`)
      * The number of docks near the park (in a field named `nearby_dock_cnt`)

2. Write a query that returns the amount of park land in Philadelphia that is within a kilometer of any bike share station.
    * Your query should return a single record with two columns:
      * One column (`geog`) that represents all park land within 1 km of any bike share station.
      * One column (`nearby_area`) representing the total land area of the portion of all parks that is within 1 km meters of any bike share station.