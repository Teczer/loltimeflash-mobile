import { Ionicons } from '@expo/vector-icons'
import { memo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useRouter, type Href } from 'expo-router'

import { Button } from '@/components/ui'
import { SectionCard } from '@/features/lanegap/components'
import {
  useCreateEnemyNote,
  useDeleteNote,
  useEnemyNotes,
  useUpdateNote,
} from '@/features/lanegap/hooks/use-notes.hook'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { useAuthStore } from '@/stores/auth.store'
import type { IUserNote } from '@/features/lanegap/api/notes.api'

interface IPersonalNotesProps {
  championId: string
}

const NoteItem = memo(
  (props: { note: IUserNote; onDelete: () => void; onUpdate: (content: string) => void }) => {
    const { note, onDelete, onUpdate } = props
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(note.content)

    const handleSave = () => {
      if (editContent.trim()) {
        onUpdate(editContent.trim())
        setIsEditing(false)
      }
    }

    const handleDelete = () => {
      Alert.alert(t.notes.deleteNote, t.notes.deleteNoteConfirm, [
        { text: t.auth.cancel, style: 'cancel' },
        { text: t.notes.deleteNote, style: 'destructive', onPress: onDelete },
      ])
    }

    if (isEditing) {
      return (
        <View className="gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <TextInput
            value={editContent}
            onChangeText={setEditContent}
            multiline
            style={{
              color: colors.foreground,
              fontSize: 14,
              minHeight: 60,
              textAlignVertical: 'top',
            }}
            autoFocus
          />
          <View className="flex-row justify-end gap-2">
            <Pressable
              onPress={() => {
                setEditContent(note.content)
                setIsEditing(false)
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5"
            >
              <Text className="font-sans text-foreground text-sm">
                {t.auth.cancel}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="rounded-lg bg-gold/20 px-3 py-1.5"
            >
              <Text className="font-sans-medium text-gold text-sm">
                {t.notes.saved}
              </Text>
            </Pressable>
          </View>
        </View>
      )
    }

    return (
      <View className="flex-row items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <Text className="text-foreground font-sans flex-1 text-sm leading-5">
          {note.content}
        </Text>
        <View className="flex-row gap-1">
          <Pressable
            onPress={() => setIsEditing(true)}
            hitSlop={8}
            className="rounded-md p-1 active:bg-white/10"
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            hitSlop={8}
            className="rounded-md p-1 active:bg-white/10"
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={colors.danger}
            />
          </Pressable>
        </View>
      </View>
    )
  },
)

NoteItem.displayName = 'NoteItem'

const PersonalNotesComponent = (props: IPersonalNotesProps) => {
  const { championId } = props
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { data: notes, isLoading } = useEnemyNotes(championId)
  const createMutation = useCreateEnemyNote()
  const updateMutation = useUpdateNote()
  const deleteMutation = useDeleteNote()

  const [newNote, setNewNote] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    try {
      await createMutation.mutateAsync({
        championId,
        content: newNote.trim(),
      })
      setNewNote('')
      setIsAdding(false)
    } catch {
      Alert.alert(t.game.error)
    }
  }

  if (!isAuthenticated) {
    return (
      <SectionCard
        title={t.notes.myNotes}
        icon="document-text-outline"
        iconColor={colors.gold}
        isEmpty
      >
        <Pressable
          onPress={() => router.push('/profile' as Href)}
          className="items-center gap-2 py-4"
        >
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground font-sans text-center text-sm">
            {t.notes.signInForNotes}
          </Text>
          <Text className="font-sans-medium text-gold text-sm">
            {t.auth.signIn}
          </Text>
        </Pressable>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title={t.notes.myNotes}
      icon="document-text-outline"
      iconColor={colors.gold}
      isEmpty={!isLoading && !notes?.length && !isAdding}
      headerRight={
        <Pressable
          onPress={() => setIsAdding(true)}
          className="rounded-lg bg-gold/20 px-2.5 py-1"
        >
          <Text className="font-sans-medium text-gold text-xs">
            + {t.notes.addNote}
          </Text>
        </Pressable>
      }
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.gold} />
      ) : (
        <View className="gap-3">
          {isAdding && (
            <View className="gap-2 rounded-xl border border-gold/30 bg-gold/5 p-3">
              <TextInput
                value={newNote}
                onChangeText={setNewNote}
                placeholder={t.notes.notePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                multiline
                autoFocus
                style={{
                  color: colors.foreground,
                  fontSize: 14,
                  minHeight: 60,
                  textAlignVertical: 'top',
                }}
              />
              <View className="flex-row justify-end gap-2">
                <Pressable
                  onPress={() => {
                    setNewNote('')
                    setIsAdding(false)
                  }}
                  className="rounded-lg bg-white/10 px-3 py-1.5"
                >
                  <Text className="font-sans text-foreground text-sm">
                    {t.auth.cancel}
                  </Text>
                </Pressable>
                <Button
                  size="sm"
                  onPress={handleAddNote}
                  disabled={createMutation.isPending || !newNote.trim()}
                >
                  {createMutation.isPending ? t.game.fetching : t.notes.addNote}
                </Button>
              </View>
            </View>
          )}

          {notes?.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={() => deleteMutation.mutate(note.id)}
              onUpdate={(content) =>
                updateMutation.mutate({ noteId: note.id, content })
              }
            />
          ))}

          {!isAdding && (!notes || notes.length === 0) && (
            <Text className="text-muted-foreground py-2 text-center text-sm">
              {t.notes.noNotes}
            </Text>
          )}
        </View>
      )}
    </SectionCard>
  )
}

export const PersonalNotes = memo(PersonalNotesComponent)
