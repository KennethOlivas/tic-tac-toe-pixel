import { type Board, resetGame } from "./game-logic"
import redis from "@/lib/redis"

export interface Room {
  id: string
  code: string
  board: Board
  currentPlayer: "X" | "O"
  players: Array<{
    id: string
    symbol: "X" | "O"
    name?: string
  }>
  createdAt: number
  lastActivity: number
}

// TTL en segundos (30 minutos)
const ROOM_TTL = 30 * 60

// Generate a 6-character room code
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // Exclude similar looking chars
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  console.log("Generated room code:", code)
  return code
}

// Generate a unique room ID
export function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Create a new room
export async function createRoom(): Promise<Room> {
  const id = generateRoomId()
  const code = generateRoomCode()

  console.log("Creating room with ID:", id, "and code:", code)

  const room: Room = {
    id,
    code,
    board: resetGame(),
    currentPlayer: "X",
    players: [],
    createdAt: Date.now(),
    lastActivity: Date.now(),
  }

  await redis.set(`room:${id}`, JSON.stringify(room), { EX: ROOM_TTL })
  return room
}

// Get room by ID
export async function getRoom(id: string): Promise<Room | null> {
  const roomStr = await redis.get(`room:${id}`)
  if (!roomStr) return null
  const room: Room = JSON.parse(roomStr)
  return room
}

// Update room (board, players, lastActivity)
export async function updateRoom(room: Room): Promise<void> {
  room.lastActivity = Date.now()
  await redis.set(`room:${room.id}`, JSON.stringify(room), { EX: ROOM_TTL })
}

// Validate room code
export async function validateRoomCode(id: string, code: string): Promise<boolean> {
  const room = await getRoom(id)
  return room?.code === code
}

// Add player to room
export async function addPlayerToRoom(
  roomId: string,
  playerId: string,
  playerName?: string
): Promise<Room | null> {
  const room = await getRoom(roomId)
  if (!room) return null

  if (room.players.length >= 2) return null
  if (room.players.some((p) => p.id === playerId)) return room

  const symbol = room.players.length === 0 ? "X" : "O"

  room.players.push({ id: playerId, symbol, name: playerName })
  await updateRoom(room)
  return room
}

// Update room board
export async function updateRoomBoard(
  roomId: string,
  board: Board,
  currentPlayer: "X" | "O"
): Promise<Room | null> {
  const room = await getRoom(roomId)
  if (!room) return null

  room.board = board
  room.currentPlayer = currentPlayer
  await updateRoom(room)
  return room
}

// Cleanup expired rooms (optional, Redis TTL handles this automatically)
export async function cleanupExpiredRooms(): Promise<number> {
  return 0
}
