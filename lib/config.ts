/**
 * App configuration
 */
const config = {
  /**
   * Socket.IO server URL (LolTimeFlash)
   */
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:8888',

  /**
   * API server URL (LolTimeFlash)
   */
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8888',

  /**
   * PocketBase URL (LaneGap)
   */
  pocketbaseUrl:
    process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://localhost:8090',

  /**
   * Current patch version
   */
  patchVersion: '16.1.1',
}

export default config
