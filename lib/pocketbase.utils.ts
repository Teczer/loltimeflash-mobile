import { pb } from '@/features/lanegap/lib/pocketbase'

/**
 * Returns the PocketBase file URL for a user's avatar.
 * Uses pb.files.getURL() for consistency with the SDK.
 */
export function getAvatarUrl(user: {
  id: string
  avatar?: string
}): string | null {
  if (!user?.avatar) return null
  return pb.files.getURL(
    { id: user.id, collectionName: 'users' },
    user.avatar
  )
}
