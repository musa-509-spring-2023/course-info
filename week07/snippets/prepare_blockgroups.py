import csv
import fiona
import json
import pathlib
import pyproj

RAW_DATA_DIR = pathlib.Path(__file__).parent / 'raw_data'
PROCESSED_DATA_DIR = pathlib.Path(__file__).parent / 'processed_data'

# Read in the block group shapefile
with fiona.open(RAW_DATA_DIR / 'census_blockgroups_2020' / 'tl_2020_42_bg.shp') as shapefile:
    blockgroups = [feature for feature in shapefile]

    # Create a header row for the CSV file with all lower-case column names
    fieldnames = [column.lower() for column in shapefile.schema['properties'].keys()]

    # Create a spatial reference object for EPSG:4326, as we'll need to transform
    # the geometries to this projection before writing them to the CSV file. The
    # Census Bureau uses EPSG:4269. https://gis.stackexchange.com/a/170854/8583
    to_epsg4326 = pyproj.Transformer.from_crs("EPSG:4269", "EPSG:4326")

    # Create a CSV row for each blockgroup
    rows = []
    for blockgroup in blockgroups:
        row = blockgroup.properties.values()
        geometry = blockgroup.geometry
        if geometry['type'] == 'Polygon':
            geometry['coordinates'] = [
                [to_epsg4326.transform(*point) for point in ring]
                for ring in geometry.coordinates
            ]
        elif geometry['type'] == 'MultiPolygon':
            geometry['coordinates'] = [
                [
                    [to_epsg4326.transform(*point) for point in ring]
                    for ring in polygon
                ]
                for polygon in geometry.coordinates
            ]
        json_geometry = json.dumps(dict(geometry.items()))
        rows.append([*row, json_geometry])

    # Write the data to a CSV file
    with open(PROCESSED_DATA_DIR / 'census_blockgroups_2020.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerow([*fieldnames, 'geog'])
        writer.writerows(rows)
