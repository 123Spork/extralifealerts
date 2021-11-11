import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import testData from '../test/testData.json'
import config from '../config/config'

export interface Participant {
  displayName: string
  fundraisingGoal: number
  eventName: string
  links: {
    donate: string
    stream: string
    page: string
  }
  eventID: number
  sumDonations: number
  createdDateUTC: string
  numAwardedBadges: number
  participantID: number
  numMilestones: number
  teamName: string
  streamIsLive: boolean
  avatarImageURL: string
  teamID: number
  numIncentives: number
  isTeamCaptain: boolean
  streamIsEnabled: boolean
  streamingPlatform: string
  sumPledges: number
  streamingChannel: string
  numDonations: number
}

export interface Team {
  numParticipants: number
  fundraisingGoal: number
  eventName: string
  links: {
    stream: string
    page: string
  }
  eventID: number
  sumDonations: number
  createdDateUTC: string
  name: string
  numAwardedBadges: number
  captainDisplayName: string
  hasTeamOnlyDonations: false
  streamIsLive: boolean
  avatarImageURL: string
  teamID: number
  streamIsEnabled: boolean
  streamingPlatform: string
  sumPledges: number
  streamingChannel: string
  numDonations: number
}

export interface Donation {
  displayName?: string
  donorID?: string
  links: {
    recipient: string
  }
  eventID: number
  createdDateUTC: string
  recipientName: string
  participantID: number
  amount: number
  avatarImageURL: string
  teamID: number
  donationID: string
  message?: string
}

const mock = async (type: string): Promise<Participant | Donation[]> => {
  return new Promise((resolve) => {
    if (type == 'participant') {
      resolve(testData.participant)
    }
    if (type == 'donations') {
      resolve(testData.donations)
    }
  })
}

export class ExtraLifeManager {
  participant: Participant | null
  team: Team | null
  donations: Donation[]
  handledDonationIds: string[]
  onNewDonations: (newDonations: Donation[]) => Promise<void>
  onLoaded: () => Promise<void>

  constructor(callbacks: {
    onLoaded?: () => Promise<void>
    onNewDonations?: (newDonations: Donation[]) => Promise<void>
  }) {
    this.participant = null
    this.team = null
    this.donations = []
    this.handledDonationIds = []
    this.onNewDonations = callbacks.onNewDonations
      ? callbacks.onNewDonations
      : async (_newDonations: Donation[]) => {}
    this.onLoaded = callbacks.onLoaded ? callbacks.onLoaded : async () => {}
    this.initializeApp()
  }

  async request(url: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      url: `https://www.extra-life.org/api/${url}`,
      method: 'GET'
    }
    return await axios.request(config)
  }

  async getParticipantInfo(): Promise<Participant> {
    if (config.main.mockEnabled) {
      return (mock('participant') as unknown) as Participant
    }
    let response: AxiosResponse<Participant>
    try {
      response = await this.request(`participants/${config.main.participantId}`)
    } catch (error) {
      throw error
    }
    return response.data
  }

  async getParticipantDonations(): Promise<Donation[]> {
    if (config.main.mockEnabled) {
      return (mock('donations') as unknown) as Donation[]
    }
    let response: AxiosResponse<Donation[]>
    try {
      response = await this.request(
        `participants/${config.main.participantId}/donations`
      )
    } catch (error) {
      throw error
    }
    return response.data
  }

  getTeamInfo = async (): Promise<Team> => {
    let response: AxiosResponse<Team>
    try {
      response = await this.request(`teams/${config.main.teamId}`)
    } catch (error) {
      throw error
    }
    return response.data
  }

  async getTeamParticipants(): Promise<Participant[]> {
    let response: AxiosResponse<Participant[]>
    try {
      response = await this.request(`teams/${config.main.teamId}/participants`)
    } catch (error) {
      throw error
    }
    return response.data
  }

  async getTeamDonations(): Promise<Donation[]> {
    let response: AxiosResponse<Donation[]>
    try {
      response = await this.request(`teams/${config.main.teamId}/donations`)
    } catch (error) {
      throw error
    }
    return response.data
  }

  async processNewDonations(): Promise<void> {
    const newDonations = this.donations.filter(
      (donation: Donation): boolean =>
        !this.handledDonationIds.includes(donation.donationID)
    )
    if (newDonations.length > 0) {
      this.handledDonationIds = this.handledDonationIds.concat(
        newDonations.map((donation): string => donation.donationID)
      )
      await this.onNewDonations(newDonations)
    }
  }

  async initializeApp(): Promise<void> {
    window.setInterval(async () => {
      this.team = await this.getTeamInfo()
      this.participant = await this.getParticipantInfo()
      this.donations = await this.getParticipantDonations()
      await this.processNewDonations()
    }, 60000)
    this.team = await this.getTeamInfo()
    this.participant = await this.getParticipantInfo()
    this.donations = await this.getParticipantDonations()
    this.handledDonationIds = this.donations.map(
      (donation): string => donation.donationID
    )
    await this.onLoaded()
  }
}
