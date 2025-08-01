// Demo Data for Hackathon Presentation
// Generates realistic document data for immediate demo

export const generateDemoDocuments = () => {
  const currentTime = new Date()
  
  return [
    {
      id: 'demo-whitepaper',
      fileName: 'SecureX_Whitepaper_v2.1.pdf',
      ipfsHash: 'QmYxivMLH6QwQvksTUmaYNxfPHQDsJnNy4WhuKcMagwKNa',
      uploadDate: new Date(currentTime - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      fileSize: 2458943,
      type: 'application/pdf',
      transactionHash: '0xa5f8b4c2d9e6f1a3b7c8d2e5f9a1b4c7d8e2f5a9b1c4d7e8f2a5b9c1d4e7f8a2',
      uploader: '0x742d35Cc6506C4a9e6d29f0f9F5a8df07c9c31a5',
      status: 'completed',
      description: 'Official SecureX platform whitepaper with technical specifications',
      views: 247,
      blockNumber: 4892145
    },
    {
      id: 'demo-audit',
      fileName: 'SmartContract_Audit_Report.pdf',
      ipfsHash: 'QmPz9QVkYxHXjGxQqEH2VfP4KJ3NfRx8YyWnM2ZtA7BhQz',
      uploadDate: new Date(currentTime - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      fileSize: 1847382,
      type: 'application/pdf',
      transactionHash: '0xb6c9d5e2f8a1b4c7d8e2f5a9b1c4d7e8f2a5b9c1d4e7f8a2b5c9d6e3f8a1b4c7',
      uploader: '0x742d35Cc6506C4a9e6d29f0f9F5a8df07c9c31a5',
      status: 'completed',
      description: 'Comprehensive security audit by CertiK for smart contracts',
      views: 156,
      blockNumber: 4891823
    },
    {
      id: 'demo-roadmap',
      fileName: '2024_Development_Roadmap.docx',
      ipfsHash: 'QmRx7WfNhQ2ZvP8KJ3NfRy9YzWpM1AtB6ChQx5DgE8FjNz',
      uploadDate: new Date(currentTime - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      fileSize: 945672,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      transactionHash: '0xc7d8e2f5a9b1c4d7e8f2a5b9c1d4e7f8a2b5c9d6e3f8a1b4c7d8e2f5a9b1c4d7',
      uploader: '0x742d35Cc6506C4a9e6d29f0f9F5a8df07c9c31a5',
      status: 'completed',
      description: 'Product development roadmap and milestone planning for 2024',
      views: 89,
      blockNumber: 4891456
    },
    {
      id: 'demo-api',
      fileName: 'API_Documentation_v3.2.pdf',
      ipfsHash: 'QmTx8WgNkQ3ZwP9KL4OfSz0YaXqN2BuC7DhRy6EfG9HkOz',
      uploadDate: new Date(currentTime - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      fileSize: 1234567,
      type: 'application/pdf',
      transactionHash: '0xd8e2f5a9b1c4d7e8f2a5b9c1d4e7f8a2b5c9d6e3f8a1b4c7d8e2f5a9b1c4d7e8',
      uploader: '0x742d35Cc6506C4a9e6d29f0f9F5a8df07c9c31a5',
      status: 'completed',
      description: 'Complete API documentation for developers and integrators',
      views: 198,
      blockNumber: 4890987
    },
    {
      id: 'demo-tokenomics',
      fileName: 'Tokenomics_Model_Analysis.xlsx',
      ipfsHash: 'QmVy9XhOlR4AwQ0LM5PgT1ZbYrO3CvD8EiSz7FhJ0KlNx',
      uploadDate: new Date(currentTime - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      fileSize: 2876543,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      transactionHash: '0xe9f3a6b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6',
      uploader: '0x742d35Cc6506C4a9e6d29f0f9F5a8df07c9c31a5',
      status: 'completed',
      description: 'Economic model and token distribution analysis spreadsheet',
      views: 134,
      blockNumber: 4890345
    }
  ]
}

export const hackathonDemo = {
  projectName: 'SecureX',
  tagline: 'Decentralized Document Management Platform',
  features: [
    'Blockchain-verified document storage',
    'IPFS decentralized file system',
    'Smart contract automation',
    'AI-powered document analysis',
    'Zero-knowledge privacy',
    'Multi-chain compatibility'
  ],
  stats: {
    totalDocuments: 247,
    totalStorage: '1.2 GB',
    totalTransactions: 892,
    totalUsers: 56,
    networksSupported: 4
  },
  demoFlow: [
    'Connect Web3 wallet',
    'Upload documents to IPFS',
    'Verify on blockchain',
    'Access from anywhere',
    'AI document analysis',
    'Share with permissions'
  ]
}

export const initializeDemoData = () => {
  const existingDocuments = localStorage.getItem('securex_documents')
  
  if (!existingDocuments) {
    console.log('🎯 Initializing hackathon demo data...')
    const demoDocuments = generateDemoDocuments()
    localStorage.setItem('securex_documents', JSON.stringify(demoDocuments))
    console.log('✅ Demo data initialized with', demoDocuments.length, 'documents')
    return demoDocuments
  }
  
  try {
    const parsed = JSON.parse(existingDocuments)
    console.log('📄 Loaded existing documents:', parsed.length)
    return parsed
  } catch (error) {
    console.log('🔄 Reinitializing corrupted demo data...')
    const demoDocuments = generateDemoDocuments()
    localStorage.setItem('securex_documents', JSON.stringify(demoDocuments))
    return demoDocuments
  }
}
