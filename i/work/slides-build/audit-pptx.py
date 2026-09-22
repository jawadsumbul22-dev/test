import re, zipfile, xml.etree.ElementTree as ET
from pathlib import Path
base=Path('C:/Users/HP/Documents/Codex/2026-08-16/i')
deck=base/'outputs/globalcommerce-enterprise-platform/docs/GlobalCommerce-Presentation-Jawad-Ahmad.pptx'
source=Path('C:/Users/HP/Downloads/Sample Presentation EduQual Diplomas (1).pptx')
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
with zipfile.ZipFile(deck) as z, zipfile.ZipFile(source) as r:
    slides=sorted(n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n))
    notes=sorted(n for n in z.namelist() if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',n))
    print('Slides:',len(slides),'Notes:',len(notes),'Bytes:',deck.stat().st_size)
    for n in notes:
        text=' '.join(ET.fromstring(z.read(n)).itertext())
        assert 'SAY' in text and 'SHOW / DO' in text and '[Sources]' in text,n
    for n in slides:
        tree=ET.fromstring(z.read(n))
        for shape in tree.findall('.//p:sp',ns):
            if shape.find('.//p:ph',ns) is not None:
                text=''.join(t.text or '' for t in shape.findall('.//a:t',ns))
                assert text.strip(),f'Empty slide placeholder {n}'
        texts=' '.join(t.text or '' for t in tree.findall('.//a:t',ns))
        assert not re.search(r'Khalid|Click to add|XaaS|commodity|Committee Name',texts),n
    for n in r.namelist():
        if re.fullmatch(r'ppt/theme/theme\d+\.xml',n):
            assert z.read(n)==r.read(n),n
    assert len(slides)==19 and len(notes)==19
    print('PASS: every slide has a script, demonstration cues and sources; no empty slide placeholders; original theme parts identical.')
