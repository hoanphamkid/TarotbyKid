import { mkdir,writeFile } from 'node:fs/promises';
import { tarotCards } from '../src/data/tarotCards.js';
await mkdir('public/cards-images',{recursive:true});
for(let i=0;i<tarotCards.length;i+=6){
 await Promise.all(tarotCards.slice(i,i+6).map(async card=>{const response=await fetch(`https://raw.githubusercontent.com/sixseeds/tarot-api/main/cards/${card.id}.jpg`);if(!response.ok)throw new Error(`${card.id}: ${response.status}`);await writeFile(`public${card.image}`,Buffer.from(await response.arrayBuffer()));}));
}
console.log('Downloaded 78 Rider-Waite-Smith card images.');
