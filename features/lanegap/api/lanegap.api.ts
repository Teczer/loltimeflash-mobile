import { pb } from '@/features/lanegap/lib/pocketbase'
import type {
  IEnemyChampion,
  IItemSpike,
  ILevelSpike,
  IPBChampion,
  IPBCounter,
  IPBItemSpike,
  IPBLevelSpike,
  TTier,
} from '@/features/lanegap/types'

// =============================================================================
// Fetch Enemy Champion Data
// =============================================================================

export async function fetchEnemyChampion(
  championId: string
): Promise<IEnemyChampion | null> {
  try {
    // Fetch all data in parallel
    const [allChampions, levelSpikes, itemSpikes, counters] = await Promise.all(
      [
        pb.collection('champions').getFullList<IPBChampion>(),
        pb.collection('level_spikes').getFullList<IPBLevelSpike>(),
        pb.collection('item_spikes').getFullList<IPBItemSpike>(),
        pb.collection('counters').getFullList<IPBCounter>(),
      ]
    )

    // Find the champion by champion_id
    const champion = allChampions.find(
      (c) => c.champion_id.toLowerCase() === championId.toLowerCase()
    )

    if (!champion) return null

    // Create lookup map: PB id -> champion_id
    const championIdMap = new Map<string, string>()
    for (const c of allChampions) {
      championIdMap.set(c.id, c.champion_id)
    }

    // Get level spikes for this champion
    const championLevelSpikes: ILevelSpike[] = levelSpikes
      .filter(
        (spike) => championIdMap.get(spike.champion) === champion.champion_id
      )
      .map((spike) => ({
        level: spike.level,
        text: { en: spike.text_en, fr: spike.text_fr },
        important: spike.important,
      }))
      .sort((a, b) => a.level - b.level)

    // Get item spikes for this champion
    const championItemSpikes: IItemSpike[] = itemSpikes
      .filter(
        (spike) => championIdMap.get(spike.champion) === champion.champion_id
      )
      .map((spike) => ({
        itemId: spike.item_id,
        text: { en: spike.text_en, fr: spike.text_fr },
      }))

    // Get counters for this champion (champions that are good AGAINST this enemy)
    const championCounters: { championId: string; tier: TTier }[] = counters
      .filter(
        (counter) =>
          championIdMap.get(counter.champion) === champion.champion_id
      )
      .map((counter) => ({
        championId: championIdMap.get(counter.counter_champion) || '',
        tier: counter.tier,
      }))
      .filter((c) => c.championId)

    // Sort counters by tier
    const tierOrder: TTier[] = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'B-', 'C']
    championCounters.sort(
      (a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier)
    )

    return {
      id: champion.champion_id,
      name: { en: champion.name_en, fr: champion.name_fr },
      dateEdited: champion.date_edited,
      tips: { en: champion.tips_en || [], fr: champion.tips_fr || [] },
      levelSpikes: championLevelSpikes,
      itemSpikes: championItemSpikes,
      counters: championCounters,
    }
  } catch (error) {
    console.error('Error fetching enemy champion:', error)
    return null
  }
}
