const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  'Apartment', 'Duplex', 'Studio', 'Mini Flat', 'Self Contain', 'Short Let', 
  'Student Housing', 'Affordable Rental', 'Family House', 'Land', 'Warehouse', 'Office Space'
];

const NIGERIAN_CITIES = [
  'Ikoyi, Lagos', 'Victoria Island, Lagos', 'Lekki Phase 1, Lagos', 'Chevron, Lagos', 'Ajah, Lagos',
  'Yaba, Lagos', 'Surulere, Lagos', 'Ikeja, Lagos', 'Gbagada, Lagos', 'Ogba, Lagos',
  'Maitama, Abuja', 'Asokoro, Abuja', 'Wuse, Abuja', 'Gwarinpa, Abuja', 'Lugbe, Abuja', 'Lokogoma, Abuja',
  'GRA Phase 2, Port Harcourt', 'Independence Layout, Enugu', 'Bodija, Ibadan', 'GRA, Benin City'
];

const GENERATORS = {
  'Apartment': { tType: ['buy', 'rent'], priceR: [100000000, 300000000], rentR: [3000000, 15000000], beds: [2, 4] },
  'Duplex': { tType: ['buy', 'rent'], priceR: [150000000, 500000000], rentR: [5000000, 20000000], beds: [3, 6] },
  'Studio': { tType: ['rent', 'buy'], priceR: [20000000, 50000000], rentR: [800000, 2000000], beds: [1, 1] },
  'Mini Flat': { tType: ['rent'], priceR: [15000000, 30000000], rentR: [500000, 1500000], beds: [1, 1] },
  'Self Contain': { tType: ['rent'], priceR: [5000000, 15000000], rentR: [250000, 800000], beds: [1, 1] },
  'Short Let': { tType: ['rent'], priceR: [0, 0], rentR: [1000000, 5000000], beds: [1, 4] },
  'Student Housing': { tType: ['rent'], priceR: [0, 0], rentR: [250000, 900000], beds: [1, 2] },
  'Affordable Rental': { tType: ['rent'], priceR: [0, 0], rentR: [500000, 3000000], beds: [1, 3] },
  'Family House': { tType: ['buy', 'rent'], priceR: [80000000, 200000000], rentR: [3000000, 8000000], beds: [3, 5] },
  'Land': { tType: ['buy', 'lease'], priceR: [50000000, 500000000], rentR: [2000000, 10000000], beds: [0, 0] },
  'Warehouse': { tType: ['buy', 'lease'], priceR: [100000000, 800000000], rentR: [10000000, 50000000], beds: [0, 0] },
  'Office Space': { tType: ['rent', 'lease'], priceR: [0, 0], rentR: [5000000, 25000000], beds: [0, 0] }
};

const formatPrice = (val) => {
  if (val >= 1000000000) return "₦" + (val / 1000000000).toFixed(1) + "B";
  if (val >= 1000000) return "₦" + (val / 1000000).toFixed(1) + "M";
  return "₦" + (val / 1000).toFixed(0) + "k";
};

const formatPriceLong = (val) => {
  return "₦" + val.toLocaleString();
};

const IMAGES = [
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
];

