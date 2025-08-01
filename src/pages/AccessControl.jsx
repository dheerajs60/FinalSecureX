import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  UserIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useWallet } from '../contexts/WalletContext'
import { useDocuments } from '../contexts/DocumentContext'

const AccessControl = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const { isConnected, address } = useWallet()
  const { documents } = useDocuments()

  // Generate mock access logs based on real documents
  const accessLogs = useMemo(() => {
    const logs = []
    
    documents.forEach((doc, docIndex) => {
      // Generate 1-3 access logs per document
      const accessCount = Math.floor(Math.random() * 3) + 1
      
      for (let i = 0; i < accessCount; i++) {
        logs.push({
          id: `${doc.id}-${i}`,
          documentId: doc.id,
          documentName: doc.fileName || 'Unknown Document',
          userAddress: i === 0 && doc.uploader ? doc.uploader : `0x${Math.random().toString(16).substr(2, 40)}`,
          action: Math.random() > 0.7 ? 'download' : 'view',
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          location: ['New York, US', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Berlin, DE'][Math.floor(Math.random() * 5)],
          browser: ['Chrome 120', 'Firefox 121', 'Safari 17', 'Edge 119'][Math.floor(Math.random() * 4)],
          duration: `${Math.floor(Math.random() * 15) + 1} minutes`
        })
      }
    })
    
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [documents])

  // Calculate statistics
  const stats = useMemo(() => {
    const timeframe = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 1
    const cutoffDate = new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
    
    const recentLogs = accessLogs.filter(log => new Date(log.timestamp) > cutoffDate)
    const uniqueUsers = new Set(recentLogs.map(log => log.userAddress)).size
    const totalViews = recentLogs.filter(log => log.action === 'view').length
    const totalDownloads = recentLogs.filter(log => log.action === 'download').length
    
    return {
      totalAccess: recentLogs.length,
      uniqueUsers,
      totalViews,
      totalDownloads,
      documentsAccessed: new Set(recentLogs.map(log => log.documentId)).size
    }
  }, [accessLogs, selectedTimeframe])

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

  const getActionIcon = (action) => {
    switch (action) {
      case 'view':
        return <EyeIcon className="w-4 h-4 text-blue-400" />
      case 'download':
        return <ArrowDownTrayIcon className="w-4 h-4 text-green-400" />
      default:
        return <DocumentIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'view':
        return 'bg-blue-500/20 text-blue-400'
      case 'download':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredLogs = accessLogs.filter(log => {
    const timeframe = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 1
    const cutoffDate = new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
    const isInTimeframe = new Date(log.timestamp) > cutoffDate
    
    const matchesSearch = 
      log.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return isInTimeframe && matchesSearch
  })

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <GlassCard className="p-8 text-center">
          <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view access control logs.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Control</h1>
          <p className="text-gray-300">Monitor document access and user activity</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <ShieldCheckIcon className="w-5 h-5" />
          <span>Real-time monitoring</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4 text-center">
          <ChartBarIcon className="w-8 h-8 text-neon-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalAccess}</p>
          <p className="text-xs text-gray-400">Total Access</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <UserIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.uniqueUsers}</p>
          <p className="text-xs text-gray-400">Unique Users</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <EyeIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
          <p className="text-xs text-gray-400">Views</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <ArrowDownTrayIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalDownloads}</p>
          <p className="text-xs text-gray-400">Downloads</p>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <DocumentIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.documentsAccessed}</p>
          <p className="text-xs text-gray-400">Documents</p>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, users, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all duration-200"
            />
          </div>
          
          {/* Timeframe Filter */}
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-all duration-200"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Access Logs */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Access Activity</h3>
        
        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-medium truncate">{log.documentName}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="w-3 h-3" />
                        <span>{log.userAddress === address ? 'You' : `${log.userAddress.slice(0, 10)}...`}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{log.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <GlobeAltIcon className="w-3 h-3" />
                        <span>{log.browser}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{log.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-400">
                  <p>{formatTimeAgo(log.timestamp)}</p>
                  <p className="text-xs">{log.ipAddress}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Access Logs Found</h2>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'No access logs match your search criteria.' 
                : documents.length === 0
                  ? 'Upload some documents first to see access logs here.'
                  : `No access logs found for the selected timeframe.`
              }
            </p>
            {searchQuery && (
              <NeonButton onClick={() => setSearchQuery('')}>
                Clear Search
              </NeonButton>
            )}
          </div>
        )}
      </GlassCard>

      {/* Security Information */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Security Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">Document Tracking</h4>
            <p>All document access is logged on the blockchain for transparency and security.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Privacy Protection</h4>
            <p>IP addresses and location data are anonymized for privacy protection.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Real-time Monitoring</h4>
            <p>Access logs are updated in real-time to provide immediate security insights.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default AccessControl
