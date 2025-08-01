import { ethers } from 'ethers'
import { CONTRACT_ABI, getContractConfig } from '../config/contract'
import { getChecksumAddress, isValidAddress } from '../utils/addressUtils'

class ContractService {
  constructor() {
    this.contract = null
    this.provider = null
    this.signer = null
  }

  // Initialize contract with wallet provider
  async initialize(provider, signer, chainId) {
    try {
      this.provider = provider
      this.signer = signer

      const config = getContractConfig(chainId)

      // Validate and checksum the contract address
      if (!isValidAddress(config.contractAddress)) {
        console.warn(`Invalid contract address in configuration: ${config.contractAddress}. Running in demo mode.`)
        // Set contract to null for demo mode
        this.contract = null
        return true
      }

      const checksummedAddress = getChecksumAddress(config.contractAddress)

      this.contract = new ethers.Contract(
        checksummedAddress,
        CONTRACT_ABI,
        signer
      )

      console.log('Contract initialized:', config.contractAddress)
      return true
    } catch (error) {
      console.error('Contract initialization failed:', error)
      console.warn('Running in demo mode without contract functionality')
      this.contract = null
      return true
    }
  }

  // Upload document to blockchain
  async uploadDocument(fileName, ipfsHash, fileSize) {
    if (!this.contract) {
      console.log('Demo mode: Simulating blockchain upload')
      // Return mock transaction for demo mode
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        documentId: Math.floor(Math.random() * 1000),
        gasUsed: '21000'
      }
    }

    try {
      console.log('Uploading document to blockchain...', { fileName, ipfsHash, fileSize })
      
      // Estimate gas for the transaction
      const gasEstimate = await this.contract.uploadDocument.estimateGas(
        fileName,
        ipfsHash,
        fileSize
      )
      
      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate * 120n / 100n
      
      const tx = await this.contract.uploadDocument(
        fileName,
        ipfsHash,
        fileSize,
        { gasLimit }
      )
      
      console.log('Transaction sent:', tx.hash)
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      
      // Extract document ID from event logs
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log)
          return parsed.name === 'DocumentUploaded'
        } catch {
          return false
        }
      })
      
      let documentId = null
      if (event) {
        const parsed = this.contract.interface.parseLog(event)
        documentId = parsed.args.documentId
      }
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        documentId: documentId ? Number(documentId) : null,
        gasUsed: receipt.gasUsed.toString()
      }
    } catch (error) {
      console.error('Upload to blockchain failed:', error)
      throw new Error(`Blockchain upload failed: ${error.message}`)
    }
  }

  // Get user's documents
  async getUserDocuments(userAddress) {
    if (!this.contract) {
      console.log('Demo mode: Returning mock documents')
      // Return mock documents for demo
      return [
        {
          id: 1,
          fileName: 'Demo_Document.pdf',
          ipfsHash: 'QmDemo123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz8',
          uploader: userAddress,
          timestamp: Date.now() / 1000,
          fileSize: 1024000,
          uploadDate: new Date().toISOString()
        }
      ]
    }

    try {
      console.log('Fetching user documents for:', userAddress)
      
      const documentIds = await this.contract.getUserDocuments(userAddress)
      const documents = []
      
      for (const id of documentIds) {
        try {
          const doc = await this.contract.getDocument(id)
          
          if (doc.isActive) {
            documents.push({
              id: Number(id),
              fileName: doc.fileName,
              ipfsHash: doc.ipfsHash,
              uploader: doc.uploader,
              timestamp: Number(doc.timestamp),
              fileSize: Number(doc.fileSize),
              uploadDate: new Date(Number(doc.timestamp) * 1000).toISOString()
            })
          }
        } catch (error) {
          console.error(`Error fetching document ${id}:`, error)
        }
      }
      
      // Sort by timestamp (newest first)
      documents.sort((a, b) => b.timestamp - a.timestamp)
      
      console.log('Fetched documents:', documents)
      return documents
    } catch (error) {
      console.error('Error fetching user documents:', error)
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }
  }

  // Get single document by ID
  async getDocument(documentId) {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const doc = await this.contract.getDocument(documentId)
      
      if (!doc.isActive) {
        throw new Error('Document not found or inactive')
      }
      
      return {
        id: documentId,
        fileName: doc.fileName,
        ipfsHash: doc.ipfsHash,
        uploader: doc.uploader,
        timestamp: Number(doc.timestamp),
        fileSize: Number(doc.fileSize),
        uploadDate: new Date(Number(doc.timestamp) * 1000).toISOString()
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      throw new Error(`Failed to fetch document: ${error.message}`)
    }
  }

  // Get total document count
  async getDocumentCount() {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const count = await this.contract.getDocumentCount()
      return Number(count)
    } catch (error) {
      console.error('Error fetching document count:', error)
      throw new Error(`Failed to fetch document count: ${error.message}`)
    }
  }

  // Listen for contract events
  setupEventListeners(callback) {
    if (!this.contract) {
      console.error('Contract not initialized for event listeners')
      return
    }

    // Listen for DocumentUploaded events
    this.contract.on('DocumentUploaded', (documentId, uploader, fileName, ipfsHash, event) => {
      callback({
        type: 'DocumentUploaded',
        documentId: Number(documentId),
        uploader,
        fileName,
        ipfsHash,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      })
    })

    // Listen for DocumentViewed events
    this.contract.on('DocumentViewed', (documentId, viewer, timestamp, event) => {
      callback({
        type: 'DocumentViewed',
        documentId: Number(documentId),
        viewer,
        timestamp: Number(timestamp),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash
      })
    })
  }

  // Remove event listeners
  removeEventListeners() {
    if (this.contract) {
      this.contract.removeAllListeners()
    }
  }

  // Get contract address for current network
  getContractAddress() {
    if (!this.provider) return null
    
    return this.contract?.target || this.contract?.address
  }
}

// Create singleton instance
export const contractService = new ContractService()
export default contractService
