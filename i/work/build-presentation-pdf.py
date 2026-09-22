from pathlib import Path
from reportlab.pdfgen import canvas
from pypdf import PdfReader
from PIL import Image
root=Path(r"C:\Users\HP\Documents\Codex\2026-08-16\i")
output=root/"outputs/globalcommerce-enterprise-platform/docs/GlobalCommerce-Final-Presentation-Jawad-Ahmad.pdf"
images=sorted((root/"work/slides-build/rendered").glob("final-slide-*.png"))
assert len(images)==19
pdf=canvas.Canvas(str(output),pagesize=(960,540))
pdf.setTitle("GlobalCommerce - Jawad Ahmad - Presentation")
pdf.setAuthor("Jawad Ahmad")
for path in images:
    assert Image.open(path).size==(1440,810)
    pdf.drawImage(str(path),0,0,width=960,height=540)
    pdf.showPage()
pdf.save()
assert len(PdfReader(output).pages)==19
print(output)
