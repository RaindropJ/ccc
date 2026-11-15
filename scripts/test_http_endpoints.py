import urllib.request
import re

try:
    resp = urllib.request.urlopen("http://localhost:8080/index.html")
    html = resp.read().decode('utf-8')
    print("index.html loaded via HTTP 8080 successfully!")
    print(f"Content length: {len(html)} bytes")
except Exception as e:
    print("Error fetching index.html:", e)

try:
    resp2 = urllib.request.urlopen("http://localhost:8080/stitch_guidelines_archive.html")
    html2 = resp2.read().decode('utf-8')
    print("stitch_guidelines_archive.html loaded via HTTP 8080 successfully!")
    print(f"Content length: {len(html2)} bytes")
except Exception as e:
    print("Error fetching stitch_guidelines_archive.html:", e)

try:
    resp3 = urllib.request.urlopen("http://localhost:8080/src/js/archive.js")
    js = resp3.read().decode('utf-8')
    print("src/js/archive.js loaded via HTTP 8080 successfully!")
    print(f"Content length: {len(js)} bytes")
except Exception as e:
    print("Error fetching archive.js:", e)
