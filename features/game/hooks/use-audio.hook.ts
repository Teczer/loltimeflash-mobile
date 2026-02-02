import { useAudioPlayer } from 'expo-audio'
import { useCallback, useEffect, useState } from 'react'

import { AUDIO_VOLUME } from '@/features/game/constants/game.constants'
import { storage } from '@/lib/mmkvStorage'

const VOLUME_STORAGE_KEY = 'volume'

// Audio source for Flash sound
const FLASH_SOUND = require('@/assets/audio/flash-song.mp3')

interface IUseAudioReturn {
  play: () => Promise<void>
  isPlaying: boolean
  volume: 'on' | 'off'
  toggleVolume: () => void
}

/**
 * Audio hook for playing Flash sound
 * Uses expo-audio for audio playback (SDK 54+)
 */
export const useAudio = (): IUseAudioReturn => {
  const player = useAudioPlayer(FLASH_SOUND)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState<'on' | 'off'>('on')

  // Load volume from MMKV on mount
  useEffect(() => {
    const savedVolume = storage.getString(VOLUME_STORAGE_KEY) as
      | 'on'
      | 'off'
      | undefined
    if (savedVolume) {
      setVolume(savedVolume)
    }
  }, [])

  // Set player volume
  useEffect(() => {
    if (player) {
      player.volume = AUDIO_VOLUME
    }
  }, [player])

  // Listen for playback status changes
  useEffect(() => {
    if (!player) return

    const subscription = player.addListener(
      'playingChange',
      ({ isPlaying: playing }) => {
        setIsPlaying(playing)
      }
    )

    return () => {
      subscription.remove()
    }
  }, [player])

  const play = useCallback(async (): Promise<void> => {
    if (volume === 'off' || !player) return

    try {
      // Seek to beginning before playing (expo-audio doesn't auto-reset)
      player.seekTo(0)
      player.play()
    } catch (error) {
      console.warn('Error playing audio:', error)
    }
  }, [volume, player])

  const toggleVolume = useCallback((): void => {
    const newVolume = volume === 'on' ? 'off' : 'on'
    setVolume(newVolume)
    storage.set(VOLUME_STORAGE_KEY, newVolume)
  }, [volume])

  return {
    play,
    isPlaying,
    volume,
    toggleVolume,
  }
}
