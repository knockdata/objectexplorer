"""
The squirrel comic the promo film is cut from: assets/oe.png upscaled four times with Real-ESRGAN,
then rebranded — the old blue ObjectExplorer turned into the neon green brand, and the end card's
blue logo painted over and drawn again with the chalk e.

	uv run --with torch --with spandrel --with pillow --with numpy python scripts/promo-comic.py

writes promo/oe@4x.jpg. A single panel of the original is ~340px wide, and the film shows one at
~900px tall on a 1080p frame: a plain resize is a blur, the model draws the fur and the letters back.
The weights (64 MB) are fetched once into cache/, which is gitignored.
"""
import os
import urllib.request
import numpy as np
import torch
from PIL import Image, ImageDraw, ImageFont
from spandrel import ModelLoader

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
SOURCE = os.path.join(ROOT, "assets", "oe.png")
TARGET = os.path.join(ROOT, "promo", "oe@4x.jpg")
# the chalk e, the one master every mark is derived from
MARK = os.path.join(ROOT, "..", "rock2", "explorer", "src", "public", "img", "512.png")
WEIGHTS = os.path.join(ROOT, "cache", "RealESRGAN_x4plus.pth")
WEIGHTS_URL = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth"

# tiles keep the model inside memory; each is read with a margin that is thrown away again, so the
# seams between tiles never show
TILE = 256
MARGIN = 16


def upscale(image):
	if os.path.exists(WEIGHTS):
		print("weights", WEIGHTS)
	else:
		os.makedirs(os.path.dirname(WEIGHTS), exist_ok=True)
		urllib.request.urlretrieve(WEIGHTS_URL, WEIGHTS)
	device = "mps" if torch.backends.mps.is_available() else "cpu"
	model = ModelLoader().load_from_file(WEIGHTS).eval().to(device)
	pixels = np.asarray(image.convert("RGB")).astype(np.float32) / 255
	height, width, _ = pixels.shape
	out = np.zeros((height * 4, width * 4, 3), np.float32)
	for top in range(0, height, TILE):
		for left in range(0, width, TILE):
			read_top, read_left = max(top - MARGIN, 0), max(left - MARGIN, 0)
			read_bottom, read_right = min(top + TILE + MARGIN, height), min(left + TILE + MARGIN, width)
			piece = torch.from_numpy(pixels[read_top:read_bottom, read_left:read_right].transpose(2, 0, 1)).unsqueeze(0).to(device)
			with torch.no_grad():
				result = model(piece).clamp(0, 1)[0].cpu().numpy().transpose(1, 2, 0)
			skip_top, skip_left = (top - read_top) * 4, (left - read_left) * 4
			keep_height, keep_width = (min(top + TILE, height) - top) * 4, (min(left + TILE, width) - left) * 4
			out[top * 4:top * 4 + keep_height, left * 4:left * 4 + keep_width] = result[skip_top:skip_top + keep_height, skip_left:skip_left + keep_width]
		print("upscaled row", top, "of", height, flush=True)
	return Image.fromarray((out * 255).round().astype(np.uint8)).convert("RGBA")


ORIGINAL_WIDTH = 1536
BRAND = (77, 255, 159)
BRAND_HUE = 148 / 360

# where blue means the brand: the speech bubble's "ObjectExplorer!", the device and the scan light
# it throws on the nut, and the four feature tiles on the end card. The format logos in panel 12
# are blue as well and are the formats' own colours, so they are outside every box.
recolour_boxes = [
	(140, 555, 295, 625),
	(325, 540, 690, 766),
	(855, 790, 1385, 905),
]

# the old blue logo and wordmark on the end card, painted over and drawn again
wordmark_box = (300, 778, 840, 908)


def scaled(box, scale):
	return tuple(round(value * scale) for value in box)


