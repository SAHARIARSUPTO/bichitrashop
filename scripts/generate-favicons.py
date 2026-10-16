"""
Script to generate all required favicon assets for Bichitra Shop:
- favicon.ico (multi-resolution 16x16, 32x32, 48x48)
- favicon-16x16.png
- favicon-32x32.png
- favicon-48x48.png
- apple-touch-icon.png (180x180)
- apple-touch-icon-precomposed.png (180x180)
- android-chrome-192x192.png (192x192)
- android-chrome-512x512.png (512x512)
- favicon.svg and icon.svg
- site.webmanifest, manifest.json, manifest.webmanifest
"""

import base64
import json
import os
import shutil
from io import BytesIO
from PIL import Image

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    public_dir = os.path.join(root_dir, 'public')
    app_dir = os.path.join(root_dir, 'app')
    
    src_logo = os.path.join(public_dir, 'Bichitra_Shop_Green_Badge_Logo-removebg-preview.png')
    if not os.path.exists(src_logo):
        raise FileNotFoundError(f"Source logo not found at {src_logo}")

    print(f"Loading source logo from: {src_logo}")
    img = Image.open(src_logo).convert('RGBA')

    # Crop to non-transparent bounding box
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    w, h = cropped.size
    print(f"Original bbox: {bbox}, cropped size: {w}x{h}")

    # Build master 512x512 canvas with balanced padding (496x496 inside 512x512)
    target_dim = 496
    ratio = min(target_dim / w, target_dim / h)
    new_w = int(w * ratio)
    new_h = int(h * ratio)
    resized_badge = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    offset_x = (512 - new_w) // 2
    offset_y = (512 - new_h) // 2
    canvas_512.paste(resized_badge, (offset_x, offset_y), resized_badge)

    # 1. Save PNG sizes
    sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'favicon-48x48.png': (48, 48),
        'apple-touch-icon.png': (180, 180),
        'apple-touch-icon-precomposed.png': (180, 180),
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512),
    }

    for filename, (dim_w, dim_h) in sizes.items():
        out_path = os.path.join(public_dir, filename)
        if (dim_w, dim_h) == (512, 512):
            resized_img = canvas_512
        else:
            resized_img = canvas_512.resize((dim_w, dim_h), Image.Resampling.LANCZOS)
        resized_img.save(out_path, format='PNG', optimize=True)
        print(f"Generated {filename} ({dim_w}x{dim_h})")

    # 2. Generate multi-resolution favicon.ico (16x16, 32x32, 48x48)
    ico_path_public = os.path.join(public_dir, 'favicon.ico')
    ico_path_app = os.path.join(app_dir, 'favicon.ico')
    
    canvas_512.save(
        ico_path_public,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    # Also overwrite app/favicon.ico so Next.js never serves the default Next.js triangle!
    shutil.copyfile(ico_path_public, ico_path_app)
    print("Generated multi-resolution favicon.ico in public/ and app/")

    # 3. Generate SVG favicons
    buffer = BytesIO()
    canvas_512.save(buffer, format='PNG')
    b64_png = base64.b64encode(buffer.getvalue()).decode('ascii')
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="100%" height="100%">
  <title>Bichitra Shop Favicon</title>
  <image width="512" height="512" href="data:image/png;base64,{b64_png}" xlink:href="data:image/png;base64,{b64_png}"/>
</svg>
'''
    svg_path_public = os.path.join(public_dir, 'favicon.svg')
    svg_icon_path = os.path.join(public_dir, 'icon.svg')
    with open(svg_path_public, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open(svg_icon_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Generated favicon.svg and icon.svg in public/")

    # 4. Generate Web App Manifests
    manifest_data = {
        "name": "Bichitra Shop – বিচিত্র শপ",
        "short_name": "Bichitra Shop",
        "description": "বিচিত্র শপ – প্রিমিয়াম কোটি সেট, পাঞ্জাবি, বোরকা ও আবায়া, খাঁটি অর্গানিক ফুড এবং আধুনিক লাইফস্টাইল পণ্য।",
        "icons": [
            {
                "src": "/favicon-16x16.png",
                "sizes": "16x16",
                "type": "image/png"
            },
            {
                "src": "/favicon-32x32.png",
                "sizes": "32x32",
                "type": "image/png"
            },
            {
                "src": "/android-chrome-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            },
            {
                "src": "/android-chrome-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            }
        ],
        "theme_color": "#08542C",
        "background_color": "#ffffff",
        "start_url": "/",
        "display": "standalone",
        "orientation": "portrait"
    }

    manifest_json_str = json.dumps(manifest_data, indent=2, ensure_ascii=False)
    for m_file in ['site.webmanifest', 'manifest.json', 'manifest.webmanifest']:
        p = os.path.join(public_dir, m_file)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(manifest_json_str)
        print(f"Generated {m_file} in public/")

    print("All favicon assets generated successfully!")

if __name__ == '__main__':
    main()
