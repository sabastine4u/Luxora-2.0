const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const GLOBAL_CONFIRMATION_MODAL_PATH = "import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';";
// We need to figure out the relative path based on file depth.
// For files in `src/pages/Dashboard/components/File.tsx`, the depth is 4: `src`, `pages`, `Dashboard`, `components`. 
// Wait, `components/ui/ConfirmationModal` is in `src/components/ui`.
// If file is in `src/pages/BuyerDashboard/components/Offers.tsx` (depth 4 from src): `../../../../components/ui/ConfirmationModal`

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir(srcDir);
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import { ConfirmationModal }')) {
        // Replace the import line
        // Match things like: import { ConfirmationModal } from './modals/ConfirmationModal';
        const regex = /import\s*\{\s*ConfirmationModal\s*\}\s*from\s*['"]([^'"]+)['"]\s*;/g;
        content = content.replace(regex, (match, p1) => {
            // Find relative path from file to src/components/ui/ConfirmationModal
            const fileDir = path.dirname(file);
            const targetPath = path.join(srcDir, 'components', 'ui', 'ConfirmationModal');
            let relativePath = path.relative(fileDir, targetPath).replace(/\\/g, '/');
            if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
            }
            return `import { ConfirmationModal } from '${relativePath}';`;
        });
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
