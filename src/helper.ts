import config from './config'

export const getDivById = (id: string): HTMLDivElement => {
  return document.getElementById(id) as HTMLDivElement
}

export const getScene = () => {
  const pathname = window.location.href.split('/')
  return pathname[pathname.length - 1].substring(
    0,
    pathname[pathname.length - 1].indexOf('?') > -1
      ? pathname[pathname.length - 1].indexOf('?')
      : pathname[pathname.length - 1].indexOf('.') > -1
      ? pathname[pathname.length - 1].indexOf('.')
      : pathname[pathname.length - 1].length
  )
}

export enum ScreenEnum {
  donationAlertPopup = 'donationAlertPopup',
  donationAlertMessagePopup = 'donationAlertMessagePopup',
  gameDayTimer = 'gameDayTimer',
  gameDayCountdownTimer = 'gameDayCountdownTimer'
}

export const screenKeys = [
  ScreenEnum.donationAlertPopup,
  ScreenEnum.donationAlertMessagePopup,
  ScreenEnum.gameDayTimer,
  ScreenEnum.gameDayCountdownTimer
]

export interface TimerContent {
  DD: string
  hh: string
  mm: string
  ss: string
}

export const getTimeUp = (): TimerContent => {
  const now = new Date().getTime()
  const distance = now - config.eventStartTimestamp
  return {
    DD: `${Math.floor(distance / (1000 * 60 * 60 * 24))}`,
    hh: (
      '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).slice(-2),
    mm: ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(
      -2
    ),
    ss: ('0' + Math.floor((distance % (1000 * 60)) / 1000)).slice(-2)
  }
}

export const getTimeDown = (): TimerContent => {
  const now = new Date().getTime()
  const distance = config.eventStartTimestamp - now
  return {
    DD: `${Math.floor(distance / (1000 * 60 * 60 * 24))}`,
    hh: (
      '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).slice(-2),
    mm: ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(
      -2
    ),
    ss: ('0' + Math.floor((distance % (1000 * 60)) / 1000)).slice(-2)
  }
}

export const getConfigForScreen = (screenName: string) => {
  const scene = getScene()
  return config.content[scene][screenName]
}
