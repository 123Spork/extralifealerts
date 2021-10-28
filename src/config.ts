import { Donation, ELApi, Participant, Team } from './extra-life.client'
import ScreenManager from './screenManager'

export interface SceneContentData {
  donation?: Donation
  participant?: Participant
  team?: Team
  extraData?: {
    timer?: string
  }
}

export interface CustomControllers {
  screenManager: ScreenManager
  elAPIManager: ELApi
  soundManager: string
}

export interface ScreenContentConfig {
  override?: (sceneData: SceneContentData, controllers: CustomControllers) => Promise<string>
  template: string
  timeout: number
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
  content: {
    [key: string]: ScreenConfig
  }
}

const defaultScreenContent: ScreenConfig = {
  donationAlertPopup: {
    template: `
    <div>Donation from {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}</div>
    <div>for \${{donation.amount}}!</div>`,
    timeout: 15000,
    /*override: async (sceneContentData: SceneContentData, _controller: CustomControllers) => {
      if (sceneContentData.donation?.displayName) {
        return sceneContentData.donation.displayName
      }
      return 'Anonymous'
    }*/
  },
  donationAlertMessagePopup: {
    template:
      '"{{donation.message}}" - {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}',
    timeout: 15000
  },
  gameDayTimer: {
    template: `
    <div>{{extraData.timer}}  You have raised \${{participant.sumDonations}}!</div>`,
    timeout: 15000
  },
  gameDayCountdownTimer: {
    template: 'THERS BEEN A MURDER {donationId}',
    timeout: 15000
  }
  // donationTriggers: {
  //   template: 'THERS BEEN A MURDER {donationId}',
  //   timeout: 15000
  // },
}

export default {
  participantId: 454390,
  teamId: 55961,
  eventStartTimestamp: 1635205806000,
  content: {
    '/brb': defaultScreenContent
  }
} as Config
