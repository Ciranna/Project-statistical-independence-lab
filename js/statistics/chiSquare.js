// Pearson chi-square test of independence for a contingency result.
// Upper regularized incomplete gamma Q(df/2, chi2/2) gives the p-value.
const LANCZOS=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
function logGamma(z){
 if(z<0.5) return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);
 z-=1;let x=LANCZOS[0];for(let i=1;i<LANCZOS.length;i++)x+=LANCZOS[i]/(z+i);
 const t=z+7.5;return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x);
}
export function regularizedGammaQ(a,x){
 if(!(a>0)||!(x>=0)||!Number.isFinite(a)||!Number.isFinite(x))throw new Error('Invalid gamma arguments.');
 if(x===0)return 1;
 const factor=Math.exp(-x+a*Math.log(x)-logGamma(a));
 if(x<a+1){let sum=1/a,delta=sum,ap=a;for(let i=1;i<=10000;i++){ap++;delta*=x/ap;sum+=delta;if(Math.abs(delta)<Math.abs(sum)*1e-14)break;}return Math.max(0,Math.min(1,1-sum*factor));}
 let b=x+1-a,c=1e300,d=1/(Math.abs(b)<1e-300?1e-300:b),h=d;
 for(let i=1;i<=10000;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<1e-14)break;}
 return Math.max(0,Math.min(1,factor*h));
}
export function chiSquareTest(table,{alpha=0.05}={}){
 if(!Number.isFinite(alpha)||alpha<=0||alpha>=1)throw new Error('Alpha must be between 0 and 1.');
 const {counts,rowTotals,colTotals,n}=table;
 if(!Array.isArray(counts)||!Array.isArray(rowTotals)||!Array.isArray(colTotals)||!Number.isFinite(n)||n<=0)throw new Error('Invalid contingency table.');
 const r=rowTotals.length,c=colTotals.length;
 if(r<2||c<2)throw new Error('Chi-square independence test requires at least two categories per variable.');
 const expected=rowTotals.map(rt=>colTotals.map(ct=>rt*ct/n));
 if(expected.some(row=>row.some(e=>e<=0)))throw new Error('Expected frequencies must be positive.');
 const contributions=counts.map((row,i)=>row.map((o,j)=>(o-expected[i][j])**2/expected[i][j]));
 const statistic=contributions.flat().reduce((a,b)=>a+b,0);
 const degreesOfFreedom=(r-1)*(c-1);
 const pValue=regularizedGammaQ(degreesOfFreedom/2,statistic/2);
 const cramerV=Math.sqrt(statistic/(n*Math.min(r-1,c-1)));
 const below5=expected.flat().filter(e=>e<5).length;
 const minExpected=Math.min(...expected.flat());
 const asymptoticWarning=below5>0?'Some expected counts are below 5; the chi-square approximation may be unreliable. Consider combining substantively justified categories or an exact/Monte Carlo test.':null;
 return {expected,contributions,statistic,degreesOfFreedom,pValue,cramerV,alpha,rejectNull:pValue<alpha,minExpected,below5,asymptoticWarning};
}
