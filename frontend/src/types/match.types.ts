export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  score: {
    home: number
    away: number
  }
  date: Date
  competition: string
  duration: string
  thumbnail?: string
  status: 'completed' | 'processing' | 'failed'
  processingProgress?: number
  videoUrl?: string
}

export interface MatchAnalysis {
  matchId: string
  formations: Formation[]
  heatmaps: HeatMap[]
  events: MatchEvent[]
  tactics: TacticalPattern[]
}

export interface Formation {
  id: string
  name: string
  timestamp: number
  players: PlayerPosition[]
}

export interface PlayerPosition {
  playerId: string
  x: number
  y: number
  role: string
}

export interface HeatMap {
  playerId: string
  data: Array<{ x: number; y: number; intensity: number }>
}

export interface MatchEvent {
  id: string
  type: 'goal' | 'foul' | 'corner' | 'substitution' | 'shot' | 'save'
  minute: number
  additionalTime?: number
  player?: {
    id: string
    name: string
    number: string
    position: string
  }
  description: string
  metadata?: Record<string, any>
  hasClip: boolean
}

export interface TacticalPattern {
  id: string
  type: string
  description: string
  frequency: number
  effectiveness: number
}