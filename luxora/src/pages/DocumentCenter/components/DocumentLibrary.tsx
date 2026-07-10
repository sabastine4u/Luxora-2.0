import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { DocumentCard } from './DocumentCard';
import { AssetCard } from './AssetCard';
import { UploadCenter } from './UploadCenter';
import { FolderOpen } from 'lucide-react';
import type { Document } from '../types/documentTypes';

export const DocumentLibrary = () => {
  const { filteredDocuments, viewMode, setSelectedDocumentId, currentFolder } = useDocumentCenter();

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocumentId(doc.id);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FolderOpen className="w-5 h-5 mr-3 text-gold-500" />
            {currentFolder ? currentFolder.name : 'Search Results'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'item' : 'items'} found.
          </p>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <UploadCenter />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col space-y-2'}>
          {filteredDocuments.map(doc => (
            doc.category === 'Property Images' || doc.category === 'Marketing' ? (
              <AssetCard key={doc.id} document={doc} onClick={handleDocumentClick} />
            ) : (
              <DocumentCard key={doc.id} document={doc} onClick={handleDocumentClick} viewMode={viewMode} />
            )
          ))}
        </div>
      )}
    </div>
  );
};
