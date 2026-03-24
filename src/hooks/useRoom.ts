'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Room, Player, getSavedPlayerId } from '@/lib/roomService'

export function useRoom(code: string | null) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)

  const fetchRoom = useCallback(async () => {
    if (!code) return
    const { data, error: err } = await supabase
      .from('rooms')
      .select()
      .eq('code', code.toUpperCase())
      .single()
    if (err) setError('الغرفة غير موجودة')
    else setRoom(data as Room)
    setLoading(false)
  }, [code])

  useEffect(() => {
    if (!code) return

    const id = getSavedPlayerId(code)
    setPlayerId(id)

    fetchRoom()

    const channel = supabase
      .channel(`room_${code.toUpperCase()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `code=eq.${code.toUpperCase()}`,
        },
        (payload) => {
          if (payload.new) {
            setRoom(payload.new as Room)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [code, fetchRoom])

  const currentPlayer: Player | null =
    room?.players?.find((p) => p.id === playerId) ?? null

  const isHost = currentPlayer?.isHost ?? false

  return { room, loading, error, playerId, currentPlayer, isHost, refetch: fetchRoom }
}
