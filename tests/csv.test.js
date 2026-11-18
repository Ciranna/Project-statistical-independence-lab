import test from 'node:test';import assert from 'node:assert/strict';import {parseBivariateCSV} from '../js/data/csv.js';import {contingency} from '../js/statistics/contingency.js';import {chiSquareTest} from '../js/statistics/chiSquare.js';import {renderVisualizations} from '../js/charts/visualizations.js';
test('CSV parses categorical observations',()=>{const d=parseBivariateCSV('X,Y\na,b\na,c\nd,b');assert.equal(d.records.length,3);assert.deepEqual(d.headers,['X','Y']);});
test('quoted comma and escaped quote',()=>{const d=parseBivariateCSV('X,Y\n"A,B","C""D"');assert.deepEqual(d.records,[{x:'A,B',y:'C"D'}]);});
test('reject incomplete CSV row',()=>assert.throws(()=>parseBivariateCSV('X,Y\na,'),/missing/));
test('reject extra columns',()=>assert.throws(()=>parseBivariateCSV('X,Y\na,b,c'),/Invalid/));
test('reject malformed quotes',()=>assert.throws(()=>parseBivariateCSV('X,Y\n"abc,b'),/Unclosed/));
test('custom data feeds statistical engine',()=>{const d=parseBivariateCSV('X,Y\na,c\na,d\nb,c\nb,d');const t=contingency(d.records),s=chiSquareTest(t);assert.equal(s.statistic,0);});
test('charts display observed expected and contributions',()=>{const t=contingency([{x:'a',y:'c'},{x:'a',y:'d'},{x:'b',y:'c'},{x:'b',y:'d'}]);const html=renderVisualizations(t,chiSquareTest(t));assert.match(html,/Observed vs. expected/);assert.match(html,/Chi-square contributions/);});
test('chart escapes user-supplied category names',()=>{const t=contingency([{x:'<img>',y:'a'},{x:'<img>',y:'b'},{x:'other',y:'a'},{x:'other',y:'b'}]);const html=renderVisualizations(t,chiSquareTest(t));assert.doesNotMatch(html,/<img>/);});
