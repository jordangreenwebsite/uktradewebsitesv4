import fs from 'node:fs';
import path from 'node:path';
const legacy = path.resolve(process.cwd(), '..', 'wp-content', 'uploads');
const dest = path.resolve(process.cwd(), 'public', 'wp-content', 'uploads');
const files = [
 '2026/03/cropped-UK-TRADE-WEbsites-1.png',
 '2026/03/cropped-UK-TRADE-WEbsites-1-32x32.png',
 '2026/03/cropped-UK-TRADE-WEbsites-1-180x180.png',
 '2026/03/UK-TRADE-WEbsites-1.png',
 '2026/03/jordan-1.png',
 '2026/03/Winter-Window-cleaning.jpg',
 '2026/03/9d652a95-7af2-4266-92f5-26ca7c434929.jpg',
 '2026/03/timothy-muza-6VjPmyMj5KM-unsplash-1024x683.jpg',
 '2026/03/charlesdeluvio-Lks7vei-eAg-unsplash-1024x683.jpg',
 '2026/03/maxim-ilyahov-0aRycsfH57A-unsplash-1024x683.jpg',
 '2026/03/flipsnack-4NYFoUCPpbk-unsplash-1024x683.jpg',
 '2026/03/image0-768x521.jpeg', '2026/03/image1-768x521.jpeg',
 '2026/03/image2-768x521.jpeg', '2026/03/image3-768x521.jpeg',
 '2026/05/Prunus-Media-Left-orientation-300x300.png',
 '2026/05/Blue-Orange-Website-Promo-Banner-1024x576.png',
 '2026/05/Screenshot-2026-05-27-043455-1024x530.png',
 '2026/05/Screenshot-2026-05-27-043715-1024x636.png',
 '2026/05/Screenshot-2026-05-27-071704-1024x598.png',
 '2026/05/Screenshot-2026-05-27-075937-1024x597.png',
 '2026/08/Screenshot-2026-08-20-052158-1024x489.png',
 '2026/08/Screenshot-2026-08-20-052217-1024x489.png',
 '2026/08/Screenshot-2026-08-20-052252-1024x486.png',
 '2026/08/Screenshot-2026-08-20-053657-1024x491.png',
];
if (!fs.existsSync(legacy)) throw new Error('Missing source media: build from repository root so the original assets are available.');
for (const file of files) {
 const from = path.join(legacy, file); const to = path.join(dest, file);
 if (!fs.existsSync(from)) throw new Error('Missing image: ' + from);
 fs.mkdirSync(path.dirname(to), {recursive:true}); fs.copyFileSync(from, to);
}
console.log('Copied ' + files.length + ' retained local media assets from legacy export.');
