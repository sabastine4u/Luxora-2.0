import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { NAVIGATION_CATEGORIES, type DocumentWorkspace } from '../constants/documentConstants';
import { FolderTree as FolderTreeIcon, Clock, Star, Users, CheckCircle, Archive, Trash2, Shield, Folder, Building2, GitMerge, MessageSquare, MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { FolderTree } from './FolderTree';

export const LeftNavigation = () => {
  const { activeWorkspace, setActiveWorkspace } = useDocumentCenter();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderTree': return <FolderTreeIcon className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
      case 'Archive': return <Archive className="w-4 h-4" />;
      case 'Trash2': return <Trash2 className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-ink border-r border-gray-100 dark:border-ink-light flex flex-col h-full">
      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Navigation Categories */}
        <div className="space-y-1 mb-6">
          {NAVIGATION_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveWorkspace(category.id as DocumentWorkspace)}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                activeWorkspace === category.id
                  ? "bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light"
              )}
            >
              <div className="flex items-center">
                <span className={clsx("mr-3", activeWorkspace === category.id ? "text-gold-500" : "text-gray-400")}>
                  {getIcon(category.icon)}
                </span>
                {category.label}
              </div>
            </button>
          ))}
        </div>

        {/* Enterprise Libraries */}
        <div className="mb-4 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Enterprise Libraries
        </div>
        <div className="space-y-1 mb-6">
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light transition-colors">
            <Shield className="w-4 h-4 mr-3 text-gray-400" /> Executive Documents
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light transition-colors">
            <Folder className="w-4 h-4 mr-3 text-gray-400" /> Department Libraries
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light transition-colors">
            <Building2 className="w-4 h-4 mr-3 text-gray-400" /> Property Libraries
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light transition-colors">
            <GitMerge className="w-4 h-4 mr-3 text-gray-400" /> Workflow Documents
          </button>
          <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-ink-light transition-colors">
            <MessageSquare className="w-4 h-4 mr-3 text-gray-400" /> Chat Attachments
          </button>
        </div>

        {/* Folder Explorer Tree */}
        <div className="mb-4 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
          <span>Folder Explorer</span>
          <button className="hover:text-gray-600 transition-colors"><MoreVertical className="w-3 h-3" /></button>
        </div>
        
        <FolderTree />

      </div>

      {/* Storage Indicator */}
      <div className="p-4 border-t border-gray-100 dark:border-ink-light bg-gray-50 dark:bg-ink-light/20 shrink-0">
        <div className="flex justify-between items-end mb-2">
          <div className="text-xs font-semibold text-gray-900 dark:text-white">Storage</div>
          <div className="text-[10px] text-gray-500">42% Used</div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-ink rounded-full h-1.5 mb-2">
          <div className="bg-gold-400 h-1.5 rounded-full" style={{ width: '42%' }} />
        </div>
        <div className="text-[10px] text-gray-500 text-center">
          2.1 TB / 5 TB Secure Enterprise Storage
        </div>
      </div>
    </div>
  );
};
