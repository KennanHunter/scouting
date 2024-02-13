from io import StringIO
import requests
import csv

r = requests.get("http://localhost:8787/dump/2024mock/CSV/")

file = StringIO(r.text)

reader = csv.reader(file)

header = next(reader)

for row in reader:
  print(f"Row shows team {row[9]} in match {row[8]}")