const AGENTS = [
  { name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true },
  { name: 'Tunde Bakare', agency: 'Crest & Crown', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true },
  { name: 'Ngozi Eze', agency: 'Atlas Realty', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true },
  { name: 'Emeka Uche', agency: 'Sterling Homes', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true },
  { name: 'Chioma Adeyemi', agency: 'Meridian Luxury', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200', verified: true },
  { name: 'Kunle Sanusi', agency: 'Atlas Realty', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200', verified: false }
];

let propId = 7;
const generatedProperties = [];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const existingProps = [
  {
    id: 'p1',
    transactionType: 'buy',
    title: 'Skyline Penthouse Residence',
    location: 'Eko Atlantic, Lagos',
    price: '₦420,000,000',
    priceValue: 420000000,
    monthly: '₦2.9M',
    type: 'Penthouse',
    beds: 5,
    baths: 6,
    area: '640 m²',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium'],
    agent: { name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', id: 'a1', phone: '+234 800 111 2222', email: 'adaeze@meridian.lux', verified: true },
    tag: 'Featured',
    gallery: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    amenities: ['Private Pool', 'Helipad Access', '24/7 Concierge', 'Smart Home Integration', 'Private Elevator'],
    features: ['Ocean View', 'Double Height Ceilings', 'Wine Cellar', 'Staff Quarters'],
    nearbyPlaces: [{ title: 'Eko Atlantic Marina', distance: '0.2 km' }],
    paymentSnapshot: { deposit: '₦126,000,000', legalFee: '₦21,000,000', serviceCharge: '₦5,000,000/yr', agencyFee: '₦21,000,000', pricePerSqm: '₦656,250' },
    documents: [{ title: 'C of O', verified: true }],
    walkScore: 92, transitScore: 85, schoolScore: 88, parkingSpaces: 4, yearBuilt: 2023, floorPlans: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'p2',
    transactionType: 'buy',
    title: 'Garden Court Villa',
    location: 'Banana Island, Lagos',
    price: '₦680,000,000',
    priceValue: 680000000,
    monthly: '₦4.7M',
    type: 'Villa',
    beds: 7,
    baths: 8,
    area: '920 m²',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium', 'Agent'],
    agent: { name: 'Tunde Bakare', agency: 'Crest & Crown', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', id: 'a2', phone: '+234 800 333 4444', email: 'tunde@crestcrown.com', verified: true },
    tag: 'Premium Verified',
    gallery: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    amenities: ['Lush Garden', 'Infinity Pool', 'Home Theater', 'Gymnasium', 'Backup Power'],
    features: ['Waterfront', 'Bulletproof Doors', 'Gourmet Kitchen'],
    nearbyPlaces: [{ title: 'Banana Island Club', distance: '1.2 km' }],
    paymentSnapshot: { deposit: '₦204,000,000', legalFee: '₦34,000,000', serviceCharge: '₦8,000,000/yr', agencyFee: '₦34,000,000', pricePerSqm: '₦739,130' },
    walkScore: 60, transitScore: 40, parkingSpaces: 6, yearBuilt: 2021
  },
  {
    id: 'p3',
    transactionType: 'buy',
    title: 'Marina View Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '₦185,000,000',
    priceValue: 185000000,
    monthly: '₦1.3M',
    type: 'Apartment',
    beds: 3,
    baths: 4,
    area: '210 m²',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection'],
    agent: { name: 'Ngozi Eze', agency: 'Atlas Realty', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', id: 'a3', phone: '+234 800 555 6666', email: 'ngozi@atlasrealty.ng', verified: true },
    gallery: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    amenities: ['Shared Pool', '24/7 Security', 'Elevator', 'Fitted Kitchen'],
    paymentSnapshot: { deposit: '₦55,500,000', legalFee: '₦9,250,000', serviceCharge: '₦1,500,000/yr', agencyFee: '₦9,250,000', pricePerSqm: '₦880,952' },
    walkScore: 85, transitScore: 70, schoolScore: 80, parkingSpaces: 2, yearBuilt: 2019
  },
  {
    id: 'p4',
    transactionType: 'buy',
    title: 'Contemporary Duplex',
    location: 'Chevron, Lagos',
    price: '₦320,000,000',
    priceValue: 320000000,
    monthly: '₦2.1M',
    type: 'Duplex',
    beds: 4,
    baths: 5,
    area: '450 m²',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Agent'],
    agent: { name: 'Emeka Uche', agency: 'Sterling Homes', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200' },
    tag: 'New Build',
  },
  {
    id: 'p5',
    transactionType: 'rent',
    title: 'Cozy Mini Flat',
    location: 'Surulere, Lagos',
    price: '₦4,500,000/yr',
    priceValue: 4500000,
    monthly: '₦350,000',
    type: 'Mini Flat',
    beds: 1,
    baths: 1,
    area: '45 m²',
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Agent'],
    agent: { name: 'Chioma Adeyemi', agency: 'Meridian Luxury', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200' },
  },
  {
    id: 'p6',
    transactionType: 'buy',
    title: 'Executive Studio Apartment',
    location: 'Yaba, Lagos',
    price: '₦62,000,000',
    priceValue: 62000000,
    monthly: '₦450,000',
    type: 'Studio',
    beds: 1,
    baths: 1,
    area: '65 m²',
    image: 'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Agent'],
    agent: { name: 'Kunle Sanusi', agency: 'Atlas Realty', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200' },
    tag: 'Investor Pick',
  }
];

const propertiesCounts = {
  'Penthouse': 1,
  'Villa': 1,
  'Apartment': 1,
  'Duplex': 1,
  'Mini Flat': 1,
  'Studio': 1
};

CATEGORIES.forEach(cat => {
  if (!propertiesCounts[cat]) propertiesCounts[cat] = 0;
  const needed = 5 - propertiesCounts[cat];
  for (let i=0; i < (needed > 0 ? needed : 5); i++) {
    const gen = GENERATORS[cat] || GENERATORS['Apartment'];
    const tType = rand(gen.tType);
    
    let priceValue, price, monthly;
    if (tType === 'buy') {
      priceValue = randRange(gen.priceR[0], gen.priceR[1]);
      price = formatPriceLong(priceValue);
      monthly = formatPrice(priceValue / 120);
    } else {
      priceValue = randRange(gen.rentR[0], gen.rentR[1]);
      price = formatPriceLong(priceValue) + '/yr';
      monthly = formatPrice(priceValue / 12);
    }
    
    const beds = gen.beds[0] === 0 ? 0 : randRange(gen.beds[0], gen.beds[1]);
    const baths = beds > 0 ? beds + randRange(0, 1) : 0;
    
    const loc = rand(NIGERIAN_CITIES);
    const agent = rand(AGENTS);
    const image = rand(IMAGES);
    
    const prop = {
      id: "p" + propId++,
      transactionType: tType,
      title: "Premium " + cat + " in " + loc.split(',')[0],
      location: loc,
      price,
      priceValue,
      monthly,
      type: cat,
      beds,
      baths,
      area: randRange(50, 800) + " m²",
      image,
      verified: ['Documents', 'Inspection'],
      agent,
      tag: Math.random() > 0.7 ? 'Featured' : undefined,
      gallery: [image, rand(IMAGES)],
      amenities: ['24/7 Security', 'Backup Power', 'Parking Space', 'Treated Water'],
      walkScore: randRange(60, 95),
      yearBuilt: randRange(2010, 2024)
    };
    generatedProperties.push(prop);
  }
});

const allProps = [...existingProps, ...generatedProperties];
const generatedPropsString = allProps.map(p => JSON.stringify(p, null, 2)).join(',\n');
const finalPropsArrayString = "export const properties: Property[] = [\n" + generatedPropsString + "\n];";

const dataFilePath = path.join(__dirname, 'src', 'data', 'luxoraData.ts');
let fileContent = fs.readFileSync(dataFilePath, 'utf8');

const startMarker = 'export const properties: Property[] = [';
const startIndex = fileContent.indexOf(startMarker);
if (startIndex !== -1) {
  const endMarker = 'export type Category = {';
  const endIndexRaw = fileContent.indexOf(endMarker);
  const stringBeforeEnd = fileContent.substring(startIndex, endIndexRaw);
  const closingBracketIndex = stringBeforeEnd.lastIndexOf('];');
  
  if (closingBracketIndex !== -1) {
    const finalEndIndex = startIndex + closingBracketIndex + 2;
    fileContent = fileContent.substring(0, startIndex) + finalPropsArrayString + '\n\n' + fileContent.substring(finalEndIndex);
    fs.writeFileSync(dataFilePath, fileContent);
    console.log('Successfully injected properties.');
  } else {
    console.log('Could not find closing bracket');
  }
} else {
  console.log('Could not find start marker');
}
