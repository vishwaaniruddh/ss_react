const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace px-XX
  content = content.replace(/(^|\s|["'`])(sm:|md:|lg:|xl:|2xl:|hover:|focus:)*px-([a-zA-Z0-9\[\]\.-]+)/g, '$1$2pl-$3 $2pr-$3');
  // Replace py-XX
  content = content.replace(/(^|\s|["'`])(sm:|md:|lg:|xl:|2xl:|hover:|focus:)*py-([a-zA-Z0-9\[\]\.-]+)/g, '$1$2pt-$3 $2pb-$3');
  // Replace mx-XX
  content = content.replace(/(^|\s|["'`])(sm:|md:|lg:|xl:|2xl:|hover:|focus:)*mx-([a-zA-Z0-9\[\]\.-]+)/g, '$1$2ml-$3 $2mr-$3');
  // Replace my-XX
  content = content.replace(/(^|\s|["'`])(sm:|md:|lg:|xl:|2xl:|hover:|focus:)*my-([a-zA-Z0-9\[\]\.-]+)/g, '$1$2mt-$3 $2mb-$3');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src');
console.log('Done replacing logical properties.');
