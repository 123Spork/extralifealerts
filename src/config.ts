import { Donation, ELApi, Participant, Team } from './extra-life.client'
import { TimerContent } from './helper'
import ScreenManager from './screenManager'
import SoundManager from './soundManager'

export interface SceneContentData {
  donation?: Donation
  participant?: Participant
  team?: Team
  extraData?: {
    timer?: TimerContent
  }
}

export interface CustomControllers {
  screenManager: ScreenManager
  elAPIManager: ELApi
  soundManager: SoundManager
}

export interface ScreenContentConfig {
  override?: (
    sceneData: SceneContentData,
    controllers: CustomControllers
  ) => Promise<string>
  template: string
  speak?: boolean
  speakTemplate?: string
  playSound?: boolean
  soundUrl?: string
}

export interface ScreenConfig {
  [key: string]: ScreenContentConfig
  donationAlertPopup: ScreenContentConfig
  donationAlertMessagePopup: ScreenContentConfig
  gameDayTimer: ScreenContentConfig
  gameDayCountdownTimer: ScreenContentConfig
}

export interface Config {
  participantId: number
  teamId: number
  eventStartTimestamp: number
  showDonationCents: boolean
  donationPopupTimeout: number
  donationMessagePopupTimeout: number
  mockEnabled?: boolean
  soundVolume: number
  speechLanguage: string
  timer: {
    elementId: string
    template: string
  }
  content: {
    [key: string]: ScreenConfig
  }
}
// @ts-ignore
export default Window.globalConfiguration as Config
