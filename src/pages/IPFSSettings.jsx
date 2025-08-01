import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CogIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../components/ui/GlassCard'
import NeonButton from '../components/ui/NeonButton'
import { useToast } from '../components/ui/Toast'
import { useIPFSProvider } from '../contexts/IPFSProviderContext'

const IPFSSettings = () => {
  const [customProvider, setCustomProvider] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [testing, setTesting] = useState(false)
  const { provider, setProvider, testProvider, getProviderStats } = useIPFSProvider()
  const toast = useToast()

  const defaultProviders = [
    {
      name: 'IPFS.io Gateway',
      url: 'https://ipfs.io/ipfs',
      type: 'gateway',
      free: true,
      description: 'Public IPFS gateway - free and reliable'
    },
    {
      name: 'Pinata Gateway',
      url: 'https://gateway.pinata.cloud/ipfs',
      type: 'gateway', 
      free: true,
      description: 'Fast and reliable IPFS gateway'
    },
    {
      name: 'NFT.Storage',
      url: 'https://api.nft.storage/upload',
      type: 'api',
      free: true,
      description: 'Free decentralized storage for NFTs'
    },
    {
      name: 'Web3.Storage',
      url: 'https://api.web3.storage/upload',
      type: 'api',
      free: true,
      description: 'Decentralized storage built on IPFS'
    }
  ]

  const handleProviderSelect = (providerConfig) => {
    setProvider(providerConfig)
    toast.success(`Switched to ${providerConfig.name}`)
  }

  const handleCustomProvider = async () => {
    if (!customProvider) {
      toast.error('Please enter a provider URL')
      return
    }

    setTesting(true)
    
    try {
      const customConfig = {
        name: 'Custom Provider',
        url: customProvider,
        type: customProvider.includes('/upload') ? 'api' : 'gateway',
        apiKey: apiKey || undefined,
        custom: true
      }

      const testResult = await testProvider(customConfig)
      
      if (testResult.success) {
        setProvider(customConfig)
        toast.success('Custom provider added successfully!')
        setCustomProvider('')
        setApiKey('')
      } else {
        toast.error(`Provider test failed: ${testResult.error}`)
      }
    } catch (error) {
      toast.error(`Failed to add custom provider: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  const testCurrentProvider = async () => {
    setTesting(true)
    try {
      const result = await testProvider(provider)
      if (result.success) {
        toast.success('Provider is working correctly!')
      } else {
        toast.error(`Provider test failed: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Test failed: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <CogIcon className="w-8 h-8 text-neon-green" />
          <span>IPFS Provider Settings</span>
        </h1>
        <p className="text-gray-300">Configure your IPFS storage provider for uploads and downloads</p>
      </div>

      {/* Current Provider Status */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <CheckCircleIcon className="w-6 h-6 text-green-400" />
          <span>Current Provider</span>
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div>
            <h3 className="text-white font-semibold">{provider.name}</h3>
            <p className="text-gray-400 text-sm">{provider.url}</p>
            <p className="text-green-400 text-xs mt-1">
              {provider.type === 'api' ? '🔐 API Provider' : '🌐 Gateway Provider'} 
              {provider.free ? ' • FREE' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={testCurrentProvider}
              disabled={testing}
              className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Provider Selection */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Available Providers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {defaultProviders.map((providerConfig, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                provider.url === providerConfig.url
                  ? 'bg-neon-green/20 border-neon-green/30'
                  : 'bg-white/5 border-white/20 hover:border-white/40'
              }`}
              onClick={() => handleProviderSelect(providerConfig)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{providerConfig.name}</h3>
                {provider.url === providerConfig.url && (
                  <CheckCircleIcon className="w-5 h-5 text-neon-green" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-2">{providerConfig.description}</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`px-2 py-1 rounded ${
                  providerConfig.type === 'api' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {providerConfig.type.toUpperCase()}
                </span>
                {providerConfig.free && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">FREE</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Custom Provider */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <PlusIcon className="w-6 h-6 text-neon-green" />
          <span>Add Custom Provider</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Provider URL *
            </label>
            <input
              type="url"
              value={customProvider}
              onChange={(e) => setCustomProvider(e.target.value)}
              placeholder="https://api.nft.storage/upload or https://gateway.example.com/ipfs"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter gateway URL (for viewing) or API URL (for uploading)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key (optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key if required"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-all"
            />
          </div>
          
          <NeonButton
            onClick={handleCustomProvider}
            loading={testing}
            disabled={!customProvider}
            className="w-full"
          >
            {testing ? 'Testing Provider...' : 'Add Custom Provider'}
          </NeonButton>
        </div>
      </GlassCard>

      {/* Provider Stats */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Provider Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-gray-400 text-sm">Total Uploads</h3>
            <p className="text-2xl font-bold text-white">{getProviderStats().uploads}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-gray-400 text-sm">Success Rate</h3>
            <p className="text-2xl font-bold text-green-400">{getProviderStats().successRate}%</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h3 className="text-gray-400 text-sm">Total Storage</h3>
            <p className="text-2xl font-bold text-blue-400">{getProviderStats().totalStorage}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default IPFSSettings
