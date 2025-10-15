import { NextResponse } from "next/server"
import { validateRoomCode } from "@/lib/room-manager"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const isValid = await validateRoomCode(roomId, code)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Error validating code:", error)
    return NextResponse.json({ error: "Failed to validate code" }, { status: 500 })
  }
}
