from pathlib import Path
import pdfplumber
from PIL import Image, ImageDraw

WORK = Path(r"C:\Users\HP\Documents\Codex\2026-08-16\i\work\exam-review")
SOURCES = {
    "exam-guide": Path(r"C:\Users\HP\Downloads\Oral Presentation Exam Guide.pdf"),
    "topic": Path(r"C:\Users\HP\Downloads\Jawad Ahmad _Exam Topic for Oral Presentation_DAIOL6.pdf"),
}

for stem, source in SOURCES.items():
    out = WORK / "pdf-pages" / stem
    out.mkdir(parents=True, exist_ok=True)
    rendered = []
    with pdfplumber.open(source) as doc:
        for index, page in enumerate(doc.pages, 1):
            page_path = out / f"page-{index:02d}.png"
            page.to_image(resolution=130, antialias=True).save(page_path, format="PNG")
            rendered.append(page_path)

    thumb_w = 700
    margin = 24
    label_h = 36
    rows = []
    for image_path in rendered:
        img = Image.open(image_path).convert("RGB")
        thumb_h = round(img.height * thumb_w / img.width)
        img = img.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        tile = Image.new("RGB", (thumb_w + 2 * margin, thumb_h + label_h + 2 * margin), "white")
        tile.paste(img, (margin, margin + label_h))
        ImageDraw.Draw(tile).text((margin, margin), image_path.stem, fill="black")
        rows.append(tile)

    montage_w = max(x.width for x in rows)
    montage_h = sum(x.height for x in rows)
    montage = Image.new("RGB", (montage_w, montage_h), "#dddddd")
    y = 0
    for row in rows:
        montage.paste(row, (0, y))
        y += row.height
    montage.save(WORK / f"{stem}-montage.jpg", quality=88)
    print(f"{stem}: {len(rendered)} pages")
