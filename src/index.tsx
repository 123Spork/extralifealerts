import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MainApp from './app'

class App extends React.Component {
  async componentDidMount(): Promise<void> {
    window.onload = async () => {
      //@ts-ignore
      const callbacks = Window.globalConfiguration.callbacks
      window.setTimeout(() => new MainApp(callbacks), 1000)
    }
  }

  render(): any {
    return <div id="scene"></div>
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
