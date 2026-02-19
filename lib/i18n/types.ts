export type TLanguage = 'en' | 'fr'

export const SUPPORTED_LANGUAGES: TLanguage[] = ['en', 'fr']

export interface ILocalizedText {
  en: string
  fr: string
}

export interface ITranslations {
  common: {
    settings: string
    ok: string
    copy: string
    copied: string
    reset: string
    connected: string
    disconnected: string
  }
  tabs: {
    solo: string
    multi: string
    laneGap: string
    profile: string
  }
  home: {
    welcome: string
    soloLobby: string
    madeWith: string
  }
  lobby: {
    createTitle: string
    createButton: string
    lobbyCodeIs: string
    joinTitle: string
    joinButton: string
    enterCode: string
    lobbyCodeRequired: string
    lobbyCode: string
  }
  settings: {
    title: string
    changeUsername: string
    yourUsername: string
    enterUsername: string
    minLength: string
    maxLength: string
    usernameEmpty: string
    background: string
    chooseBackground: string
    changeBackground: string
    searchChampions: string
    noChampionsFound: string
    language: string
    languageSubtitle: string
    french: string
    english: string
  }
  game: {
    connectingToServer: string
    roomSettings: string
    fetchLiveGame: string
    connectedUsers: string
    noUsersConnected: string
    roomCode: string
    sound: string
    soundOn: string
    soundOff: string
    flashNotificationSound: string
    summonerName: string
    fetching: string
    success: string
    foundEnemies: string
    error: string
    networkError: string
  }
  laneGap: {
    searchPlaceholder: string
    results: string
    enemyChampions: string
    favorites: string
    recent: string
    selectEnemy: string
    championsCount: string
    noChampionsFound: string
    championNotFound: string
    goBack: string
    facingEnemy: string
    updated: string
    bestPicks: string
    howToPlay: string
    powerSpikes: string
    itemSpikes: string
    noDataAvailable: string
    tierLegend: string
  }
  tiers: {
    'S+': string
    S: string
    'A+': string
    A: string
    'B+': string
    B: string
    'B-': string
    C: string
  }
  lanes: {
    all: string
    top: string
    mid: string
    adc: string
    support: string
  }
  appInfo: {
    privacyPolicy: string
    contact: string
    contactSupport: string
    sendEmail: string
    disclaimer: string
  }
  auth: {
    profile: string
    signIn: string
    signUp: string
    logout: string
    logoutConfirm: string
    cancel: string
    email: string
    password: string
    confirmPassword: string
    name: string
    enterEmail: string
    enterPassword: string
    confirmYourPassword: string
    enterName: string
    noAccount: string
    alreadyAccount: string
    orContinueWith: string
    google: string
    discord: string
    loginSuccess: string
    registerSuccess: string
    loginError: string
    registerError: string
    passwordMismatch: string
    invalidEmail: string
    passwordTooShort: string
    nameTooShort: string
    welcomeBack: string
    member: string
    editProfile: string
    deleteAccount: string
    deleteAccountConfirm: string
    deleteAccountWarning: string
    signInToAccess: string
    signInDescription: string
    account: string
    verifyEmail: string
    otpSentTo: string
    verifyButton: string
    didntReceive: string
    resendCode: string
    otpIncomplete: string
    otpInvalid: string
    otpExpired: string
    emailNotVerified: string
    emailAlreadyUsed: string
    sendOtpError: string
    resendSuccess: string
  }
  notes: {
    myNotes: string
    addNote: string
    editNote: string
    deleteNote: string
    deleteNoteConfirm: string
    notePlaceholder: string
    noNotes: string
    signInForNotes: string
    saved: string
  }
  notFound: {
    oops: string
    screenNotExist: string
    goHome: string
  }
}
