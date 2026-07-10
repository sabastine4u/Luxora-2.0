const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'pages', 'AgentDashboard', 'components');

const fixUnusedImports = (content) => {
  return content.replace(/^import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];/m, (match, importsStr) => {
    const imports = importsStr.split(',').map(i => i.trim());
    const usedImports = imports.filter(imp => {
      // Very basic check: does this string appear anywhere else in the file?
      const asAliasMatch = imp.match(/^(\w+)\s+as\s+(\w+)$/);
      const nameToCheck = asAliasMatch ? asAliasMatch[2] : imp;
      
      const regex = new RegExp(`\\b${nameToCheck}\\b`, 'g');
      const matches = content.match(regex);
      return matches && matches.length > 1; // 1 for the import itself, >1 means it's used
    });
    
    // Quick fix for missing Eye in Overview.tsx
    if (content.includes('<Eye') && !usedImports.includes('Eye')) {
      usedImports.push('Eye');
    }

    return `import { ${usedImports.join(', ')} } from 'lucide-react';`;
  });
};

const fixUnusedLocalImports = (content) => {
  const lines = content.split('\n');
  const newLines = lines.filter(line => {
    if (line.includes("import { StatusBadge }") && !content.includes("<StatusBadge")) {
      return false;
    }
    if (line.includes("import { ActivityTimeline }") && !content.includes("<ActivityTimeline")) {
      return false;
    }
    return true;
  });
  return newLines.join('\n');
}

const fixAnyTypes = (content) => {
  return content.replace(/: any\)/g, ': Record<string, unknown>)');
};

const fixFile = (fileName) => {
  const filePath = path.join(componentsDir, fileName);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  content = fixUnusedImports(content);
  content = fixUnusedLocalImports(content);
  content = fixAnyTypes(content);
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${fileName}`);
};

['Appointments.tsx', 'Clients.tsx', 'Commissions.tsx', 'Deals.tsx', 'Leads.tsx', 'MyListings.tsx', 'Overview.tsx'].forEach(fixFile);

// Also remove eslint-disable comments from modals
const modalsDir = path.join(componentsDir, 'modals');
if (fs.existsSync(modalsDir)) {
  fs.readdirSync(modalsDir).forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(modalsDir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('/* eslint-disable @typescript-eslint/no-unused-vars */')) {
        content = content.replace('/* eslint-disable @typescript-eslint/no-unused-vars */\n', '');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed modal ${file}`);
      }
    }
  });
}
