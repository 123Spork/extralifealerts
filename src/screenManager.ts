import mustache from 'mustache'
import config, { SceneContentData } from './config'
import { ScreenEnum } from './helper'
import { getScene, screenKeys } from './helper'
import './scss/main.scss'

export default class ScreenManager {
  currentScreen: ScreenEnum
  constructor() {
    this.hideScreen = this.hideScreen.bind(this)
    this.showScreen = this.showScreen.bind(this)
    this.goToScreen = this.goToScreen.bind(this)
    this.generateSceneContent = this.generateSceneContent.bind(this)

    this.currentScreen = ScreenEnum.gameDayTimer
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

  goToRegularScreen():void{
    this.showScreen(ScreenEnum.gameDayTimer)
  }

  generateSceneContent(
    screen: ScreenEnum,
    data: SceneContentData
  ): string {
    const scene = getScene()
    const template = config.content[scene][screen].template
    return mustache.render(template, data)
  }  
}
