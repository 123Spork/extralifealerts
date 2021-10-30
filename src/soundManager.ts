import config from './config'
import { getBase64Voice } from './synthetic-voice-proxy-client'

export default class SoundManager {
  constructor() {
    this.playSound = this.playSound.bind(this)
    this.saySomething = this.saySomething.bind(this)
  }

  playSound(soundUrl: string, onComplete: () => void = () => {}): void {
    const audio = new Audio(soundUrl)
    audio.addEventListener('ended', () => {
      audio.pause()
      onComplete()
    })
    audio.onerror = () => {
      if (soundUrl === './assets/sounds/soundNotFound.mp3') {
        throw 'Sound not found! Default error sound removed!'
      }
      this.playSound('./assets/sounds/soundNotFound.mp3')
    }
    audio.onloadeddata = () => {
      audio.play()
    }
  }

  delaySound(
    soundUrl: string,
    timeout: number,
    onComplete: () => void = () => {}
  ): void {
    const self = this
    window.setTimeout(() => {
      self.playSound(soundUrl, onComplete)
    }, timeout)
  }

  async saySomething(speechText: string) {
    if (window.speechSynthesis.getVoices().length < 1) {
      let base64 = await getBase64Voice(speechText)
      this.playSound('data:audio/mp3;base64,' + base64)
    }
    const msg = new SpeechSynthesisUtterance()
    //msg.voice = window.speechSynthesis.getVoices()[config.speech.voice]
    msg.volume = config.soundVolume // From 0 to 1
    //msg.rate = config.speech.rate // From 0.1 to 10
    //msg.pitch = config.speech.pitch // From 0 to 2
    msg.text = speechText
    msg.lang = config.speechLanguage
    speechSynthesis.speak(msg)
  }
}
