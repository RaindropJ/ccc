import urllib.request

url = "https://www.moel.go.kr/common/downloadFile.do?file_seq=20251000761&bbs_seq=20251000292&bbs_id=29&file_ext=pdf"
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20251000292'
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        headers = dict(resp.headers)
        print("Status:", resp.status)
        print("Content-Type:", headers.get('Content-Type'))
        print("Content-Length:", headers.get('Content-Length'))
        print("Content-Disposition:", headers.get('Content-Disposition'))
        # Read first 1024 bytes to verify PDF header
        data = resp.read(1024)
        print("Starts with %PDF:", data.startswith(b'%PDF'))
except Exception as e:
    print("Download error:", e)
