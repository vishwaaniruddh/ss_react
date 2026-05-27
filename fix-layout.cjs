const fs = require('fs');

const files = [
  'src/sections/Hero.jsx',
  'src/pages/BridalCollections.jsx',
  'src/pages/JewelleryCollections.jsx',
  'src/pages/Checkout.jsx',
  'src/pages/Shop.jsx',
  'src/pages/About.jsx',
  'src/pages/ProductDetails.jsx',
  'src/pages/Auth.jsx',
  'src/pages/Wishlist.jsx',
  'src/pages/Cart.jsx',
  'src/pages/Contact.jsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix Hero
  if (file.includes('Hero.jsx')) {
    content = content.replace('pt-32 pb-20 lg:py-0', 'pt-32 pb-20 lg:pt-40 lg:pb-12');
  }

  // Fix interior pages
  // Replace pt-XX pb-YY section-padding with page-header
  content = content.replace(/pt-3[26] pb-\d+ section-padding/g, 'page-header');
  content = content.replace(/pt-3[26] pb-\d+ min-h-screen flex items-center section-padding/g, 'min-h-screen flex items-center page-header');
  content = content.replace(/pt-3[26] pb-\d+ section-padding min-h-screen/g, 'min-h-screen page-header');
  
  // Bridal and Jewellery
  content = content.replace('container-luxury pt-32', 'container-luxury pt-40');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed padding classes in pages.');
