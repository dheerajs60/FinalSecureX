import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentIcon, 
  CloudArrowUpIcon, 
  UsersIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import IntegrationStatus from '../components/ui/IntegrationStatus'
import ContractAddressValidator from '../components/ui/ContractAddressValidator'
import { useWallet } from '../contexts/WalletContext'
import { useDocuments } from '../contexts/DocumentContext'
import { getContractConfig } from '../config/contract'
import { isValidAddress } from '../utils/addressUtils'
import { validateIPFSIntegration, displayIPFSStatus } from '../utils/ipfsValidation'

const Overview = () => {
  const { chainId, contractInitialized } = useWallet()
  const { documents, totalSize } = useDocuments()

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Generate chart data based on real documents
  const chartData = useMemo(() => {
    // Group documents by upload date for chart data
    const uploadsByDay = documents.reduce((acc, doc) => {
      const date = new Date(doc.uploadDate)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      acc[dayName] = (acc[dayName] || 0) + 1
      return acc
    }, {})

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      uploads: uploadsByDay[day] || 0,
      downloads: Math.floor((uploadsByDay[day] || 0) * 0.7) // Simulate downloads as 70% of uploads
    }))
  }, [documents])

  // Recent activity from real documents
  const recentActivity = useMemo(() => {
    return documents
      .slice(0, 4)
      .map(doc => {
        const uploadDate = new Date(doc.uploadDate)
        const now = new Date()
        const diffTime = Math.abs(now - uploadDate)
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        let timeText
        if (diffMinutes < 60) {
          timeText = diffMinutes === 0 ? 'Just now' : `${diffMinutes} minutes ago`
        } else if (diffHours < 24) {
          timeText = `${diffHours} hours ago`
        } else {
          timeText = `${diffDays} days ago`
        }

        return {
          action: 'Document uploaded',
          file: doc.fileName || 'Unknown file',
          time: timeText,
          user: doc.uploader ? `${doc.uploader.slice(0, 6)}...${doc.uploader.slice(-4)}` : 'Unknown'
        }
      })
  }, [documents])

  // Test IPFS Integration
  const testIPFSIntegration = async () => {
    console.log('🚀 Starting IPFS Integration Test...')
    displayIPFSStatus()

    const result = await validateIPFSIntegration()

    if (result.success) {
      console.log('✅ IPFS Test Results:', result)
      alert(`🎉 IPFS Integration Working!\n\n✅ Hash: ${result.ipfsHash}\n💾 Size: ${result.fileSize} bytes\n🌐 Gateway: ${result.gateway}\n📡 Accessible: ${result.accessible ? 'Yes' : 'Checking...'}\n\n${result.status}`)
    } else {
      console.error('❌ IPFS Test Failed:', result)
      alert(`❌ IPFS Integration Failed!\n\nError: ${result.error}\n\n${result.status}`)
    }
  }

  // Check if contract setup is needed
  const needsContractSetup = () => {
    if (!chainId) return false
    const config = getContractConfig(chainId)
    const isExampleAddress = config.contractAddress?.toLowerCase() === '0x742d35cc6506c4a9e6d29f0f9f5a8df07c9c31a5'
    const isInvalidAddress = !isValidAddress(config.contractAddress)
    return isExampleAddress || isInvalidAddress || !contractInitialized
  }



  const activityData = [
    { time: '00:00', activity: 5 },
    { time: '04:00', activity: 8 },
    { time: '08:00', activity: 25 },
    { time: '12:00', activity: 35 },
    { time: '16:00', activity: 42 },
    { time: '20:00', activity: 28 },
    { time: '24:00', activity: 15 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <GlassCard className="p-3 border border-white/20">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-neon-green font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </GlassCard>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="text-neon-green">SecureX</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your decentralized document management platform powered by blockchain technology
        </p>
      </motion.div>

      {/* Integration Status */}
      <IntegrationStatus />

      {/* Contract Setup Helper */}
      {needsContractSetup() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ContractAddressValidator />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={documents.length.toString()}
          change={documents.length > 0 ? "+100% from baseline" : "No documents yet"}
          trend={documents.length > 0 ? "up" : "neutral"}
          icon={DocumentIcon}
        />
        <StatCard
          title="Recent Uploads"
          value={documents.filter(doc => {
            const uploadDate = new Date(doc.uploadDate)
            const today = new Date()
            const diffTime = Math.abs(today - uploadDate)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 7
          }).length.toString()}
          change="Past 7 days"
          trend="up"
          icon={CloudArrowUpIcon}
        />
        <StatCard
          title="Storage Used"
          value={formatFileSize(totalSize)}
          change="IPFS storage"
          trend="up"
          icon={UsersIcon}
        />
        <StatCard
          title="Total Views"
          value={documents.reduce((sum, doc) => sum + (doc.views || 0), 0).toString()}
          change="All time views"
          trend="up"
          icon={EyeIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Trends */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Weekly Upload Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="uploads" 
                stroke="#00ff88" 
                strokeWidth={3}
                dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#00ff88', strokeWidth: 2 }}
                name="Uploads"
              />
              <Line 
                type="monotone" 
                dataKey="downloads" 
                stroke="#0099ff" 
                strokeWidth={3}
                dot={{ fill: '#0099ff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0099ff', strokeWidth: 2 }}
                name="Downloads"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Activity Timeline */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#00ff88"
                strokeWidth={3}
                fill="url(#activityGradient)"
                name="Activity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.file}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">{activity.time}</p>
                <p className="text-gray-500 text-xs">{activity.user}</p>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-8 text-gray-400">
              <DocumentIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity. Upload some documents to see activity here!</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}

export default Overview
