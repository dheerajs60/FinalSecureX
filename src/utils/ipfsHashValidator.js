// IPFS Hash Validation Utility

export const validateIPFSHash = (hash) => {
  if (!hash || typeof hash !== 'string') {
    return {
      isValid: false,
      error: 'Hash is empty or not a string'
    }
  }

  // Remove whitespace
  const cleanHash = hash.trim()

  // Check if it's a valid IPFS CID format (lenient for demo)
  const cidV0Pattern = /^Qm[A-Za-z0-9]{44,}$/ // CIDv0 - lenient for demo
  const cidV1Pattern = /^[a-z0-9]{59,}$/ // CIDv1 (base32) - 59+ chars
  const demoPattern = /^Qm[A-Za-z0-9]{40,}$/ // Demo hash pattern

  if (cidV0Pattern.test(cleanHash)) {
    return {
      isValid: true,
      version: 'v0',
      format: 'base58',
      hash: cleanHash
    }
  }

  if (cidV1Pattern.test(cleanHash)) {
    return {
      isValid: true,
      version: 'v1',
      format: 'base32',
      hash: cleanHash
    }
  }

  if (demoPattern.test(cleanHash)) {
    return {
      isValid: true,
      version: 'v0-demo',
      format: 'demo',
      hash: cleanHash
    }
  }

  // Check for common invalid patterns
  if (cleanHash === 'No IPFS hash' || cleanHash === 'undefined' || cleanHash === 'null') {
    return {
      isValid: false,
      error: 'Placeholder or invalid hash value'
    }
  }

  if (cleanHash.length < 20) {
    return {
      isValid: false,
      error: 'Hash too short to be a valid IPFS CID'
    }
  }

  return {
    isValid: false,
    error: 'Hash does not match IPFS CID format'
  }
}

export const createSafeIPFSUrl = (hash, gateway = 'https://ipfs.io/ipfs') => {
  const validation = validateIPFSHash(hash)
  
  if (!validation.isValid) {
    throw new Error(`Invalid IPFS hash: ${validation.error}`)
  }

  return `${gateway}/${validation.hash}`
}

export const logIPFSHashStatus = (documents) => {
  console.log('🔍 IPFS Hash Validation Report:')
  
  documents.forEach((doc, index) => {
    const validation = validateIPFSHash(doc.ipfsHash)
    console.log(`📄 Document ${index + 1}: ${doc.fileName || 'Unknown'}`)
    console.log(`   Hash: ${doc.ipfsHash || 'MISSING'}`)
    console.log(`   Valid: ${validation.isValid ? '✅' : '❌'}`)
    if (!validation.isValid) {
      console.log(`   Error: ${validation.error}`)
    } else {
      console.log(`   Version: ${validation.version}`)
      console.log(`   Format: ${validation.format}`)
    }
    console.log('---')
  })
}
