from pathlib import Path
import os
import runpy
import sys
import tempfile
import uuid

temp_root = Path(r"C:\Users\HP\Documents\Codex\2026-08-16\i\work\report-render\temp")
temp_root.mkdir(parents=True, exist_ok=True)
tempfile.tempdir = str(temp_root)


class WorkspaceTemporaryDirectory:
    def __init__(self, suffix=None, prefix=None, dir=None, ignore_cleanup_errors=False, delete=True):
        stem = f"{prefix or 'tmp'}{uuid.uuid4().hex[:10]}{suffix or ''}"
        self.name = str(temp_root / stem)
        os.makedirs(self.name, exist_ok=True)

    def __enter__(self):
        return self.name

    def __exit__(self, exc_type, exc_value, traceback):
        return False


tempfile.TemporaryDirectory = WorkspaceTemporaryDirectory

renderer = r"C:\Users\HP\.codex\plugins\cache\openai-primary-runtime\documents\26.813.12317\skills\documents\render_docx.py"
input_docx = r"C:\Users\HP\Documents\Codex\2026-08-16\i\outputs\globalcommerce-enterprise-platform\docs\GlobalCommerce-Project-Report-Jawad-Ahmad.docx"
output_dir = r"C:\Users\HP\Documents\Codex\2026-08-16\i\work\report-render"
sys.argv = [renderer, input_docx, "--output_dir", output_dir, "--emit_pdf"]
runpy.run_path(renderer, run_name="__main__")
