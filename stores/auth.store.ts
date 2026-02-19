import type { RecordModel } from 'pocketbase'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { pb } from '@/features/lanegap/lib/pocketbase'
import { mmkvStorage } from '@/lib/mmkvStorage'
import { useUserStore } from '@/stores/user.store'

export interface IUser {
  id: string
  email: string
  name: string
  avatar?: string
  created: string
  verified: boolean
}

interface IAuthState {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  _hasHydrated: boolean
}

export interface ILoginParams {
  email: string
  password: string
}

export interface IRegisterParams {
  email: string
  password: string
  name: string
}

export type TOAuthProvider = 'google' | 'discord'

interface IAuthActions {
  login: (params: ILoginParams) => Promise<void>
  register: (params: IRegisterParams) => Promise<void>
  loginWithOAuth: (
    provider: TOAuthProvider,
    code: string,
    codeVerifier: string,
    redirectUrl: string
  ) => Promise<void>
  logout: () => void
  updateProfile: (params: { name: string }) => Promise<void>
  deleteAccount: () => Promise<void>
  setLoading: (loading: boolean) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

const DEFAULT_STATE: IAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  _hasHydrated: false,
}

function syncUsername(name: string) {
  useUserStore.getState().setUsername(name)
}

function mapUser(record: RecordModel): IUser {
  const email = record['email'] as string
  const name: string =
    (record['name'] as string) || email.split('@')[0] || 'User'

  return {
    id: record.id,
    email,
    name,
    avatar: record['avatar'] as string | undefined,
    created: record.created,
    verified: (record['verified'] as boolean) ?? false,
  }
}

export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      login: async ({ email, password }) => {
        set({ isLoading: true })
        try {
          const authData = await pb
            .collection('users')
            .authWithPassword(email, password)
          const user = mapUser(authData.record)

          if (!user.verified) {
            pb.authStore.clear()
            set({ isLoading: false })
            throw new Error('email_not_verified')
          }

          set({
            user,
            token: authData.token,
            isAuthenticated: true,
            isLoading: false,
          })
          syncUsername(user.name)
        } catch (error) {
          set({ isLoading: false })
          if (error instanceof Error && error.message === 'email_not_verified') {
            throw error
          }
          throw new Error('login_failed')
        }
      },

      register: async ({ email, password, name }) => {
        set({ isLoading: true })
        try {
          await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
            name,
          })
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          const errorStr = String(error)
          if (
            errorStr.includes('unique') ||
            errorStr.includes('already') ||
            errorStr.includes('validation_not_unique')
          ) {
            throw new Error('email_already_used')
          }
          throw new Error('register_failed')
        }
      },

      loginWithOAuth: async (provider, code, codeVerifier, redirectUrl) => {
        set({ isLoading: true })
        try {
          const authData = await pb
            .collection('users')
            .authWithOAuth2Code(provider, code, codeVerifier, redirectUrl)
          const user = mapUser(authData.record)

          set({
            user,
            token: authData.token,
            isAuthenticated: true,
            isLoading: false,
          })
          syncUsername(user.name)
        } catch {
          set({ isLoading: false })
          throw new Error('oauth_failed')
        }
      },

      logout: () => {
        pb.authStore.clear()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      updateProfile: async ({ name }) => {
        const state = useAuthStore.getState()
        if (!state.user) throw new Error('Not authenticated')

        set({ isLoading: true })
        try {
          const record = await pb
            .collection('users')
            .update(state.user.id, { name })
          const updatedUser = mapUser(record)
          set({
            user: updatedUser,
            isLoading: false,
          })
          syncUsername(updatedUser.name)
        } catch {
          set({ isLoading: false })
          throw new Error('update_failed')
        }
      },

      deleteAccount: async () => {
        const state = useAuthStore.getState()
        if (!state.user) throw new Error('Not authenticated')

        set({ isLoading: true })
        try {
          const userNotes = await pb.collection('user_notes').getFullList({
            filter: `user = "${state.user.id}"`,
          })
          await Promise.all(
            userNotes.map((note) => pb.collection('user_notes').delete(note.id))
          )

          await pb.collection('users').delete(state.user.id)
          pb.authStore.clear()
          set({
            ...DEFAULT_STATE,
            _hasHydrated: true,
          })
        } catch {
          set({ isLoading: false })
          throw new Error('delete_failed')
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setHasHydrated: (hasHydrated: boolean) =>
        set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'loltimeflash-auth',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && state?.user) {
          const record = {
            id: state.user.id,
            email: state.user.email,
            name: state.user.name,
            avatar: state.user.avatar,
            created: state.user.created,
            collectionId: 'users',
            collectionName: 'users',
            updated: '',
          }
          pb.authStore.save(state.token, record)
          syncUsername(state.user.name)
        }
        state?.setHasHydrated(true)
      },
    }
  )
)
