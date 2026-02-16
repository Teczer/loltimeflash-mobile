import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import { TIER_COLORS, TIER_LABELS, type TTier } from '@/features/lanegap/types'

const TIERS_TO_SHOW: TTier[] = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'B-', 'C']

export const TierLegend = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className="size-7 items-center justify-center rounded-full active:bg-white/10"
      >
        <Ionicons
          name="information-circle-outline"
          size={20}
          color="rgba(255,255,255,0.4)"
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/60"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="mx-6 w-[90%] rounded-xl border border-white/10 bg-[#1a1824]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between border-b border-white/10 px-4 py-3">
              <Text className="text-base font-bold text-white">
                Tier Legend
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                className="size-7 items-center justify-center rounded-full active:bg-white/10"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
              </Pressable>
            </View>

            <View className="gap-1 p-3">
              {TIERS_TO_SHOW.map((tier) => (
                <View
                  key={tier}
                  className="flex-row items-center gap-3 rounded-lg px-2 py-2"
                >
                  <View
                    className="size-8 items-center justify-center rounded-lg border border-white/20"
                    style={{ backgroundColor: TIER_COLORS[tier] }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color:
                          tier === 'S+' ? colors.background : colors.foreground,
                      }}
                    >
                      {tier}
                    </Text>
                  </View>

                  <Text className="flex-1 text-sm text-white/70">
                    {TIER_LABELS[tier]}
                  </Text>
                </View>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}