def recolour(pixels, box):
	left, top, right, bottom = box
	region = pixels[top:bottom, left:right].astype(np.float32) / 255
	maximum = region.max(axis=2)
	minimum = region.min(axis=2)
	delta = maximum - minimum
	saturation = np.where(maximum > 0, delta / np.maximum(maximum, 1e-6), 0)
	red, green, blue = region[..., 0], region[..., 1], region[..., 2]
	hue = np.zeros_like(maximum)
	safe = np.maximum(delta, 1e-6)
	hue = np.where(maximum == red, ((green - blue) / safe) % 6, hue)
	hue = np.where(maximum == green, (blue - red) / safe + 2, hue)
	hue = np.where(maximum == blue, (red - green) / safe + 4, hue)
	hue = hue / 6
	is_blue = (hue > 180 / 360) & (hue < 240 / 360) & (saturation > 0.22) & (maximum > 0.18)
	# the hue alone is swapped; how bright and how saturated each pixel is stays, so the glow, the
	# anti-aliased letter edges and the shading all survive
	new_hue = np.full_like(hue, BRAND_HUE)
	chroma = maximum * saturation
	sector = new_hue * 6
	second = chroma * (1 - np.abs(sector % 2 - 1))
	offset = maximum - chroma
	# hue 148 sits in sector 2 (green → cyan): r = 0, g = chroma, b = second
	shifted = np.stack([offset, chroma + offset, second + offset], axis=2)
	region = np.where(is_blue[..., None], shifted, region)
	pixels[top:bottom, left:right] = (region * 255).round().clip(0, 255).astype(np.uint8)


# the end card's background is a dark gradient that brightens to the left where the forest shows
# through. The box is filled as a Coons patch of the colours just outside it, so the fill meets all
# four edges and no outline of the box is left to see.
def paint_over(pixels, box):
	left, top, right, bottom = box
	# a few rows or columns averaged and then smoothed along the edge, or every whisker and leaf the
	# edge happens to cross is drawn across the whole box as a streak
	band = max(2, (bottom - top) // 20)
	left_edge = smooth(pixels[top:bottom, left - band:left].astype(np.float32).mean(axis=1), band * 3)
	right_edge = smooth(pixels[top:bottom, right:right + band].astype(np.float32).mean(axis=1), band * 3)
	top_edge = smooth(pixels[top - band:top, left:right].astype(np.float32).mean(axis=0), band * 3)
	bottom_edge = smooth(pixels[bottom:bottom + band, left:right].astype(np.float32).mean(axis=0), band * 3)
	across = np.linspace(0, 1, right - left)[None, :, None]
	down = np.linspace(0, 1, bottom - top)[:, None, None]
	sides = left_edge[:, None, :] * (1 - across) + right_edge[:, None, :] * across
	ends = top_edge[None, :, :] * (1 - down) + bottom_edge[None, :, :] * down
	corners = (top_edge[0] * (1 - across) * (1 - down) + top_edge[-1] * across * (1 - down)
		+ bottom_edge[0] * (1 - across) * down + bottom_edge[-1] * across * down)
	fill = sides + ends - corners
	pixels[top:bottom, left:right] = fill.round().clip(0, 255).astype(np.uint8)


def smooth(column, radius):
	kernel = np.exp(-0.5 * (np.arange(-radius, radius + 1) / (radius / 2)) ** 2)
	kernel = kernel / kernel.sum()
	padded = np.pad(column, ((radius, radius), (0, 0)), mode="edge")
	return np.stack([np.convolve(padded[:, channel], kernel, mode="valid") for channel in range(column.shape[1])], axis=1)


def draw_wordmark(image, box, mark, scale):
	left, top, right, bottom = box
	draw = ImageDraw.Draw(image)
	font = ImageFont.truetype("/System/Library/Fonts/SFNSRounded.ttf", round(56 * scale))
	font.set_variation_by_name("Bold")
	mark_size = round(84 * scale)
	sized = mark.resize((mark_size, mark_size), Image.LANCZOS)
	mark_left = left + round(24 * scale)
	mark_top = top + (bottom - top - mark_size) // 2 - round(4 * scale)
	image.alpha_composite(sized, (mark_left, mark_top))
	text_left = mark_left + mark_size + round(10 * scale)
	baseline = top + round(80 * scale)
	draw.text((text_left, baseline), "Object", font=font, fill=(236, 240, 244, 255), anchor="ls")
	object_width = draw.textlength("Object", font=font)
	draw.text((text_left + object_width, baseline), "Explorer", font=font, fill=BRAND + (255,), anchor="ls")


def main():
	image = upscale(Image.open(SOURCE))
	scale = image.width / ORIGINAL_WIDTH
	pixels = np.array(image)
	for box in recolour_boxes:
		recolour(pixels[..., :3], scaled(box, scale))
	paint_over(pixels[..., :3], scaled(wordmark_box, scale))
	image = Image.fromarray(pixels, "RGBA")
	draw_wordmark(image, scaled(wordmark_box, scale), Image.open(MARK).convert("RGBA"), scale)
	image.convert("RGB").save(TARGET, quality=90)
	print("wrote", TARGET, image.size)


main()
