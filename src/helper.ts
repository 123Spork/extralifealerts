export const getDivById = (id: string): HTMLDivElement => {
  return document.getElementById(id) as HTMLDivElement
}

export const getScene = () => {
  return window.location.pathname
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
