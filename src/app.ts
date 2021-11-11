import { Donation } from './extraLifeManager'
import './main.scss'
import Controller, { ScreenData } from './controller'
import { TimerContent } from './timeManager'

export type CallbackFunction = (
  sceneContentData: ScreenData,
  controller: Controller
) => void

export default class App {
  controller: Controller
  onStart: CallbackFunction
  onNewDonations: CallbackFunction
  onTimerTick: CallbackFunction

  constructor(callbacks: {
    onStart?: CallbackFunction
    onNewDonations?: CallbackFunction
    onTimerTick?: CallbackFunction
  }) {
    this.onNewDonations = callbacks.onNewDonations
      ? callbacks.onNewDonations
      : () => {}
    this.onStart = callbacks.onStart ? callbacks.onStart : () => {}
    this.onTimerTick = callbacks.onTimerTick ? callbacks.onTimerTick : () => {}

    this.controller = new Controller({
      onTimerTick: this.onTick.bind(this),
      onNewDonations: this.onDonations.bind(this),
      onExtraLifeLoaded: async () => {
        await this.onStart(this.controller.getData(), this.controller)
      }
    })
  }

  async onTick(_timerTick: TimerContent) {
    if (!this.controller) {
      return
    }
    await this.controller.refreshIdInCurrent('timer', {
      timer: this.controller.getTimer()
    })
    await this.onTimerTick(this.controller.getData(), this.controller)
  }

  async onDonations(donations: Donation[]) {
    this.onNewDonations(
      { ...this.controller.getData(), donations },
      this.controller
    )
  }
}
