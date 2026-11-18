const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function bars(title,items,legend){
 const max=Math.max(1,...items.flatMap(d=>d.values.map(v=>v.value)));
 return `<section class="panel"><h2>${esc(title)}</h2><p class="note">${esc(legend)}</p><div class="chart-bars">${items.map(d=>`<div class="bar-row"><div class="bar-label">${esc(d.label)}</div><div class="bar-tracks">${d.values.map((v,i)=>`<div class="bar-line"><span class="bar-tag">${esc(v.name)}</span><div class="bar-track"><div class="bar-fill ${i===1?'secondary':''}" style="width:${(100*v.value/max).toFixed(2)}%"></div></div><span class="bar-value">${Number(v.value).toFixed(3)}</span></div>`).join('')}</div></div>`).join('')}</div></section>`;
}
export function renderVisualizations(t,s){
 const cells=t.rows.flatMap((r,i)=>t.cols.map((c,j)=>({label:`${r} / ${c}`,values:[{name:'Observed',value:t.counts[i][j]},{name:'Expected',value:s.expected[i][j]}]})));
 const cond=t.rows.flatMap((r,i)=>t.cols.map((c,j)=>({label:`${r} → ${c}`,values:[{name:'Within row',value:t.conditionalByRow[i][j]}]})));
 const contrib=t.rows.flatMap((r,i)=>t.cols.map((c,j)=>({label:`${r} / ${c}`,values:[{name:'χ² part',value:s.contributions[i][j]}]})));
 return bars('Observed vs. expected frequencies',cells,'Counts per contingency cell; expected counts assume independence.')+bars('Conditional frequencies by X',cond,'Proportions within each X category; each row sums to 1.')+bars('Chi-square contributions',contrib,'Larger contributions indicate cells with greater departures from independence.');
}
