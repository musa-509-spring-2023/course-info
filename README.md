# MUSA 509: Geospatial Cloud Computing & Visualization - Syllabus

* **Instructor(s):**
  * Mjumbe Poe, mjumbe@design.upenn.edu
  * Jingyi Li, jingyili@design.upenn.edu
* **Schedule:** Wednesdays, 10:15-1:15
* **Room:** Meyerson Hall, B2
* **Office Hours:**
  * Mjumbe:
    * In person Wednesdays immediately after class, first-come first-served
    * Online Mondays 1:00 - 5:00 & Thursday, 1:00 - 3:30 - [book here](https://calendly.com/mjumbe-upenn/office-hours)
  * Jingyi:
    * In person (Meyerson 406) or via Zoom on Tuesdays 11:30a - 1:30p & Thursdays 12:00p - 1:00p - [book here](https://calendly.com/jingyili-ta/musa5090-spring-2023-office-hour)

[Description](#description) | [Schedule](#course-schedule) | [Objectives](#course-objectives) | [Format](#format) | [Assignments](#assignments) | [Grading](#grading) | [Academic Integrity](#academic-integrity)


## Description

In this course you will learn how to collect, store, wrangle and display cartographic data in a cloud-based setting. You will learn reproducible approaches for pulling spatial data from APIs with emphasis on PostGIS, Airflow, and BigQuery; to wrangle these data in Python and/or JavaScript; and visualize in various platforms including Carto and Metabase. You will build your own APIs and develop your own custom web applications. This course is the second in a progression toward building web-based systems using geospatial data, and expands on the Fall course in JavaScript Programming for Planning.

There will be a strong emphasis on open source tools although we will also strongly rely on proprietary cloud-based infrastructure providers. Besides the technologies used in class, we will be using large and sometimes messy data from which we will be deriving insights from how people inhabit, move around in, and affect their environments. We will be working with datasets published by a variety of organizations, from the local to the national level, across governments, non-profits, and private corporations.

The class is divided into four modules:

1. **Spatial Analytics with Databases** -- learn the basics of SQL and PostGIS for exploring datasets and answering questions of your data
2. **Scripting with Cloud Services** -- building basic scripts with queries and interacting with web services/APIs programmatically
3. **Data Pipelining** -- use Python or JavaScript and SQL to automate extracting, transforming, and loading data into a data warehouse
4. **Building Interfaces** -- build a dashboard and APIs to answer operational questions using dynamic representations data

## Course Schedule
(subject to adapt to the flow of the semester)

|  W#  |  Date  |  Topic  |  Notes  |
|------|--------|---------|---------|
|  1   |  Jan 18  |  Introduction  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week01/SLIDES.html) & [More](week01/)  |
|  2   |  Jan 25  |  _Analytics_: Spatial Databases & Querying Geospatial Data  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week02/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week02)  |
|  3   |  Feb 1   |  _Analytics_: Joins & More Geospatial SQL Operations  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week03/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week03)  |
|  4   |  Feb 8   |  _Analytics_: Efficient Queries  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week04/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week04)  |
|  5   |  Feb 15  |  **-(OVERFLOW** -- _We'll introduce BigQuery and some out-of-the-box visualization options here, time permitting_ **)-**  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week05/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week05)  |
|  6   |  Feb 22  |  _Scripting_: Working with Data from Files and Web Services  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week06/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week06)  |
|  7   |  Mar 1   |  _Scripting_: More Extracting Data  |  [Slides](https://musa-509-spring-2023.github.io/course-info/week07/SLIDES.html) & [More](https://github.com/musa-509-spring-2023/course-info/tree/main/week07)  |
|  -   |  Mar 8   |  **-(SPRING BREAK)-**  |  -  |
|  8   |  Mar 15  |  _Pipelines_: Modeling and Transforming Geospatial Data  |    |
|  9   |  Mar 22  |  _Pipelines_: Implementing ETL in Cloud Services  |   |
|  10  |  Mar 29  |  _Interfaces_: Open Source Business Intelligence Tools  |   |
|  11  |  Apr 5   |  _Interfaces_: Rendering Data with Custom Applications (APIs and Templates)  |   |
|  12  |  Apr 12  |    |   |
|  13  |  Apr 19  |    |   |
|  14  |  Apr 26  |   |   |
|  15  |  May 3?  |  Final Project wrap-up  |   |

## Course Objectives

Students will learn how to use professional tools and cloud-based services to automate the process of preparing data for use in organizational decision making. **By the end of this course students should be able to:**
* Use SQL to answer questions with the data in a database
* Set up and use tools for exploring and visualizing data in a database
* Use web services to create beautiful and meaningful data products
* Use Python or JavaScript to automate the process of extracting, transforming, and loading data
* Do all of these things using professional software development tools and methods

## Format

* The course will be divided between lectures during the first half of class sessions, and exercises/labs in the second half.
* Lab sessions will be interactive, usually with some deliverable expected by the end that will make up part of the participation portion of a student's grade.
* Students will have the option of attending the lecture and lab sessions in person in the classroom, or virtually through Zoom.

## Assignments

There will be assignments with some lectures. Other lectures will have recommended readings and suggested exercises to give additional practice. Labs will often have exercises that are intended to be completed in class or, in some exceptional cases, soon after.

The final project will be the culmination of all of the skills learned in the class. Students will build an automatically updating data product, powered by a cloud-hosted data pipeline, that can be used to make some operational decisions. Expectations are that the products will address some socially relevant domain, and will make use of multiple visualizations of data (static or interactive charts and maps, formatted statistics, templated prose, etc.).

## Grading

* Assignments: 25%
* Participation: 25%
* Final Project Proposal: 10%
* Final Project: 40%

## Course Data

Some of the data we are using in this course is proprietary and cannot be openly disseminated. In these cases students will be provided with access to private class repositories of datasets. Derivative insights based on these datasets can be openly shared, especially as part of final project work.

## Academic Integrity

Students are expected to comply with and be familiar with [Penn's Code of Academic Integrity](https://catalog.upenn.edu/pennbook/code-of-academic-integrity).

When writing software, it is common to copy and paste small code snippets from online sources without citation. For larger samples, it is expected that the source is cited in the code base. In case there is uncertainty, speak with your instructor for guidance.
