// scripts/generate-product-images.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const productsDir = path.join(publicDir, 'products');
const categoriesDir = path.join(publicDir, 'categories');
const bannersDir = path.join(publicDir, 'banners');

if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(categoriesDir)) fs.mkdirSync(categoriesDir, { recursive: true });

async function generateAssets() {
  console.log('Generating local Bangladeshi-vibe product & category images...');

  // 1. Koti Set Product Images
  // Primary: 800x800 focused on the model wearing the royal navy embroidered koti
  await sharp(path.join(bannersDir, 'koti_collection_banner.jpg'))
    .extract({ left: 620, top: 0, width: 756, height: 768 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'koti_set_navy_gold.jpg'));

  // Secondary angle: Closer chest view of embroidery
  await sharp(path.join(bannersDir, 'koti_collection_banner.jpg'))
    .extract({ left: 740, top: 80, width: 550, height: 550 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'koti_embroidery_detail.jpg'));

  // 2. Jamdani Cotton Panjabi Product Images
  await sharp(path.join(bannersDir, 'koti_collection_banner.jpg'))
    .extract({ left: 700, top: 40, width: 650, height: 650 })
    .resize(800, 800)
    .modulate({ brightness: 1.05, saturation: 0.95 })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'jamdani_panjabi_white.jpg'));

  // 3. Dubai Cherry Georgette Abaya Images
  await sharp(path.join(bannersDir, 'abaya_collection_banner.jpg'))
    .extract({ left: 620, top: 0, width: 756, height: 768 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'cherry_georgette_abaya.jpg'));

  await sharp(path.join(bannersDir, 'abaya_collection_banner.jpg'))
    .extract({ left: 780, top: 100, width: 560, height: 560 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'cherry_abaya_detail.jpg'));

  // 4. Sundarban Raw Honey & Mustard Oil Bundle
  await sharp(path.join(bannersDir, 'deshi_mortar_pestle_spices.jpg'))
    .extract({ left: 100, top: 450, width: 1400, height: 1400 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'sundarban_honey_mustard_oil.jpg'));

  await sharp(path.join(bannersDir, 'deshi_spices_wooden_bowls.jpg'))
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'organic_spices_bundle.jpg'));

  // 5. Electric Blender & Grinder (Kitchen Appliances)
  await sharp(path.join(bannersDir, 'kitchen_blender_appliance.jpg'))
    .extract({ left: 500, top: 0, width: 1026, height: 1026 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'blender_grinder_appliance.jpg'));

  await sharp(path.join(bannersDir, 'modern_kitchen_appliances.jpg'))
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'modern_kitchen_appliances.jpg'));

  // 6. Stainless Steel Electric Kettle
  await sharp(path.join(bannersDir, 'electric_kettle_appliance.jpg'))
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'electric_kettle_stainless.jpg'));

  // 7. Foldable Laptop Table / Home Living Cookware
  await sharp(path.join(bannersDir, 'deshi_cookware_kitchen.jpg'))
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'deshi_cookware_kitchen.jpg'));

  await sharp(path.join(bannersDir, 'deshi_biryani_pot.jpg'))
    .resize(800, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'deshi_biryani_pot.jpg'));

  // 8. TWS Wireless Bluetooth Earbuds
  await sharp(path.join(bannersDir, 'gadgets_lifestyle_banner.jpg'))
    .extract({ left: 600, top: 0, width: 776, height: 768 })
    .resize(800, 800)
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'wireless_earbuds_smartwatch.jpg'));

  // --- CATEGORY THUMBNAILS (600x600 square) ---
  // Mens Fashion Category
  await sharp(path.join(productsDir, 'koti_set_navy_gold.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'mens_fashion.jpg'));

  // Womens Fashion Category
  await sharp(path.join(productsDir, 'cherry_georgette_abaya.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'womens_fashion.jpg'));

  // Gadgets Category
  await sharp(path.join(productsDir, 'wireless_earbuds_smartwatch.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'gadgets.jpg'));

  // Home Appliances Category
  await sharp(path.join(productsDir, 'blender_grinder_appliance.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'home_appliances.jpg'));

  // Home & Living Category
  await sharp(path.join(productsDir, 'deshi_cookware_kitchen.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'home_living.jpg'));

  // Organic Food Category
  await sharp(path.join(productsDir, 'sundarban_honey_mustard_oil.jpg'))
    .resize(600, 600)
    .toFile(path.join(categoriesDir, 'organic_food.jpg'));

  console.log('✅ All local Bangladeshi-vibe product & category images created successfully!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
