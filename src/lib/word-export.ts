// Word document export functionality
// This uses the docx library to create Word documents with proper formatting

export interface WordExportOptions {
  title: string
  content: string
  language?: string
  includeAnalysis?: boolean
  riskAssessments?: any[]
  summary?: string
  keyTopics?: string[]
}

export const exportToWord = async (options: WordExportOptions): Promise<Blob> => {
  // Create a simple HTML-based Word document
  // This approach ensures compatibility without external dependencies
  
  const {
    title,
    content,
    language = 'English',
    includeAnalysis = false,
    riskAssessments = [],
    summary,
    keyTopics = []
  } = options

  const currentDate = new Date().toLocaleDateString()
  
  // Create HTML content that Word can import
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.5;
          margin: 1in;
          color: #000;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
        }
        .title {
          font-size: 18pt;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 12pt;
          color: #666;
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563EB;
          border-bottom: 1px solid #2563EB;
          padding-bottom: 5px;
        }
        .content {
          text-align: justify;
          margin-bottom: 15px;
        }
        .risk-item {
          margin: 15px 0;
          padding: 10px;
          border-left: 4px solid #ccc;
          background-color: #f9f9f9;
        }
        .risk-high {
          border-left-color: #dc2626;
        }
        .risk-medium {
          border-left-color: #f59e0b;
        }
        .risk-low {
          border-left-color: #16a34a;
        }
        .risk-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .risk-category {
          font-size: 10pt;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .risk-description {
          margin-bottom: 10px;
        }
        .risk-recommendation {
          background-color: #eff6ff;
          padding: 8px;
          border-radius: 4px;
          font-style: italic;
        }
        .topic-list {
          list-style-type: disc;
          margin-left: 20px;
        }
        .topic-item {
          margin: 5px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
          font-size: 10pt;
          color: #666;
          text-align: center;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
        <div class="subtitle">
          ${language !== 'English' ? `Translated to ${language} • ` : ''}
          Generated on ${currentDate} • AI Legal Contract Analyzer
        </div>
      </div>

      ${summary ? `
        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div class="content">${summary}</div>
        </div>
      ` : ''}

      ${keyTopics.length > 0 ? `
        <div class="section">
          <div class="section-title">Key Topics</div>
          <ul class="topic-list">
            ${keyTopics.map(topic => `<li class="topic-item">${topic}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Contract Content${language !== 'English' ? ` (${language})` : ''}</div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
      </div>

      ${includeAnalysis && riskAssessments.length > 0 ? `
        <div class="section page-break">
          <div class="section-title">Risk Analysis</div>
          ${riskAssessments.map(risk => `
            <div class="risk-item risk-${risk.category}">
              <div class="risk-category" style="color: ${
                risk.category === 'high' ? '#dc2626' : 
                risk.category === 'medium' ? '#f59e0b' : '#16a34a'
              }">
                ${risk.category.toUpperCase()} RISK
              </div>
              <div class="risk-title">${risk.title}</div>
              <div class="risk-description">${risk.description}</div>
              ${risk.recommendation ? `
                <div class="risk-recommendation">
                  <strong>Recommendation:</strong> ${risk.recommendation}
                </div>
              ` : ''}
              ${risk.section ? `
                <div style="font-size: 10pt; color: #666; margin-top: 8px;">
                  Reference: ${risk.section}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="footer">
        <p>This document was generated by AI Legal Contract Analyzer</p>
        <p>For professional legal advice, please consult with a qualified attorney</p>
        <p>© ${new Date().getFullYear()} AI Legal Contract Analyzer. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  // Convert HTML to Blob that can be saved as .docx
  const blob = new Blob([htmlContent], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  })

  return blob
}

export const downloadWordDocument = async (options: WordExportOptions) => {
  try {
    const blob = await exportToWord(options)
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Generate filename
    const sanitizedTitle = options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const languageSuffix = options.language && options.language !== 'English' 
      ? `_${options.language.toLowerCase()}` 
      : ''
    const filename = `${sanitizedTitle}${languageSuffix}_${Date.now()}.doc`
    
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return { success: true, filename }
  } catch (error) {
    console.error('Error exporting to Word:', error)
    return { success: false, error: error.message }
  }
}