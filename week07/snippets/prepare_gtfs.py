import csv
import pathlib

RAW_DATA_DIR = pathlib.Path(__file__).parent / 'raw_data'
PROCESSED_DATA_DIR = pathlib.Path(__file__).parent / 'processed_data'

GTFS_FEEDS = ['septa_bus', 'septa_rail']

for gtfs_feed in GTFS_FEEDS:
    gtfs_feed_folder = RAW_DATA_DIR / gtfs_feed
    for gtfs_path in gtfs_feed_folder.iterdir():

        # Read the data from the raw GTFS CSV file.
        with gtfs_path.open('r', encoding='utf-8') as f:
            reader = csv.reader(f)
            data = [row for row in reader]

        # Write the data to a new processed CSV file, creating the
        # necessary directories if they don't exist.
        output_folder = PROCESSED_DATA_DIR / gtfs_feed
        output_path = output_folder / f'{gtfs_path.stem}.csv'
        output_folder.mkdir(parents=True, exist_ok=True)
        with output_path.open('w', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerows(data)
