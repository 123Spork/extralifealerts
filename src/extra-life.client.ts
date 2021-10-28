import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import config from './config'

export interface Participant {
  displayName: number
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

export interface ELApi {
  getParticipantInfo: () => Promise<Participant>
  getParticipantDonations: () => Promise<Donation[]>
  getTeamInfo: () => Promise<Team>
  getTeamParticipants: () => Promise<Participant[]>
  getTeamDonations: () => Promise<Donation[]>
}

export const request = async (url: string): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    url: `https://www.extra-life.org/api/${url}`,
    method: 'GET'
  }
  return await axios.request(config)
}

export const getParticipantInfo = async (): Promise<Participant> => {
  let response: AxiosResponse<Participant>
  try {
    response = await request(`participants/${config.participantId}`)
  } catch (error) {
    throw error
  }
  return response.data
}

export const getParticipantDonations = async (): Promise<Donation[]> => {
  let response: AxiosResponse<Donation[]>
  try {
    response = await request(`participants/${config.participantId}/donations`)
  } catch (error) {
    throw error
  }
  return response.data
}

export const getTeamInfo = async (): Promise<Team> => {
  let response: AxiosResponse<Team>
  try {
    response = await request(`teams/${config.teamId}`)
  } catch (error) {
    throw error
  }
  return response.data
}

export const getTeamParticipants = async (): Promise<Participant[]> => {
  let response: AxiosResponse<Participant[]>
  try {
    response = await request(`teams/${config.teamId}/participants`)
  } catch (error) {
    throw error
  }
  return response.data
}

export const getTeamDonations = async (): Promise<Donation[]> => {
  let response: AxiosResponse<Donation[]>
  try {
    response = await request(`teams/${config.teamId}/donations`)
  } catch (error) {
    throw error
  }
  return response.data
}

export const api = {
  getParticipantDonations,
  getTeamDonations,
  getTeamInfo,
  getParticipantInfo,
  getTeamParticipants,
}as ELApi