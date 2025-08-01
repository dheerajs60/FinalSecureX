import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyIcon, EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'
import NeonButton from './NeonButton'
import aiProviderService from '../../services/aiProviderService'

const ApiKeyConfig = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState({})
  const [showKeys, setShowKeys] = useState({})
  const [savedKeys, setSavedKeys] = useState({})

  const providers = aiProviderService.getProviders()

  const handleKeyChange = (providerId, value) => {
    setApiKeys(prev => ({ ...prev, [providerId]: value }))
  }

  const saveKey = (providerId) => {
    const key = apiKeys[providerId]
    if (key && key.trim()) {
      aiProviderService.setApiKey(providerId, key.trim())
      setSavedKeys(prev => ({ ...prev, [providerId]: true }))
      setTimeout(() => setSavedKeys(prev => ({ ...prev, [providerId]: false })), 2000)
    }
  }

  const toggleShowKey = (providerId) => {
    setShowKeys(prev => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <KeyIcon className="w-6 h-6 text-neon-green" />
              <span>AI Provider API Keys</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-400 mb-6">
            Configure API keys for different AI providers. Keys are stored locally in your browser.
          </p>

          <div className="space-y-4">
            {Object.entries(providers).map(([providerId, provider]) => {
              if (!provider.requiresKey || providerId === 'local') return null

              return (
                <div key={providerId} className="border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{provider.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {provider.models.slice(0, 2).join(', ')}
                        {provider.models.length > 2 && ` +${provider.models.length - 2} more`}
                      </p>
                    </div>
                    {provider.multimodal && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
                        Multimodal
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        type={showKeys[providerId] ? 'text' : 'password'}
                        value={apiKeys[providerId] || ''}
                        onChange={(e) => handleKeyChange(providerId, e.target.value)}
                        placeholder={`Enter ${provider.name} API key...`}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-green transition-colors pr-10"
                      />
                      <button
                        onClick={() => toggleShowKey(providerId)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showKeys[providerId] ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <NeonButton
                      onClick={() => saveKey(providerId)}
                      disabled={!apiKeys[providerId]?.trim()}
                      size="sm"
                      className="px-4"
                    >
                      {savedKeys[providerId] ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        'Save'
                      )}
                    </NeonButton>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    <p>Get your API key from: 
                      {providerId === 'openai' && <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">OpenAI Platform</a>}
                      {providerId === 'anthropic' && <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Anthropic Console</a>}
                      {providerId === 'google' && <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Google AI Studio</a>}
                      {providerId === 'cohere' && <a href="https://dashboard.cohere.ai/api-keys" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Cohere Dashboard</a>}
                      {providerId === 'huggingface' && <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Hugging Face</a>}
                      {providerId === 'replicate' && <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Replicate</a>}
                      {providerId === 'together' && <a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Together AI</a>}
                      {providerId === 'groq' && <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Groq Console</a>}
                      {providerId === 'perplexity' && <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Perplexity</a>}
                      {providerId === 'fireworks' && <a href="https://fireworks.ai/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline ml-1">Fireworks AI</a>}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm">
              🔒 <strong>Security Note:</strong> API keys are stored locally in your browser and never sent to our servers. 
              For production use, consider implementing server-side API key management.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <NeonButton onClick={onClose}>
              Done
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

export default ApiKeyConfig
