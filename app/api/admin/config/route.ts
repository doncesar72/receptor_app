import { AI_CONFIG } from '@/config/ai-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')
  
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    model: AI_CONFIG.model,
    temperature: AI_CONFIG.temperature,
    maxTokens: AI_CONFIG.maxTokens,
    promptPreview: AI_CONFIG.prompts.analyzePhoto.substring(0, 150) + '...'
  })
}
