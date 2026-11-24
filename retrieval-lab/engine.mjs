export const corpus=[
["returns","Unused items can be returned within 30 days of delivery."],
["refund","Refund payments arrive five business days after inspection."],
["shipping","Standard shipping takes three to five business days."],
["express","Express shipping delivers packages in one to two days."],
["access","Reset your password with an email recovery link."],
["warranty","Hardware defects qualify for warranty repairs for one year."]];
export const cases=[["return unused items","returns"],["money back after inspection","refund"],["standard shipping time","shipping"],["fast delivery","express"],["forgot login credentials","access"],["broken hardware repair","warranty"]];
const synonyms={fast:"express",delivery:"shipping",forgot:"reset",login:"password",credentials:"password",money:"refund",back:"refund",broken:"defects",repair:"repairs"};
const words=s=>s.toLowerCase().match(/[a-z]+/g)||[];
export function rank(query,expanded=false){
 const original=words(query), terms=new Set(expanded?original.concat(original.map(x=>synonyms[x]).filter(Boolean)):original);
 const index=corpus.map(([id,body])=>({id,tokens:new Set(words(id+" "+body))}));
 return index.map(({id,tokens})=>({id,score:[...terms].reduce((sum,t)=>sum+(tokens.has(t)?Math.log(1+index.length/index.filter(d=>d.tokens.has(t)).length):0),0)}))
 .filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).map(d=>d.id);
}
export function evaluate(questions,k,expanded){
 const rows=questions.map(([q,gold])=>{const found=rank(q,expanded).slice(0,k);const position=found.indexOf(gold)+1;return {q,gold,found,position};});
 return {rows,hit:rows.filter(r=>r.position).length/rows.length,mrr:rows.reduce((s,r)=>s+(r.position?1/r.position:0),0)/rows.length};
}
