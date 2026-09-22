from pathlib import Path
from PIL import Image, ImageDraw

WORK = Path(r"C:\Users\HP\Documents\Codex\2026-08-16\i\work\exam-review")
files = sorted((WORK / "sample").glob("slide-*.png"), key=lambda p: int(p.stem.split("-")[-1]))
thumb_w = 720
gap = 24
label_h = 34
tiles = []
for path in files:
    image = Image.open(path).convert("RGB")
    thumb_h = round(image.height * thumb_w / image.width)
    image = image.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
    tile = Image.new("RGB", (thumb_w, thumb_h + label_h), "white")
    ImageDraw.Draw(tile).text((8, 8), path.stem, fill="black")
    tile.paste(image, (0, label_h))
    tiles.append(tile)

cols = 2
rows = (len(tiles) + cols - 1) // cols
cell_w = thumb_w
cell_h = max(t.height for t in tiles)
montage = Image.new("RGB", (cols * cell_w + (cols - 1) * gap, rows * cell_h + (rows - 1) * gap), "#cccccc")
for index, tile in enumerate(tiles):
    x = (index % cols) * (cell_w + gap)
    y = (index // cols) * (cell_h + gap)
    montage.paste(tile, (x, y))
montage.save(WORK / "sample-montage.jpg", quality=90)
print(f"wrote montage for {len(files)} slides")
