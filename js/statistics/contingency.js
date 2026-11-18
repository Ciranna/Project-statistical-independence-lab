export function contingency(records) {
  if (!Array.isArray(records) || records.length === 0) throw new Error('Provide a nonempty array of records.');
  const clean = records.map((r,i) => {
    if (!r || typeof r !== 'object' || !Object.hasOwn(r,'x') || !Object.hasOwn(r,'y')) throw new Error(`Invalid record at index ${i}.`);
    const x=String(r.x).trim(), y=String(r.y).trim();
    if (!x || !y) throw new Error(`Missing category at index ${i}.`);
    return {x,y};
  });
  const rows=[...new Set(clean.map(r=>r.x))], cols=[...new Set(clean.map(r=>r.y))];
  const counts=rows.map(x=>cols.map(y=>clean.reduce((s,r)=>s+(r.x===x && r.y===y),0)));
  const rowTotals=counts.map(row=>row.reduce((a,b)=>a+b,0));
  const colTotals=cols.map((_,j)=>counts.reduce((s,row)=>s+row[j],0));
  const n=clean.length;
  const joint=counts.map(row=>row.map(v=>v/n));
  const conditionalByRow=counts.map((row,i)=>row.map(v=>v/rowTotals[i]));
  const conditionalByColumn=counts.map(row=>row.map((v,j)=>v/colTotals[j]));
  return {rows,cols,counts,rowTotals,colTotals,n,joint,conditionalByRow,conditionalByColumn,rowMarginal:rowTotals.map(v=>v/n),colMarginal:colTotals.map(v=>v/n)};
}
