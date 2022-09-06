import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './styles/main.scss'
import Controller, { ScreenData } from './controller'
import { Donation, TimerContent } from './managers'
import { Badge, Milestone } from './managers/extraLifeManager'

export type CallbackFunction = (
  sceneContentData: ScreenData,
  controller: Controller
) => void

class App {
  controller: Controller
  onStart: CallbackFunction
  onNewDonations: CallbackFunction
  onMilestonesReached: CallbackFunction
  onBadgesObtained: CallbackFunction
  onTimerTick: CallbackFunction

  constructor(callbacks: {
    onStart?: CallbackFunction
    onNewDonations?: CallbackFunction
    onMilestonesReached?: CallbackFunction
    onBadgesObtained?: CallbackFunction
    onTimerTick?: CallbackFunction
  }) {
    this.onNewDonations = callbacks.onNewDonations
      ? callbacks.onNewDonations
      : () => {}
    this.onMilestonesReached = callbacks.onMilestonesReached
      ? callbacks.onMilestonesReached
      : () => {}
    this.onBadgesObtained = callbacks.onBadgesObtained
      ? callbacks.onBadgesObtained
      : () => {}
    this.onStart = callbacks.onStart ? callbacks.onStart : () => {}
    this.onTimerTick = callbacks.onTimerTick ? callbacks.onTimerTick : () => {}

    this.controller = new Controller({
      onTimerTick: this.onTick.bind(this),
      onNewDonations: this.onDonations.bind(this),
      onMilestonesReached: this.onMilestones.bind(this),
      onBadgesObtained: this.onBadges.bind(this),
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

  async onMilestones(milestones: Milestone[]) {
    debugger;
    this.onMilestonesReached(
      { ...this.controller.getData(), milestones },
      this.controller
    )
  }

  async onBadges(badges: Badge[]) {
    this.onBadgesObtained(
      { ...this.controller.getData(), badges },
      this.controller
    )
  }
}

class Main extends React.Component {
  async componentDidMount(): Promise<void> {
    window.onload = async () => {
      //@ts-ignore
      const callbacks = Window.globalConfiguration.callbacks
      window.setTimeout(() => new App(callbacks), 1000)
    }
  }

  render(): any {
    return <div id="scene"></div>
  }
}
ReactDOM.render(<Main />, document.getElementById('root'))
