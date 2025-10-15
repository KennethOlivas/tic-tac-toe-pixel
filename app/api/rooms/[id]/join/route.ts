import { NextResponse } from "next/server"
import { addPlayerToRoom, getRoom } from "@/lib/room-manager"

export async function POST(
  request: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context
    const { playerId, playerName } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    const room = await addPlayerToRoom(params.id, playerId, playerName)

    if (!room) {
      const existingRoom = await getRoom(params.id)
      if (!existingRoom) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Room is full" }, { status: 403 })
    }

    return NextResponse.json({
      id: room.id,
      players: room.players,
      board: room.board,
      currentPlayer: room.currentPlayer,
    })
  } catch (error) {
    console.error("Error joining room:", error)
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 })
  }
}
