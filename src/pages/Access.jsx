import React from 'react'
import { motion } from 'framer-motion'
import { DocumentIcon, EyeIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useDocuments } from '../contexts/DocumentContext'
import { useToast } from '../components/ui/Toast'
import realIpfsService from '../services/realIpfsService'
import bulletproofIpfs from '../services/bulletproofIpfs'
import { validateIPFSHash, createSafeIPFSUrl, logIPFSHashStatus } from '../utils/ipfsHashValidator'

const Access = () => {
  const { documents } = useDocuments()
  const toast = useToast()

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const viewOnIPFS = (ipfsHash, fileName) => {
    console.log('🔍 Attempting to view on IPFS:', { ipfsHash, fileName })

    const validation = validateIPFSHash(ipfsHash)

    if (!validation.isValid) {
      console.error('❌ Invalid IPFS hash:', validation.error)
      toast.error(`Invalid IPFS hash: ${validation.error}`)
      return
    }

    try {
      const url = createSafeIPFSUrl(validation.hash)
      console.log('✅ Opening valid IPFS URL:', url)
      window.open(url, '_blank')
      toast.success(`Opening ${fileName || 'document'} on IPFS`)
    } catch (error) {
      console.error('❌ Failed to create IPFS URL:', error)
      toast.error(`Failed to open IPFS link: ${error.message}`)
    }
  }

  const downloadFromIPFS = async (document) => {
    if (!document.ipfsHash || document.ipfsHash === 'No IPFS hash') {
      toast.error('No valid IPFS hash available for download')
      return
    }

    try {
      toast.info('Starting download from IPFS...')
      await bulletproofIpfs.downloadFile(document.ipfsHash, document.fileName)
      toast.success(`${document.fileName} downloaded successfully!`)
    } catch (error) {
      console.error('Download failed:', error)
      toast.error(`Download failed: ${error.message}`)
    }
  }

  const copyToClipboard = async (text, type) => {
    if (!text || text === 'No IPFS hash') {
      showToast('No valid content to copy', 'warning')
      return
    }

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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Documents</h1>
        <p className="text-gray-300">Manage and access your uploaded documents</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Your Documents</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Document</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">IPFS Hash</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Upload Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Views</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {documents.length > 0 ? documents.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="w-6 h-6 text-neon-green" />
                        <div>
                          <p className="text-white font-medium">{doc.fileName || 'Unknown Document'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
                        {doc.ipfsHash || 'No IPFS hash'}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'Unknown date'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{formatFileSize(doc.fileSize)}</td>
                    <td className="px-6 py-4 text-gray-300">{doc.views || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewOnIPFS(doc.ipfsHash, doc.fileName)}
                          disabled={!doc.ipfsHash}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            doc.ipfsHash
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                          title={doc.ipfsHash ? "View on IPFS" : "No IPFS hash available"}
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadFromIPFS(doc)}
                          disabled={!doc.ipfsHash}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            doc.ipfsHash
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                          title={doc.ipfsHash ? "Download from IPFS" : "No IPFS hash available"}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(doc.ipfsHash, 'IPFS Hash')}
                          disabled={!doc.ipfsHash}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            doc.ipfsHash
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                          title={doc.ipfsHash ? "Copy IPFS hash" : "No IPFS hash available"}
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Documents Found</h3>
                      <p className="text-gray-400">Upload some documents first to see them here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default Access
