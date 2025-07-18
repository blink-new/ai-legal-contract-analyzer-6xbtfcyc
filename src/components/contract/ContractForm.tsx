import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Globe, 
  AlertTriangle, 
  Info,
  Eye,
  EyeOff
} from 'lucide-react'
import { JURISDICTIONS } from '@/types/contractGeneration'
import type { ContractTemplate, ContractField } from '@/types/contractGeneration'

interface ContractFormProps {
  template: ContractTemplate
  jurisdiction: string
  onJurisdictionChange: (jurisdiction: string) => void
  onSubmit: (data: Record<string, any>) => void
  isGenerating: boolean
}

export function ContractForm({ 
  template, 
  jurisdiction, 
  onJurisdictionChange, 
  onSubmit, 
  isGenerating 
}: ContractFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const selectedJurisdiction = JURISDICTIONS.find(j => j.code === jurisdiction)

  useEffect(() => {
    // Calculate form completion percentage
    const requiredFields = template.fields.filter(field => field.required)
    const completedFields = requiredFields.filter(field => {
      const value = formData[field.name]
      return value !== undefined && value !== '' && value !== null
    })
    setCompletionPercentage((completedFields.length / requiredFields.length) * 100)
  }, [formData, template.fields])

  const handleFieldChange = (field: ContractField, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }))

    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors(prev => ({
        ...prev,
        [field.name]: ''
      }))
    }
  }

  const validateField = (field: ContractField, value: any): string => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`
    }

    if (field.validation) {
      const { min, max, pattern, message } = field.validation
      
      if (field.type === 'number') {
        const numValue = Number(value)
        if (min !== undefined && numValue < min) {
          return message || `${field.label} must be at least ${min}`
        }
        if (max !== undefined && numValue > max) {
          return message || `${field.label} must be at most ${max}`
        }
      }

      if (pattern && typeof value === 'string') {
        const regex = new RegExp(pattern)
        if (!regex.test(value)) {
          return message || `${field.label} format is invalid`
        }
      }
    }

    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    
    // Validate all fields
    template.fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    }
  }

  const renderField = (field: ContractField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]

    // Check if field should be shown based on dependencies
    if (field.dependsOn) {
      const dependentValue = formData[field.dependsOn.field]
      const requiredValues = Array.isArray(field.dependsOn.value) 
        ? field.dependsOn.value 
        : [field.dependsOn.value]
      
      if (!requiredValues.includes(dependentValue)) {
        return null
      }
    }

    const baseClasses = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? 'border-red-500' : 'border-gray-300'
    }`

    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
          />
        )}
        
        {field.type === 'textarea' && (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseClasses}
          />
        )}
        
        {field.type === 'select' && (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={baseClasses}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        
        {field.type === 'multi-select' && (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(value as string[])?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = (value as string[]) || []
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value)
                    handleFieldChange(field, newValues)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
        
        {field.type === 'number' && (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={baseClasses}
          />
        )}
        
        {field.type === 'date' && (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={baseClasses}
          />
        )}
        
        {field.type === 'checkbox' && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{field.label}</span>
          </label>
        )}
        
        {field.helpText && (
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <Info className="h-3 w-3" />
            <span>{field.helpText}</span>
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-600 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{template.name}</span>
                    <Badge variant={template.complexity === 'simple' ? 'default' : 
                                 template.complexity === 'medium' ? 'secondary' : 'destructive'}>
                      {template.complexity}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Form Completion</span>
                  <span className="font-medium">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Jurisdiction Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Jurisdiction <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => onJurisdictionChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {JURISDICTIONS.filter(j => template.jurisdictions.includes(j.code)).map(j => (
                      <option key={j.code} value={j.code}>
                        {j.flag} {j.name} ({j.currency})
                      </option>
                    ))}
                  </select>
                  {selectedJurisdiction?.specificRequirements && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Jurisdiction Requirements:</strong>
                        <ul className="mt-1 list-disc list-inside text-sm">
                          {selectedJurisdiction.specificRequirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Dynamic Form Fields */}
                <div className="space-y-6">
                  {template.fields.map(renderField)}
                </div>

                {/* Special Terms */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Special Terms or Modifications (Optional)
                  </label>
                  <textarea
                    value={formData.special_terms || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_terms: e.target.value }))}
                    placeholder="Any specific clauses or modifications you'd like to include..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Document Objective */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Document Objective (Optional)
                  </label>
                  <textarea
                    value={formData.objective || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="Describe the main objective or purpose of this contract..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isGenerating || completionPercentage < 100}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating Contract...
                    </>
                  ) : (
                    'Generate Contract'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated Pages:</span>
                <span className="font-medium">{template.estimatedPages}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium">${(template.estimatedPages * 0.80).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Risk Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Key Risk Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {template.riskAreas.map((risk, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Jurisdiction Info */}
          {selectedJurisdiction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Jurisdiction Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedJurisdiction.flag}</span>
                  <div>
                    <p className="font-medium">{selectedJurisdiction.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedJurisdiction.legalSystem} • {selectedJurisdiction.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Preview Toggle */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p className="text-gray-600 mb-2">Contract preview will appear here as you fill out the form...</p>
                  {Object.keys(formData).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium">{String(value).substring(0, 20)}...</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}