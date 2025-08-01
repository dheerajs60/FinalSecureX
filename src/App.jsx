import React, { useState } from 'react'
import { WalletProvider } from './contexts/WalletContext'
import { DocumentProvider } from './contexts/DocumentContext'
import { IPFSProviderProvider } from './contexts/IPFSProviderContext'
import { ToastProvider } from './components/ui/Toast'
import DashboardLayout from './components/layout/DashboardLayout'
import ErrorBoundary from './components/ErrorBoundary'
import Overview from './pages/Overview'
import Upload from './pages/Upload'
import RecentDocuments from './pages/RecentDocuments'
import IPFSSettings from './pages/IPFSSettings'
import ActivityLogs from './pages/ActivityLogs'
import DownloadCenter from './pages/DownloadCenter'
import AIDocumentChat from './pages/AIDocumentChat'
import AccessControl from './pages/AccessControl'

const App = () => {
  const [currentPage, setCurrentPage] = useState('overview')

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />
      case 'upload':
        return <Upload />
      case 'recent':
        return <RecentDocuments />
      case 'ipfs-settings':
        return <IPFSSettings />
      case 'activity':
        return <ActivityLogs />
      case 'download':
        return <DownloadCenter />
      case 'chat':
        return <AIDocumentChat />
      case 'control':
        return <AccessControl />
      default:
        return <Overview />
    }
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <IPFSProviderProvider>
          <DocumentProvider>
            <WalletProvider>
              <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
                {renderPage()}
              </DashboardLayout>
            </WalletProvider>
          </DocumentProvider>
        </IPFSProviderProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
