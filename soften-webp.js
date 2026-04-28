const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = process.cwd();
const assets = path.join(root, 'assets', 'img');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

(async () => {
  const files = walk(assets).filter((f) => f.toLowerCase().endsWith('.webp'));
  let ok = 0;
  let fail = 0;

  for (const file of files) {
    try {
      const buf = await sharp(file).blur(0.35).webp({ quality: 82, effort: 6 }).toBuffer();
      fs.writeFileSync(file, buf);
      ok += 1;
    } catch (e) {
      fail += 1;
    }
  }

  console.log(JSON.stringify({ processed: files.length, ok, fail }, null, 2));
})();
