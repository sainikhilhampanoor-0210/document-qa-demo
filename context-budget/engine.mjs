export function plan(items,budget){
 if(!Number.isInteger(budget)||budget<1||budget>2000||!Array.isArray(items)||items.length>100||items.some(x=>!x||typeof x.source!=="string"||!x.source.trim()||!Number.isInteger(x.tokens)||x.tokens<1||!Number.isFinite(x.value)||x.value<0||x.value>1000000))throw Error("Use up to 100 named passages with positive integer token costs and relevance scores from 0 to 1,000,000.");
 const empty=()=>({tokens:0,value:0,sources:[]});
 const add=(a,b)=>({tokens:a.tokens+b.tokens,value:a.value+b.value,sources:[...a.sources,b.source]});
 let greedy=empty();for(const item of [...items].sort((a,b)=>b.value/b.tokens-a.value/a.tokens)){if(greedy.tokens+item.tokens<=budget)greedy=add(greedy,item);}
 const best=Array.from({length:budget+1},empty);for(const item of items){for(let cap=budget;cap>=item.tokens;cap--){const candidate=add(best[cap-item.tokens],item);if(candidate.value>best[cap].value||(candidate.value===best[cap].value&&candidate.tokens<best[cap].tokens))best[cap]=candidate;}}
 return {greedy,optimal:best[budget]};
}
