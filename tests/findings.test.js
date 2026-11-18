import test from 'node:test';
import assert from 'node:assert/strict';
import {datasets} from '../js/data/datasets.js';
import {contingency} from '../js/statistics/contingency.js';
import {chiSquareTest} from '../js/statistics/chiSquare.js';
import {renderFindings,summarizeFindings} from '../js/analysis/findings.js';
const t=contingency(datasets.study.records);
test('final findings change with alpha',()=>{
 assert.equal(summarizeFindings(t,chiSquareTest(t,{alpha:.05})).decision,'Reject H₀');
 assert.equal(summarizeFindings(t,chiSquareTest(t,{alpha:.01})).decision,'Do not reject H₀');
});
test('findings distinguish association and causation',()=>{
 const h=renderFindings(t,chiSquareTest(t));
 assert.match(h,/Association is not causation/);
 assert.match(h,/Probability vs. statistical independence/);
 assert.match(h,/Cramér/);
});
test('findings escape user supplied labels',()=>{
 const h=renderFindings(t,chiSquareTest(t),{title:'<script>alert(1)</script>'});
 assert.doesNotMatch(h,/<script>/);
 assert.match(h,/&lt;script&gt;/);
});
test('charts are wired to the application render',async()=>{
 const fs=await import('node:fs/promises');
 const main=await fs.readFile(new URL('../js/main.js',import.meta.url),'utf8');
 assert.match(main,/visuals.innerHTML=renderVisualizations\(t,s\)/);
 assert.match(main,/findings.innerHTML=renderFindings\(t,s/);
});
