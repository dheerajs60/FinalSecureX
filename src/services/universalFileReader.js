class UniversalFileReader {
  constructor() {
    this.supportedTypes = {
      text: ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'sql', 'sh', 'bat', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'log'],
      document: ['pdf', 'doc', 'docx', 'rtf', 'odt'],
      spreadsheet: ['xls', 'xlsx', 'ods', 'csv'],
      presentation: ['ppt', 'pptx', 'odp'],
      image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'],
      audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
      video: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
      archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
      code: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'r', 'matlab', 'm'],
      data: ['json', 'xml', 'csv', 'tsv', 'parquet', 'avro', 'protobuf', 'msgpack'],
      binary: ['exe', 'dll', 'so', 'dylib', 'bin', 'dat']
    }
  }

  async readFile(file) {
    try {
      const fileType = this.detectFileType(file.name)
      const content = await this.extractContent(file, fileType)
      
      return {
        success: true,
        fileName: file.name,
        fileType: fileType,
        size: file.size,
        content: content,
        metadata: await this.extractMetadata(file, fileType),
        readableText: await this.convertToReadableText(content, fileType, file)
      }
    } catch (error) {
      console.error('File reading error:', error)
      return {
        success: false,
        error: error.message,
        fileName: file.name,
        fallbackContent: `Failed to read ${file.name}. File type may not be supported or file may be corrupted.`
      }
    }
  }

  detectFileType(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    for (const [category, extensions] of Object.entries(this.supportedTypes)) {
      if (extensions.includes(extension)) {
        return { category, extension, supported: true }
      }
    }
    
    return { category: 'unknown', extension, supported: false }
  }

  async extractContent(file, fileType) {
    const { category, extension } = fileType

    switch (category) {
      case 'text':
      case 'code':
      case 'data':
        return await this.readAsText(file)
      
      case 'image':
        return await this.readImageContent(file)
      
      case 'document':
        return await this.readDocumentContent(file, extension)
      
      case 'spreadsheet':
        return await this.readSpreadsheetContent(file, extension)
      
      case 'audio':
        return await this.readAudioContent(file)
      
      case 'video':
        return await this.readVideoContent(file)
      
      case 'archive':
        return await this.readArchiveContent(file)
      
      default:
        return await this.readBinaryContent(file)
    }
  }

  async readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  async readImageContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          resolve({
            dataUrl: e.target.result,
            width: img.width,
            height: img.height,
            type: file.type,
            description: `Image file: ${file.name} (${img.width}x${img.height})`
          })
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target.result
      }
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })
  }

  async readDocumentContent(file, extension) {
    // For now, return basic info - in production you'd use libraries like pdf-parse, mammoth.js
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const arrayBuffer = e.target.result
        resolve({
          type: 'document',
          extension: extension,
          size: arrayBuffer.byteLength,
          extractedText: this.extractTextFromDocument(arrayBuffer, extension),
          description: `Document file: ${file.name} (${extension.toUpperCase()})`
        })
      }
      reader.onerror = () => reject(new Error('Failed to read document'))
      reader.readAsArrayBuffer(file)
    })
  }

  extractTextFromDocument(arrayBuffer, extension) {
    // Simplified text extraction - in production use proper libraries
    switch (extension) {
      case 'pdf':
        return 'PDF content extraction requires pdf-parse library. Content: [PDF document with text, images, and formatting]'
      case 'doc':
      case 'docx':
        return 'Word document content extraction requires mammoth.js library. Content: [Word document with formatted text and images]'
      case 'rtf':
        return 'RTF content extraction. Content: [Rich Text Format document]'
      default:
        return `Document content (${extension.toUpperCase()}) - specialized extraction needed`
    }
  }

  async readSpreadsheetContent(file, extension) {
    // In production, use libraries like xlsx, csv-parse
    if (extension === 'csv') {
      const text = await this.readAsText(file)
      return {
        type: 'spreadsheet',
        format: 'csv',
        rows: text.split('\n').length,
        preview: text.split('\n').slice(0, 10).join('\n'),
        description: `CSV file with ${text.split('\n').length} rows`
      }
    }
    
    return {
      type: 'spreadsheet',
      format: extension,
      description: `Spreadsheet file (${extension.toUpperCase()}) - use xlsx library for full parsing`
    }
  }

  async readAudioContent(file) {
    return {
      type: 'audio',
      format: file.type,
      duration: 'Unknown (requires audio analysis)',
      description: `Audio file: ${file.name} - use Web Audio API for detailed analysis`
    }
  }

  async readVideoContent(file) {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve({
          type: 'video',
          format: file.type,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          description: `Video file: ${file.name} (${video.videoWidth}x${video.videoHeight}, ${video.duration}s)`
        })
      }
      video.onerror = () => {
        resolve({
          type: 'video',
          format: file.type,
          description: `Video file: ${file.name} - metadata extraction failed`
        })
      }
      video.src = URL.createObjectURL(file)
    })
  }

  async readArchiveContent(file) {
    return {
      type: 'archive',
      format: file.name.split('.').pop(),
      description: `Archive file: ${file.name} - use jszip or similar for extraction`
    }
  }

  async readBinaryContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const arrayBuffer = e.target.result
        const uint8Array = new Uint8Array(arrayBuffer)
        const hexPreview = Array.from(uint8Array.slice(0, 100))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(' ')
        
        resolve({
          type: 'binary',
          size: arrayBuffer.byteLength,
          hexPreview: hexPreview,
          description: `Binary file: ${file.name} (${arrayBuffer.byteLength} bytes)`
        })
      }
      reader.onerror = () => reject(new Error('Failed to read binary file'))
      reader.readAsArrayBuffer(file)
    })
  }

  async extractMetadata(file, fileType) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      category: fileType.category,
      extension: fileType.extension,
      supported: fileType.supported
    }
  }

  async convertToReadableText(content, fileType, file) {
    const { category, extension } = fileType

    switch (category) {
      case 'text':
      case 'code':
        return typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      
      case 'data':
        if (extension === 'json') {
          try {
            const parsed = JSON.parse(content)
            return JSON.stringify(parsed, null, 2)
          } catch {
            return content
          }
        }
        return content
      
      case 'image':
        return `Image Analysis: This is a ${content.type} image with dimensions ${content.width}x${content.height} pixels. The image file is named "${file.name}" and contains visual content that can be analyzed for objects, text, colors, and composition.`
      
      case 'document':
        return content.extractedText || content.description
      
      case 'spreadsheet':
        return content.preview || content.description
      
      case 'audio':
        return `Audio Analysis: This is an audio file "${file.name}" of type ${file.type}. Audio content can be analyzed for speech transcription, music recognition, sound classification, and acoustic features.`
      
      case 'video':
        return `Video Analysis: This is a video file "${file.name}" with dimensions ${content.width || 'unknown'}x${content.height || 'unknown'} and duration ${content.duration || 'unknown'} seconds. Video content can be analyzed for objects, scenes, actions, text recognition, and audio transcription.`
      
      case 'archive':
        return `Archive Analysis: This is a compressed archive "${file.name}". The archive contains multiple files that can be extracted and individually analyzed.`
      
      case 'binary':
        return `Binary Analysis: This is a binary file "${file.name}" containing ${content.size} bytes of data. Binary content can be analyzed for file signatures, patterns, and structure.`
      
      default:
        return `File Analysis: "${file.name}" is a file of unknown type. The file can be analyzed based on its binary content and patterns.`
    }
  }

  getSupportedFormats() {
    return this.supportedTypes
  }

  isSupported(fileName) {
    return this.detectFileType(fileName).supported
  }
}

export default new UniversalFileReader()
