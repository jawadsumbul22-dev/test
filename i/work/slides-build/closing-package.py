from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from reportlab.pdfgen import canvas
from pypdf import PdfReader, PdfWriter
import shutil

root=Path('C:/Users/HP/Documents/Codex/2026-08-16/i')
out=root/'test presentation'
build=root/'work/slides-build/closing-edit'
stem='GlobalCommerce-Exam-Focused-Jawad-Ahmad'
parts={'ppt/slides/slide20.xml','ppt/notesSlides/notesSlide20.xml'}
with ZipFile(out/(stem+'.pptx')) as old, ZipFile(build/'candidate.pptx') as new:
    assert parts.issubset(old.namelist()) and parts.issubset(new.namelist())
    with ZipFile(build/'updated.pptx','w',ZIP_DEFLATED) as result:
        for item in old.infolist():
            result.writestr(item, new.read(item.filename) if item.filename in parts else old.read(item.filename))
with ZipFile(out/(stem+'.pptx')) as old, ZipFile(build/'updated.pptx') as new:
    assert old.namelist()==new.namelist()
    assert all(old.read(n)==new.read(n) for n in old.namelist() if n not in parts)
c=canvas.Canvas(str(build/'closing.pdf'),pagesize=(960,540))
c.drawImage(str(build/'slide-20.png'),0,0,width=960,height=540)
c.showPage()
c.save()
original=PdfReader(out/(stem+'.pdf'))
assert len(original.pages)==20
writer=PdfWriter()
for page in original.pages[:19]: writer.add_page(page)
writer.add_page(PdfReader(build/'closing.pdf').pages[0])
writer.add_metadata({'/Title':'GlobalCommerce - Jawad Ahmad','/Author':'Jawad Ahmad'})
with open(build/'updated.pdf','wb') as target: writer.write(target)
assert len(PdfReader(build/'updated.pdf').pages)==20
print('Updated page 20 only. All other PowerPoint package entries are identical.')
