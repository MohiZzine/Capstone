export interface Player {
  id: string
  name: string
  number: string
  position: string
  team: string
  photo?: string
  enrolled: boolean
  enrollmentImages?: string[]
}

export interface PlayerStats {
  playerId: string
  matchId: string
  distanceCovered: number
  topSpeed: number
  touches: number
  passes: {
    total: number
    accurate: number
    accuracy: number
  }
  shots: {
    total: number
    onTarget: number
  }
  tackles: number
  interceptions: number
  rating: number
}