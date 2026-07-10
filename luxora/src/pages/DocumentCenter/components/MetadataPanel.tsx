import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { Tag, Building2, UserCircle2, Clock, Calendar, Database, FileText } from 'lucide-react';
import { MOCK_DEPARTMENTS, MOCK_USERS } from '../data/mockData';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const MetadataPanel = () => {
  const { selectedDocument } = useDocumentCenter();

  if (!selectedDocument) return null;

  const department = MOCK_DEPARTMENTS.find(d => d.id === selectedDocument.metadata.departmentId);
  const owner = MOCK_USERS[selectedDocument.metadata.ownerId as keyof typeof MOCK_USERS];

  return (
    <div className="mt-6 border-t border-gray-100 dark:border-ink-light pt-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm flex items-center">
        <Database className="w-4 h-4 mr-2 text-gold-500" /> Enterprise Metadata
      </h3>
      
      <div className="space-y-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-1">Owner</span>
          <div className="flex items-center font-medium text-gray-900 dark:text-white">
            <UserCircle2 className="w-4 h-4 mr-2 text-gray-400" />
            {owner?.name || 'Unknown'}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-1">Department</span>
          <div className="flex items-center font-medium text-gray-900 dark:text-white">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            {department?.name || 'Unknown'}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500 text-xs mb-1">Created / Modified</span>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center font-medium text-gray-900 dark:text-white text-xs">
              <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
              Created: {formatMessageTime(selectedDocument.metadata.created)}
            </div>
            <div className="flex items-center font-medium text-gray-900 dark:text-white text-xs">
              <Clock className="w-3.5 h-3.5 mr-2 text-gray-400" />
              Modified: {formatMessageTime(selectedDocument.metadata.lastModified)}
            </div>
          </div>
        </div>

        {selectedDocument.metadata.relatedEntities.length > 0 && (
          <div className="flex flex-col pt-3 border-t border-gray-100 dark:border-ink-light">
            <span className="text-gray-500 text-xs mb-2">Related Entities</span>
            <div className="space-y-2">
              {selectedDocument.metadata.relatedEntities.map(entity => (
                <div key={entity.id} className="flex items-center font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                  <FileText className="w-3.5 h-3.5 mr-2" />
                  {entity.type}: {entity.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col pt-3 border-t border-gray-100 dark:border-ink-light">
          <span className="text-gray-500 text-xs mb-2 flex items-center">
            <Tag className="w-3 h-3 mr-1" /> Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedDocument.tags.map(tag => (
              <span key={tag.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tag.color}`}>
                {tag.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
