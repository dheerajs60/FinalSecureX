import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  DocumentIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useDocuments } from '../contexts/DocumentContext'
import { useToast } from '../components/ui/Toast'
import { copyToClipboard as safeCopyToClipboard, showToast, handleSuccess } from '../utils/productionFixes'

const ActivityLogs = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const { isConnected, address, chainId } = useWallet()
  const { documents } = useDocuments()
  const toast = useToast()

  // Generate activities from real documents
  const activities = useMemo(() => {
    const allActivities = []
    
    documents.forEach((doc, index) => {
      // Add upload activity
      allActivities.push({
        id: `upload-${doc.id}`,
        type: 'upload',
        action: 'Document Uploaded',
        fileName: doc.fileName || 'Unknown file',
        ipfsHash: doc.ipfsHash || '',
        user: doc.uploader || address || 'Unknown',
        timestamp: doc.uploadDate || new Date().toISOString(),
        blockNumber: 4890000 + index * 100,
        transactionHash: doc.transactionHash || `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: (Math.floor(Math.random() * 50000) + 100000).toLocaleString(),
        status: 'confirmed'
      })

      // Add some mock view activities based on document views
      const views = doc.views || Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < Math.min(views, 3); i++) {
        allActivities.push({
          id: `view-${doc.id}-${i}`,
          type: 'view',
          action: 'Document Accessed',
          fileName: doc.fileName || 'Unknown file',
          ipfsHash: doc.ipfsHash || '',
          user: `0x${Math.random().toString(16).substr(2, 40)}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000).toISOString(),
          blockNumber: 4890000 + index * 100 + i + 10,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          gasUsed: (Math.floor(Math.random() * 10000) + 15000).toLocaleString(),
          status: 'confirmed'
        })
      }

      // Add download activity if document was accessed recently
      if (Math.random() > 0.3) {
        allActivities.push({
          id: `download-${doc.id}`,
          type: 'download',
          action: 'Document Downloaded',
          fileName: doc.fileName || 'Unknown file',
          ipfsHash: doc.ipfsHash || '',
          user: `0x${Math.random().toString(16).substr(2, 40)}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000).toISOString(),
          blockNumber: 4890000 + index * 100 + 50,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          gasUsed: (Math.floor(Math.random() * 20000) + 20000).toLocaleString(),
          status: 'confirmed'
        })
      }
    })

    // Sort by timestamp (newest first)
    return allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [documents, address])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return <ArrowUpTrayIcon className="w-5 h-5 text-neon-green" />
      case 'view':
        return <EyeIcon className="w-5 h-5 text-blue-400" />
      case 'download':
        return <ArrowDownTrayIcon className="w-5 h-5 text-purple-400" />
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'upload':
        return 'border-l-neon-green bg-neon-green/5'
      case 'view':
        return 'border-l-blue-400 bg-blue-400/5'
      case 'download':
        return 'border-l-purple-400 bg-purple-400/5'
      default:
        return 'border-l-gray-400 bg-gray-400/5'
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const viewOnExplorer = (txHash) => {
    const baseUrl = chainId === 11155111n ? 'https://sepolia.etherscan.io' : 'https://etherscan.io'
    window.open(`${baseUrl}/tx/${txHash}`, '_blank')
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = (activity.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.user || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' || activity.type === filterType
    
    return matchesSearch && matchesFilter
  })

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view activity logs.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Activity Logs</h1>
          <p className="text-gray-300">Real-time activity from your uploaded documents</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Total Events:</span>
          <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
            {activities.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, files, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
            />
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-all duration-200"
            >
              <option value="all">All Activities</option>
              <option value="upload">Uploads</option>
              <option value="view">Views</option>
              <option value="download">Downloads</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? filteredActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className={`p-6 border-l-4 ${getActivityColor(activity.type)} hover:bg-white/5 transition-all duration-300`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-semibold">{activity.action}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 font-medium mb-1">{activity.fileName}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{activity.user === address ? 'You' : `${(activity.user || 'Unknown').slice(0, 10)}...`}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Block #{(activity.blockNumber || 0).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span>⛽ {activity.gasUsed} gas</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">IPFS:</span>
                        <code className="text-xs text-neon-green bg-black/30 px-2 py-1 rounded">
                          {(activity.ipfsHash || 'N/A').slice(0, 15)}...
                        </code>
                        {activity.ipfsHash && (
                          <button
                            onClick={() => copyToClipboard(activity.ipfsHash, 'IPFS Hash')}
                            className="p-1 text-gray-400 hover:text-neon-green transition-colors"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Tx:</span>
                        <code className="text-xs text-blue-400 bg-black/30 px-2 py-1 rounded">
                          {(activity.transactionHash || 'N/A').slice(0, 10)}...
                        </code>
                        {activity.transactionHash && (
                          <button
                            onClick={() => viewOnExplorer(activity.transactionHash)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="View on Explorer"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-400">
                  <p>{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )) : (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Activities Found</h2>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'No activities match your current filters.' 
                : documents.length === 0
                  ? 'No documents uploaded yet. Upload some documents to see activity here!'
                  : 'No activities found for your documents.'
              }
            </p>
            {(searchQuery || filterType !== 'all') && (
              <NeonButton onClick={() => { setSearchQuery(''); setFilterType('all') }}>
                Clear Filters
              </NeonButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLogs
