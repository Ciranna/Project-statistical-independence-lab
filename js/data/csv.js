export function parseBivariateCSV(text) {
 if (typeof text !== 'string' || !text.trim()) throw new Error('CSV file is empty.');
 const rows=[]; let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"' && text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}
  else if(c==='"'){if(field.length)throw new Error('Invalid quote in CSV.');quoted=true;}
  else if(c===','){row.push(field);field='';}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);field='';if(row.some(x=>x.trim()))rows.push(row);row=[];}
  else field+=c;
 }
 if(quoted)throw new Error('Unclosed CSV quote.');
 row.push(field);if(row.some(x=>x.trim()))rows.push(row);
 if(rows.length<2)throw new Error('CSV needs a header and at least one data row.');
 if(rows[0].length!==2)throw new Error('CSV must contain exactly two columns.');
 const headers=rows[0].map(x=>x.trim().replace(/^\uFEFF/,''));
 if(headers.some(x=>!x))throw new Error('Both column headers are required.');
 const records=rows.slice(1).map((r,i)=>{if(r.length!==2||r.some(x=>!x.trim()))throw new Error(`Invalid or missing category on data row ${i+2}.`);return {x:r[0].trim(),y:r[1].trim()};});
 if(records.length>100000)throw new Error('Maximum 100,000 records.');
 return {headers,records};
}
