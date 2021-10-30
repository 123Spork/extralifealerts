import {
  Donation,
  getParticipantDonations,
  api as elApi,
  Participant,
  Team
} from './extra-life.client'
import config, { SceneContentData } from './config'
import { getDivById, getScene, getTimeDown, getTimeUp, ScreenEnum } from './helper'
import SceneManager from './screenManager'
import SoundManager from './soundManager'
import './scss/main.scss'

export default class App {
  screenManager: SceneManager
  soundManager: SoundManager
  hasInitialisedExistingDonations: boolean
  handledDonationIds: string[]
  participant: Participant | null
  team: Team | null
  timeInterval: number | null
  defaultScreen: string | null

  constructor() {
    this.initializeApp = this.initializeApp.bind(this)
    this.fetchNewDonations = this.fetchNewDonations.bind(this)
    this.fetchLatestParticipantData = this.fetchLatestParticipantData.bind(this)
    this.fetchLatestTeamData = this.fetchLatestTeamData.bind(this)
    this.setDonationMode = this.setDonationMode.bind(this)
    this.setCountUpMode = this.setCountUpMode.bind(this)
    this.setCountDownMode = this.setCountDownMode.bind(this)
    this.checkRegularMode = this.checkRegularMode.bind(this)
    this.setRegularMode = this.setRegularMode.bind(this)

    this.soundManager = new SoundManager()
    this.screenManager = new SceneManager(this.soundManager)
    this.hasInitialisedExistingDonations = true
    this.handledDonationIds = []
    this.participant = null
    this.team = null
    this.timeInterval = null
    this.defaultScreen = null
    this.initializeApp()
  }

  async initializeApp(): Promise<void> {

    if(!config.content[getScene()]){
      getDivById('root').innerHTML = "NOT RUNNING, NO CONFIGURATION HAS BEEN CREATED FOR: /" + getScene()
      return
    }

    window.setInterval(() => {
      this.fetchNewDonations()
      this.fetchLatestTeamData()
      this.fetchLatestParticipantData()
    }, 60000)
    await this.fetchLatestParticipantData()
    //await this.fetchLatestTeamData()
    await this.fetchNewDonations()

    window.setInterval(this.checkRegularMode, 1000)
    this.checkRegularMode()
  }

  async fetchNewDonations(): Promise<void> {
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
      if (this.timeInterval) {
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
    const popupScreen: ScreenEnum = ScreenEnum.donationAlertPopup
    const popupTimeout = config.donationPopupTimeout
    const messageScreen: ScreenEnum = ScreenEnum.donationAlertMessagePopup
    let messagesShown: number = 0

    for (let i = 0; i < donations.length; i++) {
      let donation = donations[i]
      const sceneContentData: SceneContentData = {
        donation: {
          ...donation,
          amount: (donation.amount.toFixed(
            config.showDonationCents ? 2 : 0
          ) as unknown) as number
        },
        participant: this.participant as Participant,
        team: this.team as Team
      }

      this.screenManager.createContentChangeTimeout(
        popupScreen,
        popupTimeout * i + messagesShown * config.donationMessagePopupTimeout,
        sceneContentData
      )
      if (donation.message) {
        this.screenManager.createContentChangeTimeout(
          messageScreen,
          popupTimeout * (i + 1) +
            messagesShown * config.donationMessagePopupTimeout,
          sceneContentData
        )
        messagesShown++
      }
    }

    window.setTimeout((): void => {
      this.setRegularMode()
    }, popupTimeout * donations.length + messagesShown * config.donationMessagePopupTimeout)
  }

  async setCountUpMode(): Promise<void> {
    const resetTimer = () => {
      this.screenManager.setDivContentById(
        config.timer.elementId,
        config.timer.template,
        getTimeUp()
      )
    }
    this.timeInterval = window.setInterval(resetTimer, 1000)
    this.screenManager.processAndActivateScreenContent(
      ScreenEnum.gameDayTimer,
      {
        participant: this.participant as Participant,
        team: this.team as Team,
        extraData: {
          timer: getTimeUp()
        }
      }
    )
    resetTimer()
    this.screenManager.goToScreen(ScreenEnum.gameDayTimer)
  }

  async setCountDownMode(): Promise<void> {
    const resetTimer = () => {
      this.screenManager.setDivContentById(
        config.timer.elementId,
        config.timer.template,
        getTimeDown()
      )
    }
    this.timeInterval = window.setInterval(resetTimer, 1000)
    this.screenManager.processAndActivateScreenContent(
      ScreenEnum.gameDayCountdownTimer,
      {
        participant: this.participant as Participant,
        team: this.team as Team,
        extraData: {
          timer: getTimeDown()
        }
      }
    )
    resetTimer()
    this.screenManager.goToScreen(ScreenEnum.gameDayCountdownTimer)
  }

  checkRegularMode() {
    const now = new Date().getTime()
    const screen =
      now - config.eventStartTimestamp > 0
        ? ScreenEnum.gameDayTimer
        : ScreenEnum.gameDayCountdownTimer
    if (screen !== this.defaultScreen) {
      this.defaultScreen = screen
      if (
        this.screenManager.currentScreen === ScreenEnum.gameDayTimer ||
        ScreenEnum.gameDayCountdownTimer
      ) {
        this.setRegularMode()
      }
    }
  }

  setRegularMode() {
    if (this.timeInterval) {
      window.clearInterval(this.timeInterval)
    }
    if (this.defaultScreen === ScreenEnum.gameDayTimer) {
      this.setCountUpMode()
    } else {
      this.setCountDownMode()
    }
  }
}
