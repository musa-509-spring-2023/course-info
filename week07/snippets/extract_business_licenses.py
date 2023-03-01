from urllib.request import urlopen

url = 'https://phl.carto.com/api/v2/sql?q=SELECT+*+FROM+business_licenses&filename=business_licenses&format=geojson&skipfields=cartodb_id'
filename = 'business_licenses.geojson'

response = urlopen(url)
with open(filename, 'wb') as f:
    while True:
        chunk = response.read(1024 * 1024)
        if not chunk:
            break
        f.write(chunk)
