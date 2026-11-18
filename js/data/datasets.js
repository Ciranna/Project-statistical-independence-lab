export const datasets = {
  study: {
    title: 'Study method vs. exam outcome',
    x: 'Study method', y: 'Exam outcome',
    records: [
      ...Array.from({length:40}, () => ({x:'Individual',y:'Pass'})),
      ...Array.from({length:10}, () => ({x:'Individual',y:'Fail'})),
      ...Array.from({length:30}, () => ({x:'Group',y:'Pass'})),
      ...Array.from({length:20}, () => ({x:'Group',y:'Fail'})),
    ],
  },
  independent: {
    title: 'Balanced illustrative dataset',
    x: 'Category X', y: 'Category F',
    records: ['A','B'].flatMap(x => ['Yes','No'].flatMap(y => Array.from({length:25},()=>({x,y})))),
  },
  strong: {
    title: 'Strong association example',
    x: 'Category X', y: 'Category F',
    records: [
      ...Array.from({length:45},()=>({x:'A',y:'Yes'})),
      ...Array.from({length:5},()=>({x:'A',y:'No'})),
      ...Array.from({length:5},()=>({x:'B',y:'Yes'})),
      ...Array.from({length:45},()=>({x:'B',y:'No'})),
    ],
  }
};
