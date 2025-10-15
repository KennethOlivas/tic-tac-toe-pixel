// WebSocket manager for real-time multiplayer
// In production, use Socket.IO or a proper WebSocket server

export type GameEvent =
  | { type: "player-joined"; playerId: string; symbol: "X" | "O" }
  | { type: "move"; index: number; symbol: "X" | "O" }
  | { type: "game-reset" }
  | { type: "player-left"; playerId: string }

export class WebSocketManager {
  private ws: WebSocket | null = null
  private roomId: string
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(roomId: string) {
    this.roomId = roomId
  }

  connect(playerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In production, use wss:// and proper WebSocket server
        // For now, we'll simulate with a simple connection
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
        const wsUrl = `${protocol}//${window.location.host}/ws?room=${this.roomId}&player=${playerId}`

        // Note: This is a placeholder. In production, you'd need a proper WebSocket server
        // For the demo, we'll use a polling mechanism instead
        // console.log("WebSocket connection simulated for room:", this.roomId)
        resolve()
      } catch (error) {
        console.error("WebSocket connection error:", error)
        reject(error)
      }
    })
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)
  }

  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, data: any): void {
    // In production, send to WebSocket server


    // For demo, we'll use localStorage for cross-tab communication
    const message = { event, data, roomId: this.roomId, timestamp: Date.now() }
    localStorage.setItem(`ws_${this.roomId}`, JSON.stringify(message))
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }
}
