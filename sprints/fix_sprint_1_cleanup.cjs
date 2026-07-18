const fs = require('fs');
const files = [
  'src/components/property/MortgageCalculator.tsx',
  'src/components/property/PropertyGallery.tsx',
  'src/components/property/PropertyGrid.tsx',
  'src/components/property/PropertySidebar.tsx',
  'src/utils/propertyRecommendations.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix imports
    content = content.replace(/import\s+type\s+\{\s*Property\s*\}\s+from\s+['"]\.\.\/\.\.\/data\/luxoraData['"];/g, 
                              "import type { Property } from '../../types';");
    content = content.replace(/import\s+type\s+\{\s*Property\s*\}\s+from\s+['"]\.\.\/data\/luxoraData['"];/g, 
                              "import type { Property } from '../types';");
                              
    // Fix implicit any
    if (f.endsWith('propertyRecommendations.ts')) {
        content = content.replace(/\(v\)\s*=>/g, '(v: any) =>');
    }
    
    fs.writeFileSync(f, content);
    console.log('Fixed ' + f);
  }
});
