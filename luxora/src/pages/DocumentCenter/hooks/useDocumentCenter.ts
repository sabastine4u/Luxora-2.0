import { useState, useMemo } from 'react';
import { MOCK_DOCUMENTS, MOCK_FOLDERS, MOCK_VERSIONS, MOCK_AUDIT_LOGS, MOCK_APPROVALS, MOCK_SHARING } from '../data/mockData';
import type { DocumentWorkspace } from '../constants/documentConstants';
import type { Document, FolderNode } from '../types/documentTypes';

export const useDocumentCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<DocumentWorkspace>('dashboard');
  
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  const [folders] = useState<FolderNode[]>(MOCK_FOLDERS);
  const [versions] = useState(MOCK_VERSIONS);
  const [auditLogs] = useState(MOCK_AUDIT_LOGS);
  const [approvals] = useState(MOCK_APPROVALS);
  const [shares] = useState(MOCK_SHARING);

  const [currentFolderId, setCurrentFolderId] = useState<string | null>('folder-root');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const selectedDocument = useMemo(() => 
    documents.find(d => d.id === selectedDocumentId) || null
  , [documents, selectedDocumentId]);

  const currentFolder = useMemo(() => 
    folders.find(f => f.id === currentFolderId) || null
  , [folders, currentFolderId]);

  const filteredDocuments = useMemo(() => {
    let result = documents;

    // Filter by folder (unless searching globally)
    if (searchQuery.trim() === '') {
      result = result.filter(d => d.folderId === currentFolderId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.tags.some(t => t.name.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [documents, currentFolderId, searchQuery]);

  return {
    // State
    activeWorkspace,
    setActiveWorkspace,
    documents,
    folders,
    currentFolderId,
    setCurrentFolderId,
    selectedDocumentId,
    setSelectedDocumentId,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    
    // Derived
    selectedDocument,
    currentFolder,
    filteredDocuments,
    versions,
    auditLogs,
    approvals,
    shares,
    
    // Metrics
    metrics: {
      totalDocuments: documents.length,
      storageUsedBytes: documents.reduce((acc, doc) => acc + doc.sizeBytes, 0),
      pendingApprovals: approvals.filter(a => a.status === 'Pending').length,
      sharedFiles: documents.filter(d => d.isShared).length
    }
  };
};
