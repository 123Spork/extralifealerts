import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import MainApp from './app'

class App extends React.Component {
  componentDidMount(): void {
    window.setTimeout(() => new MainApp(), 1000)
  }

  render(): any {
    return (
      <div>
        <div id="donationAlertPopup" className="hide"></div>
        <div id="donationAlertMessagePopup" className="hide"></div>
        <div id="gameDayTimer" className="hide"></div>
        <div id="gameDayCountdownTimer" className="hide"></div>
      </div>
    )
  }
}

class RoutingComponent extends React.Component {
  render(): any {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={App} />
          <Route path="/beRightBackScreen" component={App} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<RoutingComponent />, document.getElementById('root'))
