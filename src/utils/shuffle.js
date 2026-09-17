import { tarotCards } from '../data/tarotCards.js';
export const UPRIGHT_RATE=0.5;
export function shuffleDeck(random=Math.random,rate=UPRIGHT_RATE){
 const deck=[...tarotCards];
 for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
 return deck.map(card=>({id:card.id,orientation:random()<rate?'upright':'reversed'}));
}
