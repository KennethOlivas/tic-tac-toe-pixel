"use client"

import { useEffect, useRef, useState } from "react"
import { useGameStore } from "@/stores/game-store"
import { WebSocketManager } from "@/lib/websocket-manager"

export function useOnlineGame(roomId: string) {
  const wsRef = useRef<WebSocketManager | null>(null)
  const [connected, setConnected] = useState(false)
  const [playerId] = useState(() => `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  const { board, currentPlayer, setLocalPlayerId, updateBoard, gameMode, setGameStatus } = useGameStore()

  useEffect(() => {
    if (gameMode !== "online") return

    // Initialize WebSocket connection
    const ws = new WebSocketManager(roomId)
    wsRef.current = ws

    // Connect to room
    ws.connect(playerId)
      .then(() => {
        setConnected(true)
        setLocalPlayerId(playerId)
        setGameStatus("playing")

        // Join the room via API
        fetch(`/api/rooms/${roomId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        })
      })
      .catch((error) => {
        console.error("Failed to connect:", error)
      })

    // Listen for game events via localStorage (cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `ws_${roomId}` && e.newValue) {
        try {
          const message = JSON.parse(e.newValue)
          if (message.event === "move" && message.data) {
            const { board: newBoard, currentPlayer: newPlayer } = message.data
            updateBoard(newBoard, newPlayer)
          }
        } catch (error) {
          console.error("Error parsing storage event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      ws.disconnect()
    }
  }, [roomId, playerId, gameMode, setLocalPlayerId, updateBoard, setGameStatus])

  const makeOnlineMove = (index: number) => {
    if (!wsRef.current || !connected) return

    // Make move locally
    const newBoard = [...board]
    newBoard[index] = currentPlayer
    const nextPlayer = currentPlayer === "X" ? "O" : "X"

    // Update local state
    updateBoard(newBoard, nextPlayer)

    // Broadcast move to other players
    wsRef.current.emit("move", {
      board: newBoard,
      currentPlayer: nextPlayer,
    })

    // Update room on server
    fetch(`/api/rooms/${roomId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: newBoard,
        currentPlayer: nextPlayer,
      }),
    }).catch((error) => {
      console.error("Error updating room:", error)
    })
  }

  return {
    connected,
    playerId,
    makeOnlineMove,
  }
}
