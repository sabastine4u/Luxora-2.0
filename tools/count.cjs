const fs = require('fs');
let c = fs.readFileSync('src/data/luxoraData.ts', 'utf8');
const pStart = c.indexOf('export const properties: Property[] = [');
const pEnd = c.indexOf('];', pStart) + 2;
const pStr = c.substring(pStart, pEnd);

const count = (pStr.match(/"id"\s*:\s*"p\d+"/g) || pStr.match(/id:\s*['"]p\d+['"]/g) || []).length;
console.log('Total:', count);

const types = ['Apartment', 'Duplex', 'Studio', 'Mini Flat', 'Self Contain', 'Short Let', 'Student Housing', 'Affordable Rental', 'Family House', 'Land', 'Warehouse', 'Office Space'];
types.forEach(t => {
  const tCount = (pStr.match(new RegExp('"type"\\s*:\\s*"' + t + '"', 'g')) || pStr.match(new RegExp('type:\\s*\\\'' + t + '\\\'', 'g')) || []).length;
  console.log(t + ':', tCount);
});

const buyCount = (pStr.match(/"transactionType"\s*:\s*"buy"/g) || pStr.match(/transactionType:\s*'buy'/g) || []).length;
const rentCount = (pStr.match(/"transactionType"\s*:\s*"rent"/g) || pStr.match(/transactionType:\s*'rent'/g) || []).length;
const leaseCount = (pStr.match(/"transactionType"\s*:\s*"lease"/g) || pStr.match(/transactionType:\s*'lease'/g) || []).length;
console.log('Buy:', buyCount);
console.log('Rent:', rentCount);
console.log('Lease:', leaseCount);
