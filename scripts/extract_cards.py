import os
import re
import json
import shutil
import yaml

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REACT_APP_DIR = os.path.dirname(SCRIPT_DIR)
ROOT = os.path.dirname(REACT_APP_DIR)
DESIGNER = os.path.join(ROOT, "Assets/_Designer")
OUT_DIR = os.path.join(REACT_APP_DIR, "src/data")
IMG_OUT_DIR = os.path.join(REACT_APP_DIR, "public/cards")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(IMG_OUT_DIR, exist_ok=True)

# Ignore all custom Unity YAML tags (!u!114 &11400000 etc.) by using a loader
# that treats any unknown tag as a plain mapping/scalar.
class UnityLoader(yaml.SafeLoader):
    pass

def construct_unity(loader, tag_suffix, node):
    if isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node, deep=True)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node, deep=True)
    return loader.construct_scalar(node)

UnityLoader.add_multi_constructor("tag:unity3d.com,2011:", construct_unity)

MODES = ["Facilitation", "Understand", "Observe", "Define", "Ideate", "Prototype", "Test", "Realise"]
CORE_NAMES = ["Core", "Expansion"]

def slugify(name):
    s = re.sub(r"[^a-zA-Z0-9]+", "-", name).strip("-").lower()
    return s

# ---- Build guid -> filepath map from all .meta files under _Designer ----
guid_to_path = {}
for dirpath, dirnames, filenames in os.walk(DESIGNER):
    for fn in filenames:
        if fn.endswith(".meta"):
            meta_path = os.path.join(dirpath, fn)
            real_path = meta_path[:-5]  # strip .meta
            if not os.path.exists(real_path):
                continue
            try:
                with open(meta_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith("guid:"):
                            guid = line.split("guid:")[1].strip()
                            guid_to_path[guid] = real_path
                            break
            except Exception as e:
                pass

print(f"Indexed {len(guid_to_path)} guids")

# ---- Parse Category.asset ----
cat_path = os.path.join(DESIGNER, "Categories/Category.asset")
def unwrap(doc):
    if doc and "MonoBehaviour" in doc:
        return doc["MonoBehaviour"]
    return doc

with open(cat_path, "r", encoding="utf-8", errors="ignore") as f:
    docs = [unwrap(d) for d in yaml.load_all(f, Loader=UnityLoader)]
cat_doc = None
for d in docs:
    if d and "categories" in d:
        cat_doc = d
        break
categories_out = []
for c in cat_doc["categories"]:
    categories_out.append({"categoryName": c["categoryName"], "modes": c["modes"]})

with open(os.path.join(OUT_DIR, "categories.json"), "w", encoding="utf-8") as f:
    json.dump(categories_out, f, indent=2)
print("Wrote categories.json:", categories_out)

# ---- Copy image helper ----
copied_images = {}
def copy_image(guid, prefix):
    if not guid or guid not in guid_to_path:
        return None
    src = guid_to_path[guid]
    if guid in copied_images:
        return copied_images[guid]
    ext = os.path.splitext(src)[1]
    dest_name = f"{prefix}{ext}"
    dest_path = os.path.join(IMG_OUT_DIR, dest_name)
    # avoid collisions
    counter = 1
    base_dest_name = dest_name
    while os.path.exists(dest_path) and dest_path not in copied_images.values():
        dest_name = f"{prefix}-{counter}{ext}"
        dest_path = os.path.join(IMG_OUT_DIR, dest_name)
        counter += 1
    shutil.copyfile(src, dest_path)
    rel = f"/cards/{dest_name}"
    copied_images[guid] = rel
    return rel

# ---- Parse each card asset ----
cards_by_guid = {}  # asset's own guid -> parsed card dict (for swap resolution)
raw_cards = []

def parse_asset_file(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        docs = [unwrap(d) for d in yaml.load_all(f, Loader=UnityLoader)]
    doc = None
    for d in docs:
        if d and "cardName" in d:
            doc = d
            break
    return doc

def get_own_guid(asset_path):
    meta_path = asset_path + ".meta"
    if not os.path.exists(meta_path):
        return None
    with open(meta_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if line.startswith("guid:"):
                return line.split("guid:")[1].strip()
    return None

card_paths = []
for core_name, subdir in [("Core", "Cards/Core"), ("Expansion", "Cards/Expansion")]:
    base = os.path.join(DESIGNER, subdir)
    for dirpath, dirnames, filenames in os.walk(base):
        for fn in filenames:
            if fn.endswith(".asset"):
                card_paths.append((core_name, os.path.join(dirpath, fn)))

print(f"Found {len(card_paths)} card assets")

parsed = []
for core_name, path in card_paths:
    doc = parse_asset_file(path)
    if doc is None:
        print("WARN: could not parse", path)
        continue
    own_guid = get_own_guid(path)
    parsed.append((core_name, path, own_guid, doc))

# map own_guid -> cardName for swap resolution
guid_to_cardname = {}
for core_name, path, own_guid, doc in parsed:
    guid_to_cardname[own_guid] = doc.get("cardName")

cards_out = []
for core_name, path, own_guid, doc in parsed:
    card_name = doc.get("cardName", "Unnamed")
    slug = slugify(card_name)
    front_guid = (doc.get("FrontPage") or {}).get("guid")
    back_guid = (doc.get("BackPage") or {}).get("guid")
    ar_guid = (doc.get("ArIcon") or {}).get("guid")
    front_img = copy_image(front_guid, f"{slug}-front")
    back_img = copy_image(back_guid, f"{slug}-back")
    ar_img = copy_image(ar_guid, f"{slug}-ar")

    templates = doc.get("Templates") or []
    template_images = []
    for i, t in enumerate(templates):
        g = (t or {}).get("guid")
        img = copy_image(g, f"{slug}-template-{i+1}")
        if img:
            template_images.append(img)

    templates_url = doc.get("TemplatesUrl") or []
    card_details = doc.get("CardDetails") or []
    card_details_out = []
    for cd in card_details:
        card_details_out.append({"category": cd.get("Category", 0), "mode": cd.get("Mode", 0)})

    modes_of_design = doc.get("ModesOfDesign", 0)
    core_val = doc.get("Core", 0)

    swap_guid = None
    swap_field = doc.get("SwapCard")
    swap_card_name = None
    if swap_field and swap_field.get("guid"):
        swap_guid_asset = swap_field.get("guid")
        # SwapCard guid refers to the target .asset's own guid (from its .meta)
        swap_card_name = guid_to_cardname.get(swap_guid_asset)

    comic_stripes = doc.get("ComicStripes") or []
    comic_images = []
    for i, cs in enumerate(comic_stripes):
        # ComicStripes stored as plain strings in this dataset (URLs or empty); keep as-is
        if isinstance(cs, str) and cs:
            comic_images.append(cs)

    url = doc.get("Url", "") or ""
    front_text = doc.get("frontPage", "") or ""
    back_text = doc.get("backPage", "") or ""

    cards_out.append({
        "id": slug,
        "cardName": card_name,
        "core": CORE_NAMES[core_val] if core_val in (0, 1) else "Core",
        "modesOfDesign": MODES[modes_of_design] if 0 <= modes_of_design < len(MODES) else MODES[0],
        "cardDetails": card_details_out,
        "frontImage": front_img,
        "backImage": back_img,
        "arIconImage": ar_img,
        "videoUrl": url,
        "frontText": front_text,
        "backText": back_text,
        "templateImages": template_images,
        "templatesUrl": templates_url,
        "comicStripes": comic_images,
        "swapCardId": slugify(swap_card_name) if swap_card_name else None,
    })

with open(os.path.join(OUT_DIR, "cards.json"), "w", encoding="utf-8") as f:
    json.dump(cards_out, f, indent=2)

print(f"Wrote {len(cards_out)} cards to cards.json")
print(f"Copied {len(copied_images)} images to {IMG_OUT_DIR}")
