import { useState } from 'react';
import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { Folder, ChevronRight, ChevronDown, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import type { FolderNode } from '../types/documentTypes';

export const FolderTree = () => {
  const { folders, currentFolderId, setCurrentFolderId, setActiveWorkspace } = useDocumentCenter();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['folder-root']));

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSelectFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    setActiveWorkspace('explorer');
  };

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = currentFolderId === folder.id;
    const children = folders.filter(f => f.parentId === folder.id);
    const hasChildren = children.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div 
          className={clsx(
            "flex items-center py-1.5 px-2 rounded-lg cursor-pointer text-sm transition-colors group",
            isSelected 
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-light"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => handleSelectFolder(folder.id)}
        >
          <button 
            className="w-4 h-4 flex items-center justify-center mr-1 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => hasChildren && toggleExpand(folder.id, e)}
            disabled={!hasChildren}
          >
            {hasChildren && (
              isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
            )}
          </button>
          
          <Folder className={clsx("w-4 h-4 mr-2 flex-shrink-0", isSelected ? "text-blue-500 fill-blue-100 dark:fill-blue-900/40" : "text-gold-400 fill-gold-100 dark:fill-gold-900/20")} />
          
          <span className="truncate flex-1">{folder.name}</span>

          {folder.isRestricted && (
            <Lock className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="mt-0.5">
            {children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Find root folders
  const rootFolders = folders.filter(f => f.parentId === null);

  return (
    <div className="space-y-0.5 pr-2">
      {rootFolders.map(folder => renderFolder(folder, 0))}
    </div>
  );
};
