import { NextResponse } from "next/server"
import { updateRoomBoard } from "@/lib/room-manager"
import type { Board } from "@/lib/game-logic"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { board, currentPlayer } = await request.json()

    if (!board || !currentPlayer) {
      return NextResponse.json(
        { error: "Board and currentPlayer are required" },
        { status: 400 }
      )
    }

    const room = await updateRoomBoard(params.id, board as Board, currentPlayer)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({
      board: room.board,
      currentPlayer: room.currentPlayer,
    })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}
