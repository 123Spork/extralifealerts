import config from './config'

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
    audio.play()
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

  saySomething(speechText: string) {
    const msg = new SpeechSynthesisUtterance()
    msg.voice = window.speechSynthesis.getVoices()[config.speech.voice]
    msg.volume = config.speech.volume // From 0 to 1
    msg.rate = config.speech.rate // From 0.1 to 10
    msg.pitch = config.speech.pitch // From 0 to 2
    msg.text = speechText
    msg.lang = config.speech.language
    speechSynthesis.speak(msg)
  }
}
