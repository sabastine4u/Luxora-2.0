import { FileText, Image as ImageIcon, Video, File, Download, Search, Filter } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../utils/formatter';

export const SharedFileWorkspace = () => {
  const mockFiles = [
    { id: 'f1', name: 'Victoria_Island_Villa_Brochure.pdf', type: 'pdf', size: '2.4 MB', owner: 'Sarah Jenkins', time: '2023-10-25T10:00:00Z', sharedWith: 'Sales Team' },
    { id: 'f2', name: 'Contract_Draft_V2.docx', type: 'doc', size: '850 KB', owner: 'Robert Hayes', time: '2023-10-24T14:30:00Z', sharedWith: 'James Wilson' },
    { id: 'f3', name: 'Property_Walkthrough.mp4', type: 'video', size: '45.2 MB', owner: 'Sarah Jenkins', time: '2023-10-23T09:15:00Z', sharedWith: 'Marketing' },
    { id: 'f4', name: 'Floor_Plan_Level1.png', type: 'image', size: '1.2 MB', owner: 'Marcus Thorne', time: '2023-10-22T16:45:00Z', sharedWith: 'Property Team' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-green-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Shared File Workspace</h2>
          <p className="text-xs text-gray-500">Enterprise Document Center</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search files..."
              className="pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-ink-light border border-gray-200 dark:border-ink rounded-lg text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <GhostButton size="sm" className="w-9 h-9 p-0 rounded-lg border border-gray-200 dark:border-ink">
            <Filter className="w-4 h-4 text-gray-500" />
          </GhostButton>
          <GoldButton size="sm" className="ml-2">
            Upload File
          </GoldButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockFiles.map(file => (
            <div key={file.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-4 flex flex-col hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 dark:bg-ink-light rounded-lg">
                  {getFileIcon(file.type)}
                </div>
                <GhostButton size="sm" className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-4 h-4 text-gray-500" />
                </GhostButton>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{file.size} • {file.owner}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-100 dark:border-ink-light flex items-center justify-between text-xs text-gray-400">
                <span>{formatMessageTime(file.time)}</span>
                <span className="truncate max-w-[100px] text-right" title={file.sharedWith}>
                  {file.sharedWith}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
