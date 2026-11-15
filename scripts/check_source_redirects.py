import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    # homeless-seoul
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpDO1JxU_K2e7WmIPovN_gmVp4rSPJIJ2HRmO9RzrNUxTIUAtCcvl6Mzl48JmZ6EKw_-L44q9LKQm_1wG69RFlhMOUCLpSGjEwQdVFlcOmq1xmmnSti2vuUfiowNCLWncx1X7FYlLnoh1UxQ==",
    # womenfund
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGJeHebXCgvXXBwu0KTfNH2xPKyDO73LQvgb5lkFHl-8yg2c9TyAPaiyljSCgSkyU1evKYmHsy7omKFJdXvTmRUNboVG8dCk_5Ct6icCaAtJNagTH8gkypsNKXcdZ6uK-7ad063t4ayrvP4BNeycJu18PW4Osg9mqlW5Ti_jE5uOcyUiw6Cm-aOUm6WlnyD1lu3RrDOHMbrCQ2DSUlvq-d3NUSls64ZaQ3aMmxwJ_OXzKX7"
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            print("Resolved URL:", resp.geturl())
    except Exception as e:
        print("Error:", e)
