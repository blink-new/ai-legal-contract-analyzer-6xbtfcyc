import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/types/contract'
import { JURISDICTIONS } from '@/types/contractGeneration'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'

interface UploadZoneProps {
  onUpload: (content: string, language: string, title: string, jurisdiction?: string) => void
  isAnalyzing: boolean
  uploadProgress?: number
  analysisProgress?: number
  currentStep?: string
}

export function UploadZone({ onUpload, isAnalyzing, uploadProgress = 0, analysisProgress = 0, currentStep = '' }: UploadZoneProps) {
  const { t } = useLanguage()
  const [dragActive, setDragActive] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US')
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleFile = useCallback(async (file: File) => {
    const supportedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]
    
    const supportedExtensions = ['.txt', '.md', '.pdf', '.docx', '.doc']
    
    const isSupported = supportedTypes.includes(file.type) || 
                       supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!isSupported) {
      alert('Please upload a supported file: PDF, Word (.docx, .doc), or text (.txt, .md)')
      return
    }

    try {
      let text = ''
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        text = await file.text()
      } else {
        // For PDF and Word files, we'll use Blink's data extraction
        const extractedText = await blink.data.extractFromBlob(file)
        text = typeof extractedText === 'string' ? extractedText : extractedText.join('\n')
      }
      
      if (!text.trim()) {
        alert('Could not extract text from the file. Please try a different file.')
        return
      }
      
      onUpload(text, selectedLanguage, file.name, selectedJurisdiction)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing file. Please try again.')
    }
  }, [onUpload, selectedLanguage, selectedJurisdiction])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleTextSubmit = () => {
    if (!textContent.trim()) return
    onUpload(textContent, selectedLanguage, 'Pasted Contract', selectedJurisdiction)
    setTextContent('')
  }

  return (
    <div className="space-y-6">
      {/* Language and Jurisdiction Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">{t('contractLanguage')}</label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Contract Jurisdiction:</label>
          <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JURISDICTIONS.map((jurisdiction) => (
                <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                  <span className="flex items-center space-x-2">
                    <span>{jurisdiction.flag}</span>
                    <span>{jurisdiction.name}</span>
                  </span>
                </SelectItem>
              ))}
              {/* Additional jurisdictions */}
              <SelectItem value="BR">
                <span className="flex items-center space-x-2">
                  <span>🇧🇷</span>
                  <span>Brazil</span>
                </span>
              </SelectItem>
              <SelectItem value="PT">
                <span className="flex items-center space-x-2">
                  <span>🇵🇹</span>
                  <span>Portugal</span>
                </span>
              </SelectItem>
              <SelectItem value="ES">
                <span className="flex items-center space-x-2">
                  <span>🇪🇸</span>
                  <span>Spain</span>
                </span>
              </SelectItem>
              <SelectItem value="DE">
                <span className="flex items-center space-x-2">
                  <span>🇩🇪</span>
                  <span>Germany</span>
                </span>
              </SelectItem>
              <SelectItem value="FR">
                <span className="flex items-center space-x-2">
                  <span>🇫🇷</span>
                  <span>France</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMode('file')}
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('uploadFile')}
        </Button>
        <Button
          variant={uploadMode === 'text' ? 'default' : 'outline'}
          onClick={() => setUploadMode('text')}
          size="sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          {t('pasteText')}
        </Button>
      </div>

      {uploadMode === 'file' ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-12 text-center">
            {isAnalyzing ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="text-lg font-medium">{currentStep || t('analyzingContract')}</p>
                <div className="w-full max-w-md space-y-2">
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Processing document...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </>
                  )}
                  {analysisProgress > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>AI Analysis...</span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">{t('analyzingDescription')}</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('uploadContract')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('dragDropText')}
                </p>
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.docx,.doc"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {t('chooseFile')}
                  </label>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, Word (.docx, .doc), Text (.txt, .md)
                </p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Textarea
            placeholder={t('pasteContractText')}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[200px]"
            disabled={isAnalyzing}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!textContent.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              t('analyzeContract')
            )}
          </Button>
        </div>
      )}
    </div>
  )
}