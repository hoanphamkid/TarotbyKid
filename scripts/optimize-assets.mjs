import sharp from 'sharp';
import { readFile,writeFile } from 'node:fs/promises';
import { tarotCards } from '../src/data/tarotCards.js';
for(const card of tarotCards){const path=`public${card.image}`;const source=await readFile(path);await writeFile(path,await sharp(source).resize({width:480,withoutEnlargement:true}).jpeg({quality:83,mozjpeg:true}).toBuffer());}
console.log('Optimized all 78 card images to a maximum width of 480px.');
