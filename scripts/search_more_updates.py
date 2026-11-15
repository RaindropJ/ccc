import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

# 1. Search SASW for 노인일자리
print("=== 1. Checking SASW for 노인일자리 ===")
url_sasw = 'https://sasw.or.kr/zbxe/freedata?search_target=title&search_keyword=%EB%85%B8%EC%9D%B8%EC%9D%BC%EC%9E%90%EB%A6%AC'
try:
    req = urllib.request.Request(url_sasw, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href=[\'"]([^\'"]*document_srl=\d+[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, title in matches:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
            if '노인일자리' in t:
                print(f"- {t} -> {href}")
except Exception as e:
    print("SASW error:", e)

# 2. Search SASW for 아동분야
print("\n=== 2. Checking SASW for 아동분야 ===")
url_child = 'https://sasw.or.kr/zbxe/freedata?search_target=title&search_keyword=%EC%95%84%EB%8F%99%EB%B6%84%EC%95%BC'
try:
    req = urllib.request.Request(url_child, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href=[\'"]([^\'"]*document_srl=\d+[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, title in matches:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
            if '아동분야' in t:
                print(f"- {t} -> {href}")
except Exception as e:
    print("Child error:", e)

# 3. Search SASW for 다함께돌봄
print("\n=== 3. Checking SASW for 다함께돌봄 ===")
url_care = 'https://sasw.or.kr/zbxe/freedata?search_target=title&search_keyword=%EB%8B%A4%ED%95%A8%EA%BB%98%EB%8F%8C%EB%B4%84'
try:
    req = urllib.request.Request(url_care, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'<a[^>]+href=[\'"]([^\'"]*document_srl=\d+[^\'"]*)[\'"][^>]*>(.*?)</a>', html, re.DOTALL)
        for href, title in matches:
            t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title)).strip()
            if '다함께돌봄' in t:
                print(f"- {t} -> {href}")
except Exception as e:
    print("Care error:", e)
