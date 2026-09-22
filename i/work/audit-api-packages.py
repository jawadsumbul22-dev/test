"""Audit installed API package versions using PyPI's release-specific advisories."""
import json, subprocess, urllib.request, urllib.parse
from datetime import datetime, timezone
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root=Path(r"C:\Users\HP\Documents\Codex\2026-08-16\i\outputs\globalcommerce-enterprise-platform")
cmd=["docker","compose","exec","-T","api","python","-c","import json,importlib.metadata as m; print(json.dumps([{'name':d.metadata['Name'],'version':d.version} for d in m.distributions()]))"]
packages=json.loads(subprocess.check_output(cmd,cwd=root,text=True))
def check(p):
    url="https://pypi.org/pypi/"+urllib.parse.quote(p["name"])+"/"+urllib.parse.quote(p["version"])+"/json"
    try:
        with urllib.request.urlopen(url,timeout=25) as response: data=json.load(response)
        return dict(**p,vulns=[v for v in data.get("vulnerabilities",[]) if not v.get("withdrawn")],source=url)
    except Exception as exc: return dict(**p,error=str(exc),source=url)
with ThreadPoolExecutor(max_workers=8) as pool: results=list(pool.map(check,packages))
report=dict(checked_at=datetime.now(timezone.utc).isoformat(),auditor="PyPI release JSON vulnerability metadata",scope="All installed distributions in running API container, including pip. Not an operating-system scan or penetration test.",dependencies=results,errors=sum("error" in r for r in results),findings=sum(len(r.get("vulns",[])) for r in results))
(root/"reports/verification/python-audit-final.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(json.dumps({k:v for k,v in report.items() if k!="dependencies"}))
