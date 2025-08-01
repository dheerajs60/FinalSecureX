import React, { createContext, useContext, useState, useEffect } from 'react'

const DocumentContext = createContext()

export const useDocuments = () => {
  const context = useContext(DocumentContext)
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load documents from localStorage on mount
  useEffect(() => {
    try {
      const savedDocuments = localStorage.getItem('securex_documents')
      if (savedDocuments) {
        const parsed = JSON.parse(savedDocuments)
        setDocuments(Array.isArray(parsed) ? parsed : [])
        console.log('📄 Loaded', parsed.length, 'documents from storage')
      } else {
        console.log('📄 No existing documents found - starting fresh')
      }
    } catch (error) {
      console.error('Error loading documents from localStorage:', error)
      setDocuments([])
    }
  }, [])

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    if (documents.length >= 0) {
      try {
        localStorage.setItem('securex_documents', JSON.stringify(documents))
      } catch (error) {
        console.error('Error saving documents to localStorage:', error)
      }
    }
  }, [documents])

  const addDocument = (document) => {
    const newDocument = {
      ...document,
      id: document.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: document.uploadDate || new Date().toISOString(),
      verified: true,
      status: 'completed'
    }
    
    setDocuments(prev => [newDocument, ...prev])
    console.log('✅ Document added:', newDocument.fileName)
    return newDocument
  }

  const updateDocument = (id, updates) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    )
  }

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const getDocumentById = (id) => {
    return documents.find(doc => doc.id === id)
  }

  const getDocumentsByType = (type) => {
    return documents.filter(doc => doc.type === type)
  }

  const searchDocuments = (query) => {
    if (!query) return documents
    
    const lowercaseQuery = query.toLowerCase()
    return documents.filter(doc =>
      (doc.fileName && doc.fileName.toLowerCase().includes(lowercaseQuery)) ||
      (doc.ipfsHash && doc.ipfsHash.toLowerCase().includes(lowercaseQuery)) ||
      (doc.description && doc.description.toLowerCase().includes(lowercaseQuery))
    )
  }

  const clearAllDocuments = () => {
    setDocuments([])
    localStorage.removeItem('securex_documents')
    console.log('🗑️ All documents cleared')
  }

  const value = {
    documents,
    isLoading,
    setIsLoading,
    addDocument,
    updateDocument,
    removeDocument,
    getDocumentById,
    getDocumentsByType,
    searchDocuments,
    clearAllDocuments,
    totalDocuments: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0),
    verifiedDocuments: documents.filter(doc => doc.verified).length
  }

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  )
}

export default DocumentContext
