import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import config from './config'

export interface ELApi {
  getBase64Voice: () => Promise<string>
}

export const request = async (
  url: string,
  data: { msg: string; language: string }
): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    url: `http://localhost:5000/${url}`,
    method: 'POST',
    data: data
  }
  return await axios.request(config)
}

export const getBase64Voice = async (msg: string): Promise<string> => {
  let response: AxiosResponse<string>
  try {
    response = await request(`base64`, { msg, language: config.speechLanguage })
  } catch (error) {
    throw error
  }
  return response.data
}

export const api = {
  getBase64Voice
}
