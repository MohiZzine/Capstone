export interface VoiceMessage {
  id: string
  type: 'user' | 'assistant'
  text: string
  time: string
  audioUrl?: string
}

export interface VoiceCommand {
  intent: string
  entities: Record<string, any>
  confidence: number
}