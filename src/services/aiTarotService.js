import { interpretTarot } from './tarotEngine.js';
export const AI_ENABLED=import.meta.env?.VITE_AI_ENABLED==='true';
export async function getReading(input){
 const fallback=interpretTarot(input);
 if(!AI_ENABLED)return fallback;
 try{const response=await fetch('/api/tarot-reading',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('AI unavailable');const data=await response.json();if(typeof data.narrative!=='string'||!data.narrative.trim())throw new Error('Invalid response');return {...fallback,aiNarrative:data.narrative};}catch{return {...fallback,aiFallback:true};}
}
