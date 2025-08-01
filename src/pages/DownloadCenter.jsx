import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowDownTrayIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useDocuments } from '../contexts/DocumentContext'
import { useToast } from '../components/ui/Toast'
import { copyToClipboard as safeCopyToClipboard, showToast, handleSuccess } from '../utils/productionFixes'
import realIpfsService from '../services/realIpfsService'

const DownloadCenter = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [downloadStatus, setDownloadStatus] = useState({})
  const { isConnected, address } = useWallet()
  const { documents } = useDocuments()
  const toast = useToast()

  // Helper function to determine MIME type from file extension
  const getMimeType = (fileName) => {
    if (!fileName) return 'application/octet-stream'
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return 'application/pdf'
      case 'doc': case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      case 'txt': return 'text/plain'
      case 'jpg': case 'jpeg': return 'image/jpeg'
      case 'png': return 'image/png'
      default: return 'application/octet-stream'
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄'
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return '📄'
      case 'doc': case 'docx': return '📝'
      case 'txt': return '📃'
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️'
      case 'zip': case 'rar': return '📦'
      case 'mp4': case 'avi': case 'mov': return '🎥'
      case 'mp3': case 'wav': return '🎵'
      default: return '📄'
    }
  }

  const copyToClipboard = async (text, type) => {
    try {
      const success = await safeCopyToClipboard(text, type)
      if (success) {
        handleSuccess(`${type} copied to clipboard!`)
      }
    } catch (err) {
      console.error('Copy error:', err)
      handleSuccess(`${type} copy dialog opened`)
    }
  }

  const downloadFromIPFS = async (document) => {
    if (!document.ipfsHash) {
      toast.error('No IPFS hash available for this document')
      return
    }

    setDownloadStatus(prev => ({ ...prev, [document.id]: 'downloading' }))

    try {
      console.log('Starting download:', document.fileName, document.ipfsHash)

      // Use real IPFS service to download the file
      const result = await realIpfsService.downloadFile(document.ipfsHash, document.fileName)

      if (result.success) {
        setDownloadStatus(prev => ({ ...prev, [document.id]: 'completed' }))
        toast.success(`${document.fileName} downloaded successfully!`)
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setDownloadStatus(prev => ({ ...prev, [document.id]: null }))
        }, 3000)
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadStatus(prev => ({ ...prev, [document.id]: 'failed' }))
      toast.error(`Download failed: ${error.message}`)
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [document.id]: null }))
      }, 3000)
    }
  }

  const viewOnIPFS = (hash) => {
    if (!hash) {
      toast.error('No IPFS hash available')
      return
    }
    window.open(`https://ipfs.io/ipfs/${hash}`, '_blank')
    toast.success('Opening document on IPFS')
  }

  const getDownloadButtonState = (documentId) => {
    const status = downloadStatus[documentId]
    switch (status) {
      case 'downloading':
        return { text: 'Downloading...', disabled: true, className: 'bg-blue-500/20 text-blue-400' }
      case 'completed':
        return { text: 'Downloaded ✓', disabled: true, className: 'bg-green-500/20 text-green-400' }
      case 'failed':
        return { text: 'Failed ��', disabled: false, className: 'bg-red-500/20 text-red-400' }
      default:
        return { text: 'Download', disabled: false, className: '' }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc =>
    (doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.ipfsHash || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ArrowDownTrayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to access the download center.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Download Center</h1>
          <p className="text-gray-300">Download your documents directly from IPFS</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <FolderIcon className="w-5 h-5" />
          <span>{documents.length} {documents.length === 1 ? 'Document' : 'Documents'}</span>
        </div>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents or IPFS hashes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
          />
        </div>
      </GlassCard>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{getFileIcon(doc.fileName)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{doc.fileName || 'Unknown File'}</h3>
                    <p className="text-gray-400 text-sm">{formatFileSize(doc.fileSize)}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Upload Date:</span>
                    <span className="text-xs text-gray-300">{formatDate(doc.uploadDate)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">IPFS CID:</span>
                    <button
                      onClick={() => copyToClipboard(doc.ipfsHash, 'IPFS Hash')}
                      className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                      title="Copy IPFS hash"
                    >
                      <LinkIcon className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <code className="block text-xs text-neon-green bg-black/30 p-2 rounded break-all">
                    {doc.ipfsHash || 'No IPFS hash'}
                  </code>
                </div>

                <div className="space-y-3">
                  <NeonButton
                    onClick={() => downloadFromIPFS(doc)}
                    disabled={getDownloadButtonState(doc.id).disabled}
                    className={`w-full ${getDownloadButtonState(doc.id).className}`}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    {getDownloadButtonState(doc.id).text}
                  </NeonButton>
                  
                  <button
                    onClick={() => viewOnIPFS(doc.ipfsHash)}
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View on IPFS</span>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No Matching Documents' : 'No Documents Available'}
          </h2>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? 'No documents match your search criteria.' 
              : documents.length === 0
                ? 'Upload some documents first to download them here.'
                : 'No documents available for download.'
            }
          </p>
          {searchQuery && (
            <NeonButton onClick={() => setSearchQuery('')}>
              Clear Search
            </NeonButton>
          )}
        </div>
      )}

      {/* Download Instructions */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Download Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">Direct Download</h4>
            <p>Click the "Download" button to fetch files directly from IPFS to your device.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">IPFS Gateway</h4>
            <p>Use "View on IPFS" to access files through the IPFS gateway in your browser.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Copy CID</h4>
            <p>Click the link icon to copy the IPFS Content Identifier for use in other applications.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default DownloadCenter
