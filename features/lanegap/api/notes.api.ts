import { pb } from '@/features/lanegap/lib/pocketbase'

export interface IUserNote {
  id: string
  user: string
  champion_id: string | null
  my_champion_id: string | null
  enemy_champion_id: string | null
  content: string
  created: string
  updated: string
}

interface IPBUserNote {
  id: string
  user: string
  champion_id: string
  my_champion_id: string
  enemy_champion_id: string
  content: string
  created: string
  updated: string
}

function mapNote(record: IPBUserNote): IUserNote {
  return {
    id: record.id,
    user: record.user,
    champion_id: record.champion_id || null,
    my_champion_id: record.my_champion_id || null,
    enemy_champion_id: record.enemy_champion_id || null,
    content: record.content,
    created: record.created,
    updated: record.updated,
  }
}

export async function fetchEnemyNotes(
  userId: string,
  championId: string,
): Promise<IUserNote[]> {
  const records = await pb
    .collection('user_notes')
    .getFullList<IPBUserNote>({
      filter: `user = "${userId}" && champion_id = "${championId}" && my_champion_id = ""`,
      sort: '-created',
    })

  return records.map(mapNote)
}

export async function createNote(data: {
  user: string
  champion_id?: string
  my_champion_id?: string
  enemy_champion_id?: string
  content: string
}): Promise<IUserNote> {
  const record = await pb.collection('user_notes').create<IPBUserNote>({
    user: data.user,
    champion_id: data.champion_id || '',
    my_champion_id: data.my_champion_id || '',
    enemy_champion_id: data.enemy_champion_id || '',
    content: data.content,
  })

  return mapNote(record)
}

export async function updateNote(
  noteId: string,
  content: string,
): Promise<IUserNote> {
  const record = await pb
    .collection('user_notes')
    .update<IPBUserNote>(noteId, { content })

  return mapNote(record)
}

export async function deleteNote(noteId: string): Promise<void> {
  await pb.collection('user_notes').delete(noteId)
}
