export interface PerformanceMetrics {
  xG: number
  possession: number
  passAccuracy: number
  pressingIntensity: number
  shots: number
  shotsOnTarget: number
}

export interface TeamAnalytics {
  matchId: string
  team: 'home' | 'away'
  metrics: PerformanceMetrics
  trends: TrendData[]
}

export interface TrendData {
  date: Date
  value: number
  metric: string
}