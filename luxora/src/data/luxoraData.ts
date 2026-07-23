/* Centralized mock data for Luxora 2.0 */
import { ROLES } from '../constants/roles';

import type { Property, PropertyType } from '../types';

export const properties: Property[] = [
  {
    "id": "p1",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p1",
    "agentId": "agent_p1",
    "agencyId": "agency_p1",
    "origin": "agent",
    "createdBy": "agent_p1",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Skyline Penthouse Residence",
    "location": "Eko Atlantic, Lagos",
    "price": "₦420,000,000",
    "priceValue": 420000000,
    "monthly": "₦2.9M",
    "type": "Penthouse",
    "beds": 5,
    "baths": 6,
    "area": "640 m²",
    "image": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection",
      "Premium"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "id": "a1",
      "phone": "+234 800 111 2222",
      "email": "adaeze@meridian.lux",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "Private Pool",
      "Helipad Access",
      "24/7 Concierge",
      "Smart Home Integration",
      "Private Elevator"
    ],
    "features": [
      "Ocean View",
      "Double Height Ceilings",
      "Wine Cellar",
      "Staff Quarters"
    ],
    "nearbyPlaces": [
      {
        "title": "Eko Atlantic Marina",
        "distance": "0.2 km"
      }
    ],
    "paymentSnapshot": {
      "deposit": "₦126,000,000",
      "legalFee": "₦21,000,000",
      "serviceCharge": "₦5,000,000/yr",
      "agencyFee": "₦21,000,000",
      "pricePerSqm": "₦656,250"
    },
    "documents": [
      {
        "title": "C of O",
        "verified": true
      }
    ],
    "walkScore": 92,
    "transitScore": 85,
    "schoolScore": 88,
    "parkingSpaces": 4,
    "yearBuilt": 2023,
    "floorPlans": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "city": "Eko Atlantic",
    "state": "Lagos",
    "coordinates": { "lat": 6.408, "lng": 3.407 },
    "status": "Available",
    "mortgageSupport": true,
    "featuredLevel": "Premium",
    "videoUrl": "https://www.youtube.com/embed/LXb3EKWsInQ",
    "brochureUrl": "#",
    "furnishing": "Fully Furnished"
  },
  {
    "id": "p2",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p2",
    "agentId": "agent_p2",
    "agencyId": "agency_p2",
    "origin": "agent",
    "createdBy": "agent_p2",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Garden Court Villa",
    "location": "Banana Island, Lagos",
    "price": "₦680,000,000",
    "priceValue": 680000000,
    "monthly": "₦4.7M",
    "type": "Villa",
    "beds": 7,
    "baths": 8,
    "area": "920 m²",
    "image": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection",
      "Premium",
      "Agent"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "id": "a2",
      "phone": "+234 800 333 4444",
      "email": "tunde@crestcrown.com",
      "verified": true
    },
    "tag": "Premium Verified",
    "gallery": [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "Lush Garden",
      "Infinity Pool",
      "Home Theater",
      "Gymnasium",
      "Backup Power"
    ],
    "features": [
      "Waterfront",
      "Bulletproof Doors",
      "Gourmet Kitchen"
    ],
    "nearbyPlaces": [
      {
        "title": "Banana Island Club",
        "distance": "1.2 km"
      }
    ],
    "paymentSnapshot": {
      "deposit": "₦204,000,000",
      "legalFee": "₦34,000,000",
      "serviceCharge": "₦8,000,000/yr",
      "agencyFee": "₦34,000,000",
      "pricePerSqm": "₦739,130"
    },
    "walkScore": 60,
    "transitScore": 40,
    "parkingSpaces": 6,
    "yearBuilt": 2021,
    "city": "Banana Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4624, "lng": 3.4542 }
  },
  {
    "id": "p3",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p3",
    "agentId": "agent_p3",
    "agencyId": "agency_p3",
    "origin": "agent",
    "createdBy": "agent_p3",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Marina View Apartment",
    "location": "Lekki Phase 1, Lagos",
    "price": "₦185,000,000",
    "priceValue": 185000000,
    "monthly": "₦1.3M",
    "type": "Apartment",
    "beds": 3,
    "baths": 4,
    "area": "210 m²",
    "image": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "id": "a3",
      "phone": "+234 800 555 6666",
      "email": "ngozi@atlasrealty.ng",
      "verified": true
    },
    "gallery": [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "Shared Pool",
      "24/7 Security",
      "Elevator",
      "Fitted Kitchen"
    ],
    "paymentSnapshot": {
      "deposit": "₦55,500,000",
      "legalFee": "₦9,250,000",
      "serviceCharge": "₦1,500,000/yr",
      "agencyFee": "₦9,250,000",
      "pricePerSqm": "₦880,952"
    },
    "walkScore": 85,
    "transitScore": 70,
    "schoolScore": 80,
    "parkingSpaces": 2,
    "yearBuilt": 2019,
    "city": "Lekki",
    "state": "Lagos",
    "coordinates": { "lat": 6.4698, "lng": 3.5852 }
  },
  {
    "id": "p4",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p4",
    "agentId": "agent_p4",
    "agencyId": "agency_p4",
    "origin": "agent",
    "createdBy": "agent_p4",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Contemporary Duplex",
    "location": "Chevron, Lagos",
    "price": "₦320,000,000",
    "priceValue": 320000000,
    "monthly": "₦2.1M",
    "type": "Duplex",
    "beds": 4,
    "baths": 5,
    "area": "450 m²",
    "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Agent"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    "tag": "New Build",
    "city": "Chevron",
    "state": "Lagos"
  },
  {
    "id": "p5",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p5",
    "agentId": "agent_p5",
    "agencyId": "agency_p5",
    "origin": "agent",
    "createdBy": "agent_p5",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Cozy Mini Flat",
    "location": "Surulere, Lagos",
    "price": "₦4,500,000/yr",
    "priceValue": 4500000,
    "monthly": "₦350,000",
    "type": "Mini Flat",
    "beds": 1,
    "baths": 1,
    "area": "45 m²",
    "image": "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Agent"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    "city": "Surulere",
    "state": "Lagos"
  },
  {
    "id": "p6",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p6",
    "agentId": "agent_p6",
    "agencyId": "agency_p6",
    "origin": "agent",
    "createdBy": "agent_p6",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Executive Studio Apartment",
    "location": "Yaba, Lagos",
    "price": "₦62,000,000",
    "priceValue": 62000000,
    "monthly": "₦450,000",
    "type": "Studio",
    "beds": 1,
    "baths": 1,
    "area": "65 m²",
    "image": "https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Agent"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200"
    },
    "tag": "Investor Pick",
    "city": "Yaba",
    "state": "Lagos"
  },
  {
    "id": "p7",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p7",
    "agentId": "agent_p7",
    "agencyId": "agency_p7",
    "origin": "agent",
    "createdBy": "agent_p7",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Apartment in Lugbe",
    "location": "Lugbe, Abuja",
    "price": "₦102,453,889",
    "priceValue": 102453889,
    "monthly": "₦854k",
    "type": "Apartment",
    "beds": 2,
    "baths": 3,
    "area": "260 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 83,
    "yearBuilt": 2010,
    "city": "Lugbe",
    "state": "Abuja"
  },
  {
    "id": "p8",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p8",
    "agentId": "agent_p8",
    "agencyId": "agency_p8",
    "origin": "agent",
    "createdBy": "agent_p8",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Apartment in Bodija",
    "location": "Bodija, Ibadan",
    "price": "₦213,238,498",
    "priceValue": 213238498,
    "monthly": "₦1.8M",
    "type": "Apartment",
    "beds": 4,
    "baths": 5,
    "area": "207 m²",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 80,
    "yearBuilt": 2015,
    "city": "Bodija",
    "state": "Ibadan"
  },
  {
    "id": "p9",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p9",
    "agentId": "agent_p9",
    "agencyId": "agency_p9",
    "origin": "agent",
    "createdBy": "agent_p9",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Apartment in Surulere",
    "location": "Surulere, Lagos",
    "price": "₦4,888,922/yr",
    "priceValue": 4888922,
    "monthly": "₦407k",
    "type": "Apartment",
    "beds": 3,
    "baths": 3,
    "area": "138 m²",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 71,
    "yearBuilt": 2021,
    "city": "Surulere",
    "state": "Lagos"
  },
  {
    "id": "p10",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p10",
    "agentId": "agent_p10",
    "agencyId": "agency_p10",
    "origin": "agent",
    "createdBy": "agent_p10",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Apartment in Surulere",
    "location": "Surulere, Lagos",
    "price": "₦267,087,198",
    "priceValue": 267087198,
    "monthly": "₦2.2M",
    "type": "Apartment",
    "beds": 2,
    "baths": 3,
    "area": "494 m²",
    "image": "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 63,
    "yearBuilt": 2016,
    "city": "Surulere",
    "state": "Lagos"
  },
  {
    "id": "p11",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p11",
    "agentId": "agent_p11",
    "agencyId": "agency_p11",
    "origin": "agent",
    "createdBy": "agent_p11",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Duplex in Ajah",
    "location": "Ajah, Lagos",
    "price": "₦16,289,431/yr",
    "priceValue": 16289431,
    "monthly": "₦1.4M",
    "type": "Duplex",
    "beds": 5,
    "baths": 5,
    "area": "653 m²",
    "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 65,
    "yearBuilt": 2018,
    "city": "Ajah",
    "state": "Lagos"
  },
  {
    "id": "p12",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p12",
    "agentId": "agent_p12",
    "agencyId": "agency_p12",
    "origin": "agent",
    "createdBy": "agent_p12",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Duplex in Ikoyi",
    "location": "Ikoyi, Lagos",
    "price": "₦10,054,339/yr",
    "priceValue": 10054339,
    "monthly": "₦838k",
    "type": "Duplex",
    "beds": 3,
    "baths": 3,
    "area": "649 m²",
    "image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 89,
    "yearBuilt": 2021,
    "city": "Ikoyi",
    "state": "Lagos",
    "coordinates": { "lat": 6.4531, "lng": 3.4346 }
  },
  {
    "id": "p13",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p13",
    "agentId": "agent_p13",
    "agencyId": "agency_p13",
    "origin": "agent",
    "createdBy": "agent_p13",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Duplex in Ogba",
    "location": "Ogba, Lagos",
    "price": "₦387,937,319",
    "priceValue": 387937319,
    "monthly": "₦3.2M",
    "type": "Duplex",
    "beds": 3,
    "baths": 4,
    "area": "90 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 65,
    "yearBuilt": 2021,
    "city": "Ogba",
    "state": "Lagos"
  },
  {
    "id": "p14",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p14",
    "agentId": "agent_p14",
    "agencyId": "agency_p14",
    "origin": "agent",
    "createdBy": "agent_p14",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Duplex in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦377,348,755",
    "priceValue": 377348755,
    "monthly": "₦3.1M",
    "type": "Duplex",
    "beds": 6,
    "baths": 7,
    "area": "203 m²",
    "image": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "tag": "Featured",
    "gallery": [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 91,
    "yearBuilt": 2010,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p15",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p15",
    "agentId": "agent_p15",
    "agencyId": "agency_p15",
    "origin": "agent",
    "createdBy": "agent_p15",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Studio in Bodija",
    "location": "Bodija, Ibadan",
    "price": "₦24,261,940",
    "priceValue": 24261940,
    "monthly": "₦202k",
    "type": "Studio",
    "beds": 1,
    "baths": 2,
    "area": "117 m²",
    "image": "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 91,
    "yearBuilt": 2022,
    "city": "Bodija",
    "state": "Ibadan"
  },
  {
    "id": "p16",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p16",
    "agentId": "agent_p16",
    "agencyId": "agency_p16",
    "origin": "agent",
    "createdBy": "agent_p16",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Studio in Ikeja",
    "location": "Ikeja, Lagos",
    "price": "₦20,905,081",
    "priceValue": 20905081,
    "monthly": "₦174k",
    "type": "Studio",
    "beds": 1,
    "baths": 2,
    "area": "562 m²",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 68,
    "yearBuilt": 2015,
    "city": "Ikeja",
    "state": "Lagos"
  },
  {
    "id": "p17",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p17",
    "agentId": "agent_p17",
    "agencyId": "agency_p17",
    "origin": "agent",
    "createdBy": "agent_p17",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Studio in GRA",
    "location": "GRA, Benin City",
    "price": "₦1,232,804/yr",
    "priceValue": 1232804,
    "monthly": "₦103k",
    "type": "Studio",
    "beds": 1,
    "baths": 2,
    "area": "625 m²",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 89,
    "yearBuilt": 2016,
    "city": "GRA",
    "state": "Benin City"
  },
  {
    "id": "p18",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p18",
    "agentId": "agent_p18",
    "agencyId": "agency_p18",
    "origin": "agent",
    "createdBy": "agent_p18",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Studio in Chevron",
    "location": "Chevron, Lagos",
    "price": "₦1,122,659/yr",
    "priceValue": 1122659,
    "monthly": "₦94k",
    "type": "Studio",
    "beds": 1,
    "baths": 1,
    "area": "533 m²",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 78,
    "yearBuilt": 2016,
    "city": "Chevron",
    "state": "Lagos"
  },
  {
    "id": "p19",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p19",
    "agentId": "agent_p19",
    "agencyId": "agency_p19",
    "origin": "agent",
    "createdBy": "agent_p19",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Mini Flat in Ajah",
    "location": "Ajah, Lagos",
    "price": "₦1,240,946/yr",
    "priceValue": 1240946,
    "monthly": "₦103k",
    "type": "Mini Flat",
    "beds": 1,
    "baths": 2,
    "area": "571 m²",
    "image": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 88,
    "yearBuilt": 2017,
    "city": "Ajah",
    "state": "Lagos"
  },
  {
    "id": "p20",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p20",
    "agentId": "agent_p20",
    "agencyId": "agency_p20",
    "origin": "agent",
    "createdBy": "agent_p20",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Mini Flat in Surulere",
    "location": "Surulere, Lagos",
    "price": "₦780,448/yr",
    "priceValue": 780448,
    "monthly": "₦65k",
    "type": "Mini Flat",
    "beds": 1,
    "baths": 1,
    "area": "277 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 71,
    "yearBuilt": 2012,
    "city": "Surulere",
    "state": "Lagos"
  },
  {
    "id": "p21",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p21",
    "agentId": "agent_p21",
    "agencyId": "agency_p21",
    "origin": "agent",
    "createdBy": "agent_p21",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Mini Flat in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦840,709/yr",
    "priceValue": 840709,
    "monthly": "₦70k",
    "type": "Mini Flat",
    "beds": 1,
    "baths": 1,
    "area": "573 m²",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 84,
    "yearBuilt": 2012,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p22",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p22",
    "agentId": "agent_p22",
    "agencyId": "agency_p22",
    "origin": "agent",
    "createdBy": "agent_p22",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Mini Flat in Bodija",
    "location": "Bodija, Ibadan",
    "price": "₦1,495,143/yr",
    "priceValue": 1495143,
    "monthly": "₦125k",
    "type": "Mini Flat",
    "beds": 1,
    "baths": 2,
    "area": "671 m²",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 94,
    "yearBuilt": 2022,
    "city": "Bodija",
    "state": "Ibadan"
  },
  {
    "id": "p23",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p23",
    "agentId": "agent_p23",
    "agencyId": "agency_p23",
    "origin": "agent",
    "createdBy": "agent_p23",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Self Contain in Surulere",
    "location": "Surulere, Lagos",
    "price": "₦391,900/yr",
    "priceValue": 391900,
    "monthly": "₦33k",
    "type": "Self Contain",
    "beds": 1,
    "baths": 1,
    "area": "211 m²",
    "image": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 75,
    "yearBuilt": 2024,
    "city": "Surulere",
    "state": "Lagos"
  },
  {
    "id": "p24",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p24",
    "agentId": "agent_p24",
    "agencyId": "agency_p24",
    "origin": "agent",
    "createdBy": "agent_p24",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Self Contain in GRA Phase 2",
    "location": "GRA Phase 2, Port Harcourt",
    "price": "₦605,377/yr",
    "priceValue": 605377,
    "monthly": "₦50k",
    "type": "Self Contain",
    "beds": 1,
    "baths": 2,
    "area": "361 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 70,
    "yearBuilt": 2024,
    "city": "GRA",
    "state": "Port Harcourt"
  },
  {
    "id": "p25",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p25",
    "agentId": "agent_p25",
    "agencyId": "agency_p25",
    "origin": "agent",
    "createdBy": "agent_p25",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Self Contain in Independence Layout",
    "location": "Independence Layout, Enugu",
    "price": "₦391,686/yr",
    "priceValue": 391686,
    "monthly": "₦33k",
    "type": "Self Contain",
    "beds": 1,
    "baths": 2,
    "area": "306 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 60,
    "yearBuilt": 2024,
    "city": "Independence Layout",
    "state": "Enugu"
  },
  {
    "id": "p26",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p26",
    "agentId": "agent_p26",
    "agencyId": "agency_p26",
    "origin": "agent",
    "createdBy": "agent_p26",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Self Contain in Ogba",
    "location": "Ogba, Lagos",
    "price": "₦725,538/yr",
    "priceValue": 725538,
    "monthly": "₦60k",
    "type": "Self Contain",
    "beds": 1,
    "baths": 1,
    "area": "362 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 71,
    "yearBuilt": 2020,
    "city": "Ogba",
    "state": "Lagos"
  },
  {
    "id": "p27",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p27",
    "agentId": "agent_p27",
    "agencyId": "agency_p27",
    "origin": "agent",
    "createdBy": "agent_p27",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Self Contain in GRA Phase 2",
    "location": "GRA Phase 2, Port Harcourt",
    "price": "₦414,578/yr",
    "priceValue": 414578,
    "monthly": "₦35k",
    "type": "Self Contain",
    "beds": 1,
    "baths": 2,
    "area": "423 m²",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 61,
    "yearBuilt": 2014,
    "city": "GRA",
    "state": "Port Harcourt"
  },
  {
    "id": "p28",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p28",
    "agentId": "agent_p28",
    "agencyId": "agency_p28",
    "origin": "agent",
    "createdBy": "agent_p28",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Short Let in Ikeja",
    "location": "Ikeja, Lagos",
    "price": "₦4,151,542/yr",
    "priceValue": 4151542,
    "monthly": "₦346k",
    "type": "Short Let",
    "beds": 2,
    "baths": 3,
    "area": "107 m²",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 65,
    "yearBuilt": 2011,
    "city": "Ikeja",
    "state": "Lagos"
  },
  {
    "id": "p29",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p29",
    "agentId": "agent_p29",
    "agencyId": "agency_p29",
    "origin": "agent",
    "createdBy": "agent_p29",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Short Let in GRA Phase 2",
    "location": "GRA Phase 2, Port Harcourt",
    "price": "₦1,525,702/yr",
    "priceValue": 1525702,
    "monthly": "₦127k",
    "type": "Short Let",
    "beds": 1,
    "baths": 2,
    "area": "147 m²",
    "image": "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 84,
    "yearBuilt": 2016,
    "city": "GRA",
    "state": "Port Harcourt"
  },
  {
    "id": "p30",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p30",
    "agentId": "agent_p30",
    "agencyId": "agency_p30",
    "origin": "agent",
    "createdBy": "agent_p30",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Short Let in Yaba",
    "location": "Yaba, Lagos",
    "price": "₦4,673,789/yr",
    "priceValue": 4673789,
    "monthly": "₦389k",
    "type": "Short Let",
    "beds": 4,
    "baths": 4,
    "area": "194 m²",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 89,
    "yearBuilt": 2014,
    "city": "Yaba",
    "state": "Lagos"
  },
  {
    "id": "p31",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p31",
    "agentId": "agent_p31",
    "agencyId": "agency_p31",
    "origin": "agent",
    "createdBy": "agent_p31",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Short Let in Yaba",
    "location": "Yaba, Lagos",
    "price": "₦2,032,889/yr",
    "priceValue": 2032889,
    "monthly": "₦169k",
    "type": "Short Let",
    "beds": 1,
    "baths": 2,
    "area": "71 m²",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 85,
    "yearBuilt": 2022,
    "city": "Yaba",
    "state": "Lagos"
  },
  {
    "id": "p32",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p32",
    "agentId": "agent_p32",
    "agencyId": "agency_p32",
    "origin": "agent",
    "createdBy": "agent_p32",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Short Let in Yaba",
    "location": "Yaba, Lagos",
    "price": "₦2,407,763/yr",
    "priceValue": 2407763,
    "monthly": "₦201k",
    "type": "Short Let",
    "beds": 2,
    "baths": 3,
    "area": "457 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 86,
    "yearBuilt": 2016,
    "city": "Yaba",
    "state": "Lagos"
  },
  {
    "id": "p33",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p33",
    "agentId": "agent_p33",
    "agencyId": "agency_p33",
    "origin": "agent",
    "createdBy": "agent_p33",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Student Housing in Asokoro",
    "location": "Asokoro, Abuja",
    "price": "₦868,847/yr",
    "priceValue": 868847,
    "monthly": "₦72k",
    "type": "Student Housing",
    "beds": 1,
    "baths": 2,
    "area": "92 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 78,
    "yearBuilt": 2022,
    "city": "Asokoro",
    "state": "Abuja",
    "coordinates": { "lat": 9.0438, "lng": 7.5255 }
  },
  {
    "id": "p34",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p34",
    "agentId": "agent_p34",
    "agencyId": "agency_p34",
    "origin": "agent",
    "createdBy": "agent_p34",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Student Housing in Asokoro",
    "location": "Asokoro, Abuja",
    "price": "₦390,977/yr",
    "priceValue": 390977,
    "monthly": "₦33k",
    "type": "Student Housing",
    "beds": 1,
    "baths": 2,
    "area": "201 m²",
    "image": "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 75,
    "yearBuilt": 2022,
    "city": "Asokoro",
    "state": "Abuja",
    "coordinates": { "lat": 9.0438, "lng": 7.5255 }
  },
  {
    "id": "p35",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p35",
    "agentId": "agent_p35",
    "agencyId": "agency_p35",
    "origin": "agent",
    "createdBy": "agent_p35",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Student Housing in Wuse",
    "location": "Wuse, Abuja",
    "price": "₦680,326/yr",
    "priceValue": 680326,
    "monthly": "₦57k",
    "type": "Student Housing",
    "beds": 2,
    "baths": 2,
    "area": "675 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 86,
    "yearBuilt": 2015,
    "city": "Wuse",
    "state": "Abuja"
  },
  {
    "id": "p36",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p36",
    "agentId": "agent_p36",
    "agencyId": "agency_p36",
    "origin": "agent",
    "createdBy": "agent_p36",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Student Housing in Ogba",
    "location": "Ogba, Lagos",
    "price": "₦822,335/yr",
    "priceValue": 822335,
    "monthly": "₦69k",
    "type": "Student Housing",
    "beds": 2,
    "baths": 2,
    "area": "285 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 79,
    "yearBuilt": 2013,
    "city": "Ogba",
    "state": "Lagos"
  },
  {
    "id": "p37",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p37",
    "agentId": "agent_p37",
    "agencyId": "agency_p37",
    "origin": "agent",
    "createdBy": "agent_p37",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Student Housing in Yaba",
    "location": "Yaba, Lagos",
    "price": "₦353,092/yr",
    "priceValue": 353092,
    "monthly": "₦29k",
    "type": "Student Housing",
    "beds": 2,
    "baths": 3,
    "area": "708 m²",
    "image": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 85,
    "yearBuilt": 2018,
    "city": "Yaba",
    "state": "Lagos"
  },
  {
    "id": "p38",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p38",
    "agentId": "agent_p38",
    "agencyId": "agency_p38",
    "origin": "agent",
    "createdBy": "agent_p38",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Affordable Rental in Gbagada",
    "location": "Gbagada, Lagos",
    "price": "₦747,209/yr",
    "priceValue": 747209,
    "monthly": "₦62k",
    "type": "Affordable Rental",
    "beds": 3,
    "baths": 4,
    "area": "56 m²",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 86,
    "yearBuilt": 2021,
    "city": "Gbagada",
    "state": "Lagos"
  },
  {
    "id": "p39",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p39",
    "agentId": "agent_p39",
    "agencyId": "agency_p39",
    "origin": "agent",
    "createdBy": "agent_p39",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Affordable Rental in Ikeja",
    "location": "Ikeja, Lagos",
    "price": "₦824,587/yr",
    "priceValue": 824587,
    "monthly": "₦69k",
    "type": "Affordable Rental",
    "beds": 3,
    "baths": 4,
    "area": "711 m²",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 63,
    "yearBuilt": 2020,
    "city": "Ikeja",
    "state": "Lagos"
  },
  {
    "id": "p40",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p40",
    "agentId": "agent_p40",
    "agencyId": "agency_p40",
    "origin": "agent",
    "createdBy": "agent_p40",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Affordable Rental in Gwarinpa",
    "location": "Gwarinpa, Abuja",
    "price": "₦1,759,124/yr",
    "priceValue": 1759124,
    "monthly": "₦147k",
    "type": "Affordable Rental",
    "beds": 2,
    "baths": 2,
    "area": "153 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 72,
    "yearBuilt": 2017,
    "city": "Gwarinpa",
    "state": "Abuja"
  },
  {
    "id": "p41",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p41",
    "agentId": "agent_p41",
    "agencyId": "agency_p41",
    "origin": "agent",
    "createdBy": "agent_p41",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Affordable Rental in GRA",
    "location": "GRA, Benin City",
    "price": "₦2,874,214/yr",
    "priceValue": 2874214,
    "monthly": "₦240k",
    "type": "Affordable Rental",
    "beds": 1,
    "baths": 1,
    "area": "720 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 65,
    "yearBuilt": 2020,
    "city": "GRA",
    "state": "Benin City"
  },
  {
    "id": "p42",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p42",
    "agentId": "agent_p42",
    "agencyId": "agency_p42",
    "origin": "agent",
    "createdBy": "agent_p42",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Affordable Rental in Lekki Phase 1",
    "location": "Lekki Phase 1, Lagos",
    "price": "₦1,169,033/yr",
    "priceValue": 1169033,
    "monthly": "₦97k",
    "type": "Affordable Rental",
    "beds": 2,
    "baths": 2,
    "area": "733 m²",
    "image": "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 89,
    "yearBuilt": 2020,
    "city": "Lekki",
    "state": "Lagos",
    "coordinates": { "lat": 6.4698, "lng": 3.5852 }
  },
  {
    "id": "p43",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p43",
    "agentId": "agent_p43",
    "agencyId": "agency_p43",
    "origin": "agent",
    "createdBy": "agent_p43",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Family House in GRA",
    "location": "GRA, Benin City",
    "price": "₦131,841,388",
    "priceValue": 131841388,
    "monthly": "₦1.1M",
    "type": "Family House",
    "beds": 3,
    "baths": 4,
    "area": "575 m²",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 60,
    "yearBuilt": 2022,
    "city": "GRA",
    "state": "Benin City"
  },
  {
    "id": "p44",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p44",
    "agentId": "agent_p44",
    "agencyId": "agency_p44",
    "origin": "agent",
    "createdBy": "agent_p44",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Family House in Gbagada",
    "location": "Gbagada, Lagos",
    "price": "₦5,328,811/yr",
    "priceValue": 5328811,
    "monthly": "₦444k",
    "type": "Family House",
    "beds": 5,
    "baths": 5,
    "area": "611 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Emeka Uche",
      "agency": "Sterling Homes",
      "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 73,
    "yearBuilt": 2021,
    "city": "Gbagada",
    "state": "Lagos"
  },
  {
    "id": "p45",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p45",
    "agentId": "agent_p45",
    "agencyId": "agency_p45",
    "origin": "agent",
    "createdBy": "agent_p45",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Family House in Lokogoma",
    "location": "Lokogoma, Abuja",
    "price": "₦4,584,159/yr",
    "priceValue": 4584159,
    "monthly": "₦382k",
    "type": "Family House",
    "beds": 5,
    "baths": 6,
    "area": "317 m²",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 76,
    "yearBuilt": 2012,
    "city": "Lokogoma",
    "state": "Abuja"
  },
  {
    "id": "p46",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p46",
    "agentId": "agent_p46",
    "agencyId": "agency_p46",
    "origin": "agent",
    "createdBy": "agent_p46",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Family House in Gbagada",
    "location": "Gbagada, Lagos",
    "price": "₦89,082,953",
    "priceValue": 89082953,
    "monthly": "₦742k",
    "type": "Family House",
    "beds": 5,
    "baths": 6,
    "area": "701 m²",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 65,
    "yearBuilt": 2011,
    "city": "Gbagada",
    "state": "Lagos"
  },
  {
    "id": "p47",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p47",
    "agentId": "agent_p47",
    "agencyId": "agency_p47",
    "origin": "agent",
    "createdBy": "agent_p47",
    "createdByRole": "Agent",
    "transactionType": "rent",
    "title": "Premium Family House in GRA Phase 2",
    "location": "GRA Phase 2, Port Harcourt",
    "price": "₦5,095,563/yr",
    "priceValue": 5095563,
    "monthly": "₦425k",
    "type": "Family House",
    "beds": 4,
    "baths": 5,
    "area": "789 m²",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 79,
    "yearBuilt": 2022,
    "city": "GRA",
    "state": "Port Harcourt"
  },
  {
    "id": "p48",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p48",
    "agentId": "agent_p48",
    "agencyId": "agency_p48",
    "origin": "agent",
    "createdBy": "agent_p48",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Land in Lekki Phase 1",
    "location": "Lekki Phase 1, Lagos",
    "price": "₦7,699,821/yr",
    "priceValue": 7699821,
    "monthly": "₦642k",
    "type": "Land",
    "beds": 0,
    "baths": 0,
    "area": "382 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 82,
    "yearBuilt": 2012,
    "city": "Lekki",
    "state": "Lagos",
    "coordinates": { "lat": 6.4698, "lng": 3.5852 }
  },
  {
    "id": "p49",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p49",
    "agentId": "agent_p49",
    "agencyId": "agency_p49",
    "origin": "agent",
    "createdBy": "agent_p49",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Land in Lokogoma",
    "location": "Lokogoma, Abuja",
    "price": "₦4,222,201/yr",
    "priceValue": 4222201,
    "monthly": "₦352k",
    "type": "Land",
    "beds": 0,
    "baths": 0,
    "area": "745 m²",
    "image": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 83,
    "yearBuilt": 2017,
    "city": "Lokogoma",
    "state": "Abuja"
  },
  {
    "id": "p50",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p50",
    "agentId": "agent_p50",
    "agencyId": "agency_p50",
    "origin": "agent",
    "createdBy": "agent_p50",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Land in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦3,099,776/yr",
    "priceValue": 3099776,
    "monthly": "₦258k",
    "type": "Land",
    "beds": 0,
    "baths": 0,
    "area": "556 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 61,
    "yearBuilt": 2012,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p51",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p51",
    "agentId": "agent_p51",
    "agencyId": "agency_p51",
    "origin": "agent",
    "createdBy": "agent_p51",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Land in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦9,244,705/yr",
    "priceValue": 9244705,
    "monthly": "₦770k",
    "type": "Land",
    "beds": 0,
    "baths": 0,
    "area": "80 m²",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 74,
    "yearBuilt": 2014,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p52",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p52",
    "agentId": "agent_p52",
    "agencyId": "agency_p52",
    "origin": "agent",
    "createdBy": "agent_p52",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Land in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦428,054,451",
    "priceValue": 428054451,
    "monthly": "₦3.6M",
    "type": "Land",
    "beds": 0,
    "baths": 0,
    "area": "229 m²",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 84,
    "yearBuilt": 2013,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p53",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p53",
    "agentId": "agent_p53",
    "agencyId": "agency_p53",
    "origin": "agent",
    "createdBy": "agent_p53",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Warehouse in Ajah",
    "location": "Ajah, Lagos",
    "price": "₦727,816,994",
    "priceValue": 727816994,
    "monthly": "₦6.1M",
    "type": "Warehouse",
    "beds": 0,
    "baths": 0,
    "area": "437 m²",
    "image": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 80,
    "yearBuilt": 2011,
    "city": "Ajah",
    "state": "Lagos"
  },
  {
    "id": "p54",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p54",
    "agentId": "agent_p54",
    "agencyId": "agency_p54",
    "origin": "agent",
    "createdBy": "agent_p54",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Warehouse in Ikeja",
    "location": "Ikeja, Lagos",
    "price": "₦547,974,427",
    "priceValue": 547974427,
    "monthly": "₦4.6M",
    "type": "Warehouse",
    "beds": 0,
    "baths": 0,
    "area": "704 m²",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 76,
    "yearBuilt": 2015,
    "city": "Ikeja",
    "state": "Lagos"
  },
  {
    "id": "p55",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p55",
    "agentId": "agent_p55",
    "agencyId": "agency_p55",
    "origin": "agent",
    "createdBy": "agent_p55",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Warehouse in Maitama",
    "location": "Maitama, Abuja",
    "price": "₦13,539,508/yr",
    "priceValue": 13539508,
    "monthly": "₦1.1M",
    "type": "Warehouse",
    "beds": 0,
    "baths": 0,
    "area": "610 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 68,
    "yearBuilt": 2023,
    "city": "Maitama",
    "state": "Abuja",
    "coordinates": { "lat": 9.0833, "lng": 7.4950 }
  },
  {
    "id": "p56",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p56",
    "agentId": "agent_p56",
    "agencyId": "agency_p56",
    "origin": "agent",
    "createdBy": "agent_p56",
    "createdByRole": "Agent",
    "transactionType": "buy",
    "title": "Premium Warehouse in Lokogoma",
    "location": "Lokogoma, Abuja",
    "price": "₦700,529,531",
    "priceValue": 700529531,
    "monthly": "₦5.8M",
    "type": "Warehouse",
    "beds": 0,
    "baths": 0,
    "area": "192 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Adaeze Okonkwo",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 72,
    "yearBuilt": 2013,
    "city": "Lokogoma",
    "state": "Abuja"
  },
  {
    "id": "p57",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p57",
    "agentId": "agent_p57",
    "agencyId": "agency_p57",
    "origin": "agent",
    "createdBy": "agent_p57",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Warehouse in Independence Layout",
    "location": "Independence Layout, Enugu",
    "price": "₦47,141,858/yr",
    "priceValue": 47141858,
    "monthly": "₦3.9M",
    "type": "Warehouse",
    "beds": 0,
    "baths": 0,
    "area": "360 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Chioma Adeyemi",
      "agency": "Meridian Luxury",
      "avatar": "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 78,
    "yearBuilt": 2022,
    "city": "Independence Layout",
    "state": "Enugu"
  },
  {
    "id": "p58",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p58",
    "agentId": "agent_p58",
    "agencyId": "agency_p58",
    "origin": "agent",
    "createdBy": "agent_p58",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Office Space in Ikeja",
    "location": "Ikeja, Lagos",
    "price": "₦19,089,636/yr",
    "priceValue": 19089636,
    "monthly": "₦1.6M",
    "type": "Office Space",
    "beds": 0,
    "baths": 0,
    "area": "356 m²",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 68,
    "yearBuilt": 2015,
    "city": "Ikeja",
    "state": "Lagos"
  },
  {
    "id": "p59",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p59",
    "agentId": "agent_p59",
    "agencyId": "agency_p59",
    "origin": "agent",
    "createdBy": "agent_p59",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Office Space in Lugbe",
    "location": "Lugbe, Abuja",
    "price": "₦11,949,712/yr",
    "priceValue": 11949712,
    "monthly": "₦996k",
    "type": "Office Space",
    "beds": 0,
    "baths": 0,
    "area": "357 m²",
    "image": "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "tag": "Featured",
    "gallery": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 68,
    "yearBuilt": 2014,
    "city": "Lugbe",
    "state": "Abuja"
  },
  {
    "id": "p60",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p60",
    "agentId": "agent_p60",
    "agencyId": "agency_p60",
    "origin": "agent",
    "createdBy": "agent_p60",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Office Space in Bodija",
    "location": "Bodija, Ibadan",
    "price": "₦15,664,995/yr",
    "priceValue": 15664995,
    "monthly": "₦1.3M",
    "type": "Office Space",
    "beds": 0,
    "baths": 0,
    "area": "132 m²",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Tunde Bakare",
      "agency": "Crest & Crown",
      "avatar": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 63,
    "yearBuilt": 2010,
    "city": "Bodija",
    "state": "Ibadan"
  },
  {
    "id": "p61",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p61",
    "agentId": "agent_p61",
    "agencyId": "agency_p61",
    "origin": "agent",
    "createdBy": "agent_p61",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Office Space in Victoria Island",
    "location": "Victoria Island, Lagos",
    "price": "₦13,140,637/yr",
    "priceValue": 13140637,
    "monthly": "₦1.1M",
    "type": "Office Space",
    "beds": 0,
    "baths": 0,
    "area": "636 m²",
    "image": "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Kunle Sanusi",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": false
    },
    "gallery": [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 77,
    "yearBuilt": 2015,
    "city": "Victoria Island",
    "state": "Lagos",
    "coordinates": { "lat": 6.4281, "lng": 3.4219 }
  },
  {
    "id": "p62",
    "description": "Luxurious property offering unparalleled amenities and a prime location. Perfect for discerning buyers.",
    "ownerId": "owner_p62",
    "agentId": "agent_p62",
    "agencyId": "agency_p62",
    "origin": "agent",
    "createdBy": "agent_p62",
    "createdByRole": "Agent",
    "transactionType": "lease",
    "title": "Premium Office Space in Surulere",
    "location": "Surulere, Lagos",
    "price": "₦5,686,463/yr",
    "priceValue": 5686463,
    "monthly": "₦474k",
    "type": "Office Space",
    "beds": 0,
    "baths": 0,
    "area": "226 m²",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "verified": [
      "Documents",
      "Inspection"
    ],
    "agent": {
      "name": "Ngozi Eze",
      "agency": "Atlas Realty",
      "avatar": "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      "verified": true
    },
    "gallery": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800"
    ],
    "amenities": [
      "24/7 Security",
      "Backup Power",
      "Parking Space",
      "Treated Water"
    ],
    "walkScore": 94,
    "yearBuilt": 2020,
    "city": "Surulere",
    "state": "Lagos"
  }
];



export type Category = {
  id: string;
  label: string;
  propertyType: PropertyType;
  icon: string;
  image: string;
};

export const categories: Category[] = [
  { id: 'apartments', label: 'Apartments', propertyType: 'Apartment', icon: 'Building2', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
  { id: 'duplexes', label: 'Duplexes', propertyType: 'Duplex', icon: 'Home', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
  { id: 'studios', label: 'Studio Apartments', propertyType: 'Studio', icon: 'DoorOpen', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800' },
  { id: 'mini-flats', label: 'Mini Flats', propertyType: 'Mini Flat', icon: 'BedDouble', image: 'https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800' },
  { id: 'self-contained', label: 'Self-contained', propertyType: 'Self Contain', icon: 'DoorClosed', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800' },
  { id: 'short-lets', label: 'Short-let', propertyType: 'Short Let', icon: 'Key', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800' },
  { id: 'student-housing', label: 'Student Housing', propertyType: 'Student Housing', icon: 'GraduationCap', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800' },
  { id: 'affordable-rentals', label: 'Affordable Rentals', propertyType: 'Affordable Rental', icon: 'Building2', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800' },
  { id: 'family-homes', label: 'Family Homes', propertyType: 'Family House', icon: 'House', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { id: 'land', label: 'Land', propertyType: 'Land', icon: 'Trees', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
  { id: 'warehouse', label: 'Warehouse', propertyType: 'Warehouse', icon: 'Warehouse', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800' },
  { id: 'office-space', label: 'Office Space', propertyType: 'Office Space', icon: 'Briefcase', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
];

export type Agency = {
  name: string;
  rating: number;
  listings: number;
  deals: number;
  logo: string;
  color: string;
};

export const agencies: Agency[] = [
  { name: 'Meridian Luxury', rating: 4.9, listings: 420, deals: 312, logo: 'M', color: 'from-gold-400 to-gold-600' },
  { name: 'Crest & Crown', rating: 4.8, listings: 380, deals: 289, logo: 'C', color: 'from-blue-400 to-blue-600' },
  { name: 'Atlas Realty', rating: 4.7, listings: 510, deals: 401, logo: 'A', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Sterling Homes', rating: 4.8, listings: 290, deals: 234, logo: 'S', color: 'from-rose-400 to-rose-600' },
];

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Bisi Williams',
    role: 'Investor, Lagos',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'Luxora changed how I evaluate property. The verification badges and investment score gave me the confidence to close on three units in one quarter.',
    rating: 5,
  },
  {
    name: 'Chidi Okafor',
    role: 'Homeowner, Abuja',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'The mortgage calculator showed me I could afford a home I thought was out of reach. The payment plan was transparent from day one.',
    rating: 5,
  },
  {
    name: 'Amara Eze',
    role: 'Agency Director, Crest & Crown',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'As an agency, the intelligence dashboard and verification queue have cut our deal cycle time by 40%. It is the platform we always wanted.',
    rating: 5,
  },
];

/* ---------- Dashboard data ---------- */

export type NavItem = { label: string; icon: string; badge?: string };

export const sidebarNav: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Properties', icon: 'Building2', badge: '12.4k' },
  { label: 'Verification', icon: 'ShieldCheck', badge: '38' },
  { label: 'Agencies', icon: 'Landmark' },
  { label: 'Agents', icon: 'Users' },
  { label: 'Finance', icon: 'Wallet' },
  { label: 'Procurement', icon: 'Package' },
  { label: 'Property Intelligence', icon: 'Brain' },
  { label: 'Property Management', icon: 'KeyRound' },
  { label: 'Home Services', icon: 'Wrench' },
  { label: 'Partnerships', icon: 'Handshake' },
  { label: 'Users', icon: 'UserCircle' },
  { label: 'Admins', icon: 'Shield' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Settings', icon: 'Settings' },
];

export const buyerNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Recommendations', icon: 'Sparkles' },
  { label: 'Recently Viewed', icon: 'Activity' },
  { label: 'My Favorites', icon: 'Heart', badge: '3' },
  { label: 'Mortgage Tracker', icon: 'Wallet' },
  { label: 'Messages', icon: 'MessageSquare', badge: '2' },
  { label: 'Viewing Requests', icon: 'Eye' },
  { label: 'Offers', icon: 'FileCheck' },
  { label: 'Settings', icon: 'Settings' },
];

export const ownerNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'My Property Requests', icon: 'Home', badge: '1' },
  { label: 'Verification Progress', icon: 'ShieldCheck', badge: '2' },
  { label: 'Listing Journey', icon: 'Route' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Offers', icon: 'FileCheck', badge: '3' },
  { label: 'Rental Income', icon: 'Wallet' },
  { label: 'Analytics', icon: 'TrendingUp' },
  { label: 'Settings', icon: 'Settings' },
];

export const agentNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'My Listings', icon: 'Building2' },
  { label: 'Leads', icon: 'Target', badge: '12' },
  { label: 'Clients', icon: 'UserCircle' },
  { label: 'Appointments', icon: 'Calendar', badge: '3' },
  { label: 'Deals', icon: 'Briefcase' },
  { label: 'Commissions', icon: 'DollarSign' },
  { label: 'Performance', icon: 'Activity' },
  { label: 'Reports', icon: 'FileText' },
  { label: 'Settings', icon: 'Settings' },
];

export const agencyNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Listings', icon: 'Building2', badge: '42' },
  { label: 'Agents', icon: 'Users', badge: '14' },
  { label: 'Leads', icon: 'Target', badge: '8' },
  { label: 'Clients', icon: 'UserCircle' },
  { label: 'Performance', icon: 'TrendingUp' },
  { label: 'Commissions', icon: 'DollarSign' },
  { label: 'Settings', icon: 'Settings' },
];

export const adminNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Listings', icon: 'Building2' },
  { label: 'Verification Queue', icon: 'ShieldCheck', badge: '14' },
  { label: 'Owners', icon: 'UserCircle' },
  { label: 'Buyers', icon: 'Heart' },
  { label: 'Agents', icon: 'Users' },
  { label: 'Agencies', icon: 'Building2' },
  { label: 'Complaints', icon: 'AlertTriangle', badge: '3' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Finance', icon: 'Landmark' },
  { label: 'Settings', icon: 'Settings' },
];

export const superAdminNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Business Health', icon: 'Activity' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'Revenue', icon: 'Banknote' },
  { label: 'Management', icon: 'Briefcase' },
  { label: 'Procurement', icon: 'ShoppingCart' },
  { label: 'Finance', icon: 'Landmark' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Fraud Alerts', icon: 'ShieldAlert', badge: '3' },
  { label: 'Property Intelligence', icon: 'Brain' },
  { label: 'Property Management', icon: 'Building2' },
  { label: 'Home Services', icon: 'Wrench' },
  { label: 'Admin Management', icon: 'UserCog' },
  { label: 'System Settings', icon: 'Settings' },
  { label: 'Agency Rankings', icon: 'Crown' },
  { label: 'Charts', icon: 'PieChart' },
  { label: 'Analytics', icon: 'TrendingUp' },
  { label: 'User Settings', icon: 'Settings2' },
];

export const managementNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Team Management', icon: 'Users' },
  { label: 'Performance', icon: 'TrendingUp' },
  { label: 'Department Oversight', icon: 'Building2' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Settings', icon: 'Settings' },
];

export const procurementNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Vendor Directory', icon: 'Users' },
  { label: 'RFQs', icon: 'MessageSquare' },
  { label: 'Purchase Requests', icon: 'FileCheck', badge: '12' },
  { label: 'Purchase Orders', icon: 'ShoppingCart' },
  { label: 'Contracts', icon: 'Handshake' },
  { label: 'Inventory', icon: 'Package' },
  { label: 'Assets', icon: 'Building2' },
  { label: 'Invoices', icon: 'FileBarChart', badge: '4' },
  { label: 'Budget', icon: 'PieChart' },
  { label: 'Payments', icon: 'Wallet' },
  { label: 'Reports', icon: 'TrendingUp' },
  { label: 'Settings', icon: 'Settings' },
];

export const financeNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Revenue', icon: 'TrendingUp' },
  { label: 'Transactions', icon: 'Activity' },
  { label: 'Owner Payments', icon: 'Banknote' },
  { label: 'Agency Earnings', icon: 'Building2' },
  { label: 'Agent Commissions', icon: 'Users' },
  { label: 'Invoices', icon: 'FileBarChart' },
  { label: 'Refunds', icon: 'MessageSquare', badge: '3' },
  { label: 'Mortgage Statistics', icon: 'PieChart' },
  { label: 'Budget', icon: 'Wallet' },
  { label: 'Reports', icon: 'FileCheck' },
  { label: 'Payroll', icon: 'Users' },
  { label: 'Tax Center', icon: 'Landmark' },
  { label: 'Audit Logs', icon: 'ShieldCheck' },
  { label: 'Forecasting', icon: 'LineChart' },
  { label: 'Settings', icon: 'Settings' },
];

export const intelligenceNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'Market Trends', icon: 'TrendingUp' },
  { label: 'ROI Calculator', icon: 'Calculator' },
  { label: 'Rental Yield', icon: 'PieChart' },
  { label: 'Growth Forecast', icon: 'LineChart' },
  { label: 'Neighborhood Insights', icon: 'MapPin' },
  { label: 'Heat Map', icon: 'Map' },
  { label: 'Comparable Properties', icon: 'Home' },
  { label: 'Investment Scoring', icon: 'Sparkles' },
  { label: 'Risk Analysis', icon: 'ShieldAlert' },
  { label: 'AI Insights', icon: 'Brain' },
  { label: 'Executive Reports', icon: 'FileText' },
  { label: 'Market Alerts', icon: 'AlertCircle' },
  { label: 'Settings', icon: 'Settings' },
];

export const propertyManagerNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Tenants', icon: 'Users' },
  { label: 'Rent Collection', icon: 'Banknote' },
  { label: 'Maintenance', icon: 'Wrench' },
  { label: 'Lease Tracking', icon: 'FileText' },
  { label: 'Documents', icon: 'FileCheck' },
  { label: 'Inspections', icon: 'Eye' },
  { label: 'Expenses', icon: 'Wallet' },
  { label: 'Income', icon: 'TrendingUp' },
  { label: 'Analytics', icon: 'PieChart' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'Settings', icon: 'Settings' },
];

export const homeServicesNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Service Requests', icon: 'Wrench' },
  { label: 'Providers', icon: 'Users' },
  { label: 'Bookings', icon: 'Calendar' },
  { label: 'Categories', icon: 'Grid' },
  { label: 'Financials', icon: 'DollarSign' },
  { label: 'Analytics', icon: 'BarChart' },
  { label: 'Messages', icon: 'MessageSquare' },
  { label: 'Settings', icon: 'Settings' },
];

export const kpis = [
  { label: 'Total Revenue', value: '₦4.82B', delta: '+18.2%', up: true, icon: 'TrendingUp', spark: [20, 35, 28, 44, 38, 55, 62, 58, 72, 80] },
  { label: 'Active Listings', value: '12,418', delta: '+6.4%', up: true, icon: 'Building2', spark: [40, 42, 45, 43, 48, 52, 55, 58, 60, 64] },
  { label: 'Deals Closed', value: '1,294', delta: '+12.1%', up: true, icon: 'CheckCircle2', spark: [15, 22, 18, 30, 28, 40, 38, 50, 55, 60] },
  { label: 'Active Users', value: '88,210', delta: '+9.7%', up: true, icon: 'Users', spark: [30, 35, 42, 48, 52, 58, 65, 70, 78, 85] },
];

export const revenueMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const revenueData = [320, 410, 380, 520, 490, 610, 680, 640, 760, 820, 790, 910];

export const agencyRankings = [
  { name: 'Meridian Luxury', deals: 312, revenue: '₦1.2B', rating: 4.9, trend: 'up' },
  { name: 'Atlas Realty', deals: 401, revenue: '₦980M', rating: 4.7, trend: 'up' },
  { name: 'Crest & Crown', deals: 289, revenue: '₦860M', rating: 4.8, trend: 'down' },
  { name: 'Sterling Homes', deals: 234, revenue: '₦640M', rating: 4.8, trend: 'up' },
  { name: 'Pinnacle Estates', deals: 198, revenue: '₦520M', rating: 4.6, trend: 'up' },
];

export const agentPerformance = [
  { name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', deals: 42, value: '₦680M', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Tunde Bakare', agency: 'Crest & Crown', deals: 38, value: '₦540M', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Ngozi Eze', agency: 'Atlas Realty', deals: 35, value: '₦490M', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Femi Adeola', agency: 'Sterling Homes', deals: 31, value: '₦420M', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

export const fraudAlerts = [
  { severity: 'critical', title: 'Duplicate listing detected', detail: 'Lekki Phase 1 — 2 agents listing same coordinates', time: '12m ago' },
  { severity: 'high', title: 'Unverified document upload', detail: 'Agency: Pinnacle Estates — title deed mismatch', time: '1h ago' },
  { severity: 'medium', title: 'Price manipulation flag', detail: 'Asokoro property repriced 3x in 24h', time: '3h ago' },
];

export const verificationQueue = [
  { id: 'VQ-2041', property: 'Garden Court Villa', type: 'Document', submitted: '2h ago', status: 'pending' },
  { id: 'VQ-2040', property: 'Aurora Smart Studio', type: 'Inspection', submitted: '5h ago', status: 'review' },
  { id: 'VQ-2039', property: 'Marina View Apartment', type: ROLES.AGENT, submitted: '8h ago', status: 'pending' },
  { id: 'VQ-2038', property: 'The Continental Duplex', type: 'Premium', submitted: '1d ago', status: 'review' },
];

export const complaints = [
  { id: 'C-882', subject: 'Delayed inspection schedule', user: 'Bisi W.', priority: 'high', status: 'open' },
  { id: 'C-881', subject: 'Payment plan clarification', user: 'Chidi O.', priority: 'medium', status: 'progress' },
  { id: 'C-880', subject: 'Agent response time', user: 'Amara E.', priority: 'low', status: 'resolved' },
];

export const dealPipeline = [
  { stage: 'Lead', count: 420, value: '₦12.4B' },
  { stage: 'Viewing', count: 210, value: '₦7.8B' },
  { stage: 'Offer', count: 98, value: '₦4.2B' },
  { stage: 'Verification', count: 64, value: '₦2.9B' },
  { stage: 'Closing', count: 31, value: '₦1.4B' },
];

export const userGrowthMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const userGrowthData = [12, 18, 24, 31, 38, 46, 52, 61, 68, 74, 82, 88];

export type Review = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Oluwaseun Adebayo',
    role: 'Property Investor',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    date: '2 weeks ago',
    text: 'An absolutely seamless experience from start to finish. The level of professionalism and market knowledge demonstrated was exceptional. I felt completely confident throughout the entire purchasing process.'
  },
  {
    id: 'r2',
    author: 'Grace Ibeh',
    role: 'Homeowner',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    date: '1 month ago',
    text: 'I was blown away by the attention to detail. Every question was answered promptly, and the negotiation was handled with utmost care. Highly recommended for anyone looking for luxury real estate.'
  },
  {
    id: 'r3',
    author: 'David Nwachukwu',
    role: 'Corporate Client',
    avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4,
    date: '3 months ago',
    text: 'Very professional team. They understood our corporate housing needs perfectly and delivered options that were exactly what we asked for. The only minor issue was a slight delay in document processing, but overall great service.'
  }
];

export const ROLE_NAV_MAP: Record<string, NavItem[]> = {
  [ROLES.BUYER]: buyerNav,
  [ROLES.OWNER]: ownerNav,
  [ROLES.AGENT]: agentNav,
  [ROLES.AGENCY]: agencyNav,
  [ROLES.SUPER_ADMIN]: superAdminNav,
  [ROLES.ADMIN]: adminNav,
  [ROLES.MANAGER]: managementNav,
  [ROLES.PROCUREMENT]: procurementNav,
  [ROLES.FINANCE]: financeNav,
  [ROLES.ANALYST]: intelligenceNav,
  [ROLES.PROPERTY_MANAGER]: propertyManagerNav,
  [ROLES.SERVICE_ADMIN]: homeServicesNav,
};

export const ENTERPRISE_MODULE_MAP: Record<string, string[]> = {
  [ROLES.FINANCE]: ['Finance', 'Reports', 'Workflow', 'Documents'],
  [ROLES.MANAGER]: ['Workflow', 'Compliance', 'Notifications', 'Reports'],
  [ROLES.PROCUREMENT]: ['Procurement', 'Vendors', 'Workflow', 'Finance Requests'],
  [ROLES.ADMIN]: ['All'],
  [ROLES.SUPER_ADMIN]: ['All'],
};

