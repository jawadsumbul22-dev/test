from pathlib import Path
from reportlab.pdfgen import canvas
from pypdf import PdfReader

root = Path('C:/Users/HP/Documents/Codex/2026-08-16/i')
build = root / 'work/slides-build/exam-v2'
output = root / 'test presentation/GlobalCommerce-Exam-Focused-Jawad-Ahmad.pdf'
c = canvas.Canvas(str(output), pagesize=(960, 540))
c.setTitle('GlobalCommerce - Exam Focused Presentation - Jawad Ahmad')
c.setAuthor('Jawad Ahmad')
for number in range(1, 21):
    c.drawImage(str(build / f'slide-{number:02d}.png'), 0, 0, width=960, height=540)
    c.showPage()
c.save()
assert len(PdfReader(output).pages) == 20
print(output)
