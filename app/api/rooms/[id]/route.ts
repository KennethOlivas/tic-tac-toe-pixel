import { NextResponse } from "next/server"
import { getRoom } from "@/lib/room-manager"

export async function GET(
  _: Request,
  context: { params: { id: string } } | Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context

    const room = await getRoom(params.id)

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: room.id,
      code: room.code,
      board: room.board,
      currentPlayer: room.currentPlayer,
      players: room.players,
    })
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}
