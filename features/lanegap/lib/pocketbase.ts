import PocketBase from 'pocketbase'

import config from '@/lib/config'

// PocketBase client instance
export const pb = new PocketBase(config.pocketbaseUrl)

// Disable auto-cancellation for better UX
pb.autoCancellation(false)
