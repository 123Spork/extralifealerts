import mustache from 'mustache'
import { CustomControllers, SceneContentData } from './config'
import { getConfigForScreen, getDivById, ScreenEnum } from './helper'
import { screenKeys } from './helper'
import { api as elApi } from './extra-life.client'
import './scss/main.scss'
import SoundManager from './soundManager'

export default class ScreenManager {
  currentScreen: ScreenEnum
  soundManager: SoundManager

  constructor(soundManager: SoundManager) {
    this.hideScreen = this.hideScreen.bind(this)
    this.showScreen = this.showScreen.bind(this)
    this.goToScreen = this.goToScreen.bind(this)
    this.processAndActivateScreenContent = this.processAndActivateScreenContent.bind(
      this
    )
    this.currentScreen = ScreenEnum.gameDayTimer
    this.soundManager = soundManager
  }

  hideScreen(divId: string): void {
    ;(document.getElementById(divId) as HTMLDivElement).classList.add('hide')
  }

  showScreen(divId: string): void {
    ;(document.getElementById(divId) as HTMLDivElement).classList.remove('hide')
  }

  goToScreen(divId: string): void {
    for (var i = 0; i < screenKeys.length; i++) {
      this.hideScreen(screenKeys[i])
    }
    this.showScreen(divId)
  }

  generateContent(template: string, data: Record<string, any>): string {
    return mustache.render(template, data)
  }

  setDivContentById(
    id: string,
    template: string,
    data: Record<string, any>
  ): void {
    getDivById(id).innerHTML = mustache.render(template, data)
  }

  async processAndActivateScreenContent(
    screenName: ScreenEnum,
    sceneContentData: SceneContentData
  ) {
    const screenConfig = getConfigForScreen(screenName)
    let content
    if (screenConfig.override) {
      content = await screenConfig.override(sceneContentData, {
        screenManager: this,
        elAPIManager: elApi,
        soundManager: this.soundManager
      } as CustomControllers)
    } else {
      const template = screenConfig.template
      content = this.generateContent(template, sceneContentData)
    }
    getDivById(screenName).innerHTML = content
    this.goToScreen(screenName)
    console.log(screenConfig)
    if (screenConfig.playSound === true) {
      this.soundManager.playSound(screenConfig.soundUrl || 'sounds/cash.mp3')
    }
    if (screenConfig.speak === true) {
      this.soundManager.saySomething(
        this.generateContent(
          screenConfig.speakTemplate || 'Default sentence. Overwrite me!',
          sceneContentData
        )
      )
    }
  }

  async createContentChangeTimeout(
    screenName: ScreenEnum,
    timeout: number,
    sceneContentData: SceneContentData
  ) {
    const self = this
    window.setTimeout(async (): Promise<void> => {
      self.processAndActivateScreenContent(screenName, sceneContentData)
    }, timeout)
  }
}
