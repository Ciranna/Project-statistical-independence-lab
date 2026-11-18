import { parseBivariateCSV } from './data/csv.js';
import { renderVisualizations } from './charts/visualizations.js';
import { datasets } from './data/datasets.js';
import { contingency } from './statistics/contingency.js';
import { chiSquareTest } from './statistics/chiSquare.js';
import { renderFindings } from './analysis/findings.js';
const select=document.querySelector('#dataset');
const alphaSelect=document.querySelector('#alpha');
const summary=document.querySelector('#summary');
const tables=document.querySelector('#tables');
const analysis=document.querySelector('#analysis');
const visuals=document.querySelector('#visualizations');
const findings=document.querySelector('#findings');
const fmt=v=>Number(v).toFixed(3);
let customData=null;
const escapeHTML=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderTable(title, rows, cols, matrix, rowTotals=null, colTotals=null, total=null, formatter=String){
 const head=`<thead><tr><th>X / F</th>${cols.map(c=>`<th>${escapeHTML(c)}</th>`).join('')}${rowTotals?'<th>Total</th>':''}</tr></thead>`;
 const body=rows.map((r,i)=>`<tr><th>${escapeHTML(r)}</th>${matrix[i].map(v=>`<td>${formatter(v)}</td>`).join('')}${rowTotals?`<td><strong>${formatter(rowTotals[i])}</strong></td>`:''}</tr>`).join('');
 const foot=colTotals?`<tr><th>Total</th>${colTotals.map(v=>`<td><strong>${formatter(v)}</strong></td>`).join('')}<td><strong>${formatter(total)}</strong></td></tr>`:'';
 return `<section class="panel"><h2>${title}</h2><div class="scroll"><table>${head}<tbody>${body}${foot}</tbody></table></div></section>`;
}
function render(){
 const d=customData??datasets[select.value],t=contingency(d.records);
 summary.textContent=`${d.title} · ${t.n} observations · ${t.rows.length} × ${t.cols.length} categories`;
 tables.innerHTML=renderTable('Observed contingency table',t.rows,t.cols,t.counts,t.rowTotals,t.colTotals,t.n)
 +renderTable('Joint relative frequencies',t.rows,t.cols,t.joint,t.rowMarginal,t.colMarginal,1,fmt)
 +renderTable('Conditional frequencies — given X (row percentages)',t.rows,t.cols,t.conditionalByRow,null,null,null,v=>`${(100*v).toFixed(1)}%`)
 +renderTable('Conditional frequencies — given F (column percentages)',t.rows,t.cols,t.conditionalByColumn,null,null,null,v=>`${(100*v).toFixed(1)}%`);
 const s=chiSquareTest(t,{alpha:Number(alphaSelect.value)});
 const p=s.pValue<1e-6?s.pValue.toExponential(4):s.pValue.toFixed(6);
 analysis.innerHTML=renderTable('Expected frequencies under H₀: independence',t.rows,t.cols,s.expected,null,null,null,v=>v.toFixed(3))
 +renderTable('Cell contributions to Pearson χ²',t.rows,t.cols,s.contributions,null,null,null,v=>v.toFixed(4))
 +`<section class="panel"><h2>Chi-square test of independence</h2><div class="metrics"><div><span>χ² statistic</span><strong>${s.statistic.toFixed(6)}</strong></div><div><span>Degrees of freedom</span><strong>${s.degreesOfFreedom}</strong></div><div><span>p-value</span><strong>${p}</strong></div><div><span>Cramér's V</span><strong>${s.cramerV.toFixed(4)}</strong></div></div><p><strong>H₀:</strong> X and F are independent in the population. <strong>H₁:</strong> they are associated.</p><p class="conclusion">${s.rejectNull?`Reject H₀ at α = ${s.alpha}: the data provide evidence of a statistical association.`:`Do not reject H₀ at α = ${s.alpha}: insufficient evidence of association. This does not prove independence.`}</p><p class="note">Minimum expected count: ${s.minExpected.toFixed(2)}. ${s.asymptoticWarning??'All expected cell counts are at least 5.'} The test assumes independent observations and an appropriate sampling design.</p><p class="note">Association does not imply causation. Unmeasured confounders and selection effects may explain observed relationships. Cramér's V describes association strength, not causal effect.</p></section>`;
 visuals.innerHTML=renderVisualizations(t,s);
 findings.innerHTML=renderFindings(t,s,{title:d.title,alpha:s.alpha});
}
select.addEventListener('change',()=>{customData=null;document.querySelector('#csv-status').textContent='';render();});
document.querySelector('#reset-dataset').addEventListener('click',()=>{customData=null;document.querySelector('#csv-file').value='';document.querySelector('#csv-status').textContent='Example dataset restored.';render();});
document.querySelector('#csv-file').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw new Error('File exceeds 5 MB limit.');const parsed=parseBivariateCSV(await file.text());const table=contingency(parsed.records);if(table.rows.length<2||table.cols.length<2)throw new Error('Chi-square requires at least two categories in each variable.');customData={title:`Custom CSV: ${parsed.headers.join(' vs. ')}`,records:parsed.records};document.querySelector('#csv-status').textContent=`Loaded ${parsed.records.length} observations.`;render();}catch(err){document.querySelector('#csv-status').textContent=`Import error: ${err.message}`;}});
alphaSelect.addEventListener('change',render);render();
