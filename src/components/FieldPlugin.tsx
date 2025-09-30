import React, { FunctionComponent, useState, useEffect } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import ContentTypeSelector from './ContentTypeSelector'
import PromptInput from './PromptInput'
import ContentPreview from './ContentPreview'
import type { PromptBlokContent, QuickPrompt } from '../types/content'
import { generateContent } from '../lib/content-generator'
import { handleAPIError } from '../lib/api-client'
import '../styles/voiceblok.css'

// Get context about what the user is building from Storyblok
const getStoryContext = (data: unknown): string => {
  const dataWithStory = data as { story?: { name?: string; content?: Record<string, unknown> } }
  const story = dataWithStory?.story
  if (!story) return ''
  
  const context = []
  
  // Get story name/title
  if (story.name) {
    context.push(`Story: ${story.name}`)
  }
  
  // Get story content fields
  if (story.content) {
    const contentFields = Object.entries(story.content)
      .filter(([_key, value]) => value && typeof value === 'string' && value.length > 0)
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 5) // Limit to first 5 fields to avoid token limits
    
    if (contentFields.length > 0) {
      context.push(`Content: ${contentFields.join(', ')}`)
    }
  }
  
  return context.join('\n')
}

const FieldPlugin: FunctionComponent = () => {
  const [selectedType, setSelectedType] = useState<string>('text')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const { type, data, actions } = useFieldPlugin<PromptBlokContent>({
    enablePortalModal: true,
    validateContent: (content: unknown) => {
      if (!content || typeof content !== 'object') {
        return {
          content: {
            generatedText: '',
            originalPrompt: '',
            contentType: 'text',
            timestamp: Date.now(),
          }
        }
      }
      return { content: content as PromptBlokContent }
    }
  })

  useEffect(() => {
    console.log('📊 Field plugin data changed:', data)
    if (data?.content?.contentType) {
      setSelectedType(data.content.contentType)
    }
  }, [data])

  useEffect(() => {
    console.log('🔄 Field plugin type changed:', type)
  }, [type])

  if (type !== 'loaded') return null

  const promptContent = data?.content ?? {
    generatedText: '',
    originalPrompt: '',
    contentType: 'text',
    timestamp: Date.now(),
  }

  console.log('📋 Current prompt content:', promptContent)
  console.log('📋 Generated text length:', promptContent.generatedText?.length || 0)
  console.log('📋 Has generated content:', !!promptContent.generatedText)

  const handleGenerate = async (prompt: string) => {
    console.log('🚀 Generating content with prompt:', prompt)
    console.log('📝 Selected content type:', selectedType)
    
    setIsProcessing(true)
    setError(null)
    
    try {
      // Get context about what the user is building
      const storyContext = getStoryContext(data)
      console.log('📖 Story context:', storyContext)
      
      // Build enhanced prompt with context
      const enhancedPrompt = storyContext 
        ? `${prompt}\n\nContext about what I'm building:\n${storyContext}`
        : prompt
      
      console.log('🤖 Calling Gemini AI service...')
      console.log('📝 Enhanced prompt:', enhancedPrompt)
      
      // Call real AI service
      const result = await generateContent(selectedType, enhancedPrompt)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      const generated = result.content
      console.log('✨ Generated content:', generated)
      
      const contentData = {
        generatedText: generated,
        originalPrompt: prompt,
        contentType: selectedType,
        timestamp: Date.now(),
      }
      
      console.log('💾 Setting content data:', contentData)
      await actions.setContent(contentData)
      console.log('✅ Content successfully set to field plugin')
      
      setSuccessMessage('Content generated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000) // Clear after 3 seconds
      
      // Force refresh to update the UI after a short delay
      setTimeout(() => {
        setRefreshKey(prev => prev + 1)
        console.log('🔄 Forced UI refresh')
      }, 100)
      
      // Keep the prompt visible so user can see what was used
    } catch (error) {
      console.error('❌ Failed to generate content:', error)
      const errorMessage = handleAPIError(error)
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = async (newText: string) => {
    try {
      await actions.setContent({
        ...promptContent,
        generatedText: newText,
      })
    } catch {
      setError('Failed to save edit.')
    }
  }

  const handleRegenerate = () => {
    if (promptContent.originalPrompt) {
      handleGenerate(promptContent.originalPrompt)
    }
  }

  const handleQuickPrompt = (qp: QuickPrompt) => {
    setSelectedType(qp.contentType)
    setSelectedPrompt(qp.prompt)
    // Don't auto-generate, just populate the input field
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    actions.setContent({ ...promptContent, contentType: type })
  }

  return (
    <div className="voiceblok-field-plugin voiceblok-container">
      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message mb-4">
          {successMessage}
        </div>
      )}

      <ContentTypeSelector
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        onQuickPrompt={handleQuickPrompt}
      />

      <PromptInput
        onGenerate={handleGenerate}
        disabled={isProcessing}
        placeholder="Enter your prompt..."
        value={selectedPrompt}
      />

      <ContentPreview
        key={refreshKey}
        content={promptContent.generatedText}
        originalPrompt={promptContent.originalPrompt}
        contentType={promptContent.contentType}
        onEdit={handleEdit}
        onRegenerate={handleRegenerate}
      />

      {isProcessing && (
        <div className="vb-section vb-center processing-spinner">
          ✨ Generating...
        </div>
      )}

      <div className="vb-status">
        Last updated: {new Date(promptContent.timestamp).toLocaleString()}
      </div>
    </div>
  )
}

export default FieldPlugin
