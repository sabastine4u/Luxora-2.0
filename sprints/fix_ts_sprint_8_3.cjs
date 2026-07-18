const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'pages', 'AgentDashboard', 'components');

// 1. Fix Clients.tsx (missing Activity)
const clientsPath = path.join(componentsDir, 'Clients.tsx');
let clientsContent = fs.readFileSync(clientsPath, 'utf-8');
if (!clientsContent.includes('Activity,')) {
  clientsContent = clientsContent.replace('import { Users, ', 'import { Users, Activity, ');
  fs.writeFileSync(clientsPath, clientsContent);
  console.log('Fixed Clients.tsx');
}

// 2. Fix Leads.tsx (hideHeader in SegmentedProgressBar)
const leadsPath = path.join(componentsDir, 'Leads.tsx');
let leadsContent = fs.readFileSync(leadsPath, 'utf-8');
leadsContent = leadsContent.replace('hideHeader={true}', '');
fs.writeFileSync(leadsPath, leadsContent);
console.log('Fixed Leads.tsx');

// 3. Fix MyListings.tsx (Record<string, unknown> back to any, and statusDistribution mapping)
const myListingsPath = path.join(componentsDir, 'MyListings.tsx');
let myListingsContent = fs.readFileSync(myListingsPath, 'utf-8');
myListingsContent = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + myListingsContent;
myListingsContent = myListingsContent.replace(/Record<string, unknown>/g, 'any');
myListingsContent = myListingsContent.replace('segments={statusDistribution}', 'segments={statusDistribution.map(s => ({ label: s.label, value: s.count, color: s.color }))}');
fs.writeFileSync(myListingsPath, myListingsContent);
console.log('Fixed MyListings.tsx');

