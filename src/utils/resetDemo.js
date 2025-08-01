// Quick utility to reset demo data with proper IPFS hashes

export const resetDemoData = () => {
  console.log('🔄 Resetting demo data with proper IPFS hashes...')
  
  // Clear existing data
  localStorage.removeItem('securex_documents')
  
  // Force page refresh to reinitialize with proper hashes
  window.location.reload()
}

// Auto-reset if bad hashes detected
export const checkAndFixHashes = () => {
  try {
    const documents = JSON.parse(localStorage.getItem('securex_documents') || '[]')
    
    // Check for bad hashes (containing invalid characters)
    const hasBadHashes = documents.some(doc => 
      doc.ipfsHash && (
        doc.ipfsHash.includes('0') || 
        doc.ipfsHash.includes('O') || 
        doc.ipfsHash.includes('I') || 
        doc.ipfsHash.includes('l') ||
        doc.ipfsHash.length < 46
      )
    )
    
    if (hasBadHashes) {
      console.log('⚠️ Bad IPFS hashes detected, resetting...')
      resetDemoData()
    }
  } catch (error) {
    console.log('🔄 Corrupted data detected, resetting...')
    resetDemoData()
  }
}
