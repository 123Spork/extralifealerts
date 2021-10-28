import {
  Donation,
  getParticipantDonations,
  api as elApi,
  Participant,
  Team
} from './extra-life.client'
import config, { SceneContentData } from './config'
import { getDivById, getScene, ScreenEnum } from './helper'
import SceneManager from './screenManager'
import './scss/main.scss'

export default class App {
  screenManager: SceneManager
  hasInitialisedExistingDonations: boolean
  handledDonationIds: string[]
  participant: Participant | null
  team: Team | null
  timeInterval: number | null

  constructor() {
    this.checkForNewDonations = this.checkForNewDonations.bind(this)
    this.setDonationMode = this.setDonationMode.bind(this)
    this.fetchLatestParticipantData = this.fetchLatestParticipantData.bind(this)

    this.screenManager = new SceneManager()
    this.hasInitialisedExistingDonations = true
    this.handledDonationIds = []
    this.participant = null
    this.team = null
    this.timeInterval = null
    this.setIntervals()
  }

  async processAndActivateDivContent(
    screenName: ScreenEnum,
    sceneContentData: SceneContentData
  ) {
    const scene = getScene()
    let content
    if (config.content[scene][screenName].override) {
      content = await (config.content[scene][screenName] as any).override(
        sceneContentData,
        {
          screenManager: this.screenManager,
          elApi,
          soundManager: 'TBC'
        }
      )
    } else {
      content = this.screenManager.generateSceneContent(
        screenName,
        sceneContentData
      )
    }
    getDivById(screenName).innerHTML = content
    this.screenManager.goToScreen(screenName)
  }

  async createContentChangeTimeout(
    screenName: ScreenEnum,
    timeout: number,
    sceneContentData: SceneContentData
  ) {
    const self = this
    window.setTimeout(async (): Promise<void> => {
      self.processAndActivateDivContent(screenName, sceneContentData)
    }, timeout)
  }

  async checkForNewDonations(): Promise<void> {
    if (!this.hasInitialisedExistingDonations) {
      const donations: Donation[] = await getParticipantDonations()
      const donationIds: string[] = donations.map((donation): string => {
        return donation.donationID
      })
      this.handledDonationIds = donationIds
      this.hasInitialisedExistingDonations = true
      return
    }
    const self = this
    const donations: Donation[] = await elApi.getParticipantDonations()
    const newDonations = donations.filter((donation): boolean => {
      return !self.handledDonationIds.includes(donation.donationID)
    })
    if (newDonations.length > 0) {
      this.handledDonationIds = this.handledDonationIds.concat(
        newDonations.map((donation): string => {
          return donation.donationID
        })
      )
      if(this.timeInterval){
        window.clearInterval(this.timeInterval)
      }
      await this.setDonationMode(newDonations)
    }
  }

  async fetchLatestParticipantData(): Promise<void> {
    this.participant = await elApi.getParticipantInfo()
  }

  async fetchLatestTeamData(): Promise<void> {
    this.team = await elApi.getTeamInfo()
  }

  async setDonationMode(donations: Donation[]): Promise<void> {
    const scene = getScene()
    const popupScreen: ScreenEnum = ScreenEnum.donationAlertPopup
    const popupTimeout = config.content[scene][popupScreen].timeout
    const messageScreen: ScreenEnum = ScreenEnum.donationAlertMessagePopup
    const messageTimeout = config.content[scene][popupScreen].timeout

    let messagesShown: number = 0

    for (let i = 0; i < donations.length; i++) {
      let donation = donations[i]
      const sceneContentData: SceneContentData = {
        donation,
        participant: this.participant as Participant,
        team: this.team as Team
      }

      this.createContentChangeTimeout(
        popupScreen,
        popupTimeout * i + messagesShown * messageTimeout,
        sceneContentData
      )

      if (donation.message) {
        this.createContentChangeTimeout(
          messageScreen,
          popupTimeout * (i + 1) + messagesShown * messageTimeout,
          sceneContentData
        )
        messagesShown++
      }
    }

    window.setTimeout((): void => {
      this.setCountUpMode()
    }, popupTimeout * donations.length + messagesShown * messageTimeout)
  }

  async setCountUpMode(): Promise<void> {
    //const scene = getScene()
    this.timeInterval = window.setInterval(() => {
      console.log(this.participant)
      const now = new Date().getTime();
      const distance = now - config.eventStartTimestamp
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours =  ("0"+Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-2);
      const minutes =  ("0"+Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2);
      const seconds = ("0"+Math.floor((distance % (1000 * 60)) / 1000)).slice(-2);

      this.processAndActivateDivContent(ScreenEnum.gameDayTimer, {
        participant: this.participant as Participant,
        team: this.team as Team,
        extraData: { timer: `${days>1?days+"d:":""}${hours}:${minutes}:${seconds}` }
      })
    }, 1000)
    this.screenManager.goToRegularScreen()
  }

  async setIntervals(): Promise<void> {
    window.setInterval(this.checkForNewDonations, 60000)
    window.setInterval(this.fetchLatestParticipantData, 60000)
    window.setInterval(this.fetchLatestTeamData, 60000)
    await this.fetchLatestParticipantData()
    this.setCountUpMode()
    //  this.fetchLatestTeamData()
    //  this.checkForNewDonations()
  }
}
