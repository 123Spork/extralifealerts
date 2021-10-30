import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MainApp from './app'

class App extends React.Component {

  async componentDidMount(): Promise<void> {
    window.onload = async () => {
      window.setTimeout(() => new MainApp(), 1000)
    }
  }

  render(): any {
    return (
      <div>
        <div id="donationAlertPopup" className="boxView hide"></div>
        <div id="donationAlertMessagePopup" className="boxView hide"></div>
        <div id="gameDayTimer" className="boxView hide"></div>
        <div id="gameDayCountdownTimer" className="boxView hide"></div>
      </div>
    )
  }
}
ReactDOM.render(<App />, document.getElementById('root'))
