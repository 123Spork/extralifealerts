const globalConfiguration = {
  participantId: 454390,
  teamId: 55961,
  eventStartTimestamp: 1635434330000,
  showDonationCents: true,
  donationPopupTimeout: 15000,
  donationMessagePopupTimeout: 15000,
  timeElementId: 'timer',
  soundVolume: 1,
  speechLanguage: "en",
  mockEnabled:false,
  timer: {
    elementId: 'timer',
    template: '{{DD}}d:{{hh}}:{{mm}}:{{ss}}'
  },
  content: {
    'intermission': {
      donationAlertPopup: {
        template: `
      <div class="intermission_donationHead">
        New Donation!
      </div>
      <div class="intermission_donationFrom">
        Donation from {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}
      </div>
      <div class="intermission_donationAmount">
        \${{donation.amount}}!
      </div>`,
        speak: true,
        speakTemplate:
          '{{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}} has donated ${{donation.amount}}',
        playSound: true,
        soundUrl: './assets/sounds/cash.mp3'
      },
      donationAlertMessagePopup: {
        template: `<div class="intermission_donationMessageHead">
          {{donation.message}}
        </div>
        <div class="intermission_donationMessageFrom">
          - {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}
        </div>`,
        speak: true,
        speakTemplate:
          '{{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}} says. {{donation.message}}',
        playSound: false,
        soundUrl: './assets/sounds/cash.mp3'
      },
      gameDayTimer: {
        template: `
      <div class="intermission_timer">
        <div class="intermission_timerHead">Time Streamed</div>
        <div class="intermission_timerBody"><div id="timer"></div></div>
      </div>
      <div class="intermission_amountRaised">
        <div class="intermission_amountRaisedHead">Amount Raised</div>
        <div class="intermission_amountRaisedBody">\${{participant.sumDonations}}!</div>
      </div>`,
        speak: false,
        speakTemplate: 'Replace this and set speak to true to make me speak.',
        playSound: false,
        soundUrl: './assets/sounds/cash.mp3'
      },
      gameDayCountdownTimer: {
        template: `
      <div class="profile">
        <img src="{{participant.avatarImageURL}}" class="profileAvatar"/>
        <div class="profileUsername">
          {{participant.displayName}}
        </div>
      </div>
      <div class="timer">
        <div class="timerHead">
          Time Until
        </div>
        <div class="timerBody">
          <div id="timer"></div>
        </div>
      </div>
      <div class="amountRaised">
        <div class="amountRaisedHead">
          Amount Raised
        </div>
        <div class="amountRaisedBody">
          \${{participant.sumDonations}}!
        </div>
      </div>`,
        speak: false,
        speakTemplate: 'Replace this and set speak to true to make me speak.',
        playSound: false,
        soundUrl: './sounds/cash.mp3'
      }
    },
    'brb': {
      donationAlertPopup: {
        template: `
      <div class="donationHead">
        New Donation!
      </div>
      <div class="donationFrom">
        Donation from {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}
      </div>
      <div class="donationAmount">
        \${{donation.amount}}!
      </div>`,
        speak: true,
        speakTemplate:
          '{{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}} has donated ${{donation.amount}}',
        playSound: true,
        soundUrl: './assets/sounds/cash.mp3'
      },
      donationAlertMessagePopup: {
        template: `<div class="donationMessageHead">
          {{donation.message}}
        </div>
        <div class="donationMessageFrom">
          - {{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}}
        </div>`,
        speak: true,
        speakTemplate:
          '{{#donation.displayName}}{{donation.displayName}}{{/donation.displayName}}{{^donation.displayName}}Anonymous{{/donation.displayName}} says. {{donation.message}}',
        playSound: false,
        soundUrl: './assets/sounds/cash.mp3'
      },
      gameDayTimer: {
        template: `
      <div class="profile">
        <img src="{{participant.avatarImageURL}}" class="profileAvatar"/>
        <div class="profileUsername">
          {{participant.displayName}}
        </div>
      </div>
      <div class="timer">
        <div class="timerHead">
          Time Streamed
        </div>
        <div class="timerBody">
          <div id="timer"></div>
        </div>
      </div>
      <div class="amountRaised">
        <div class="amountRaisedHead">
          Amount Raised
        </div>
        <div class="amountRaisedBody">
          \${{participant.sumDonations}}!
        </div>
      </div>`,
        speak: false,
        speakTemplate: 'Replace this and set speak to true to make me speak.',
        playSound: false,
        soundUrl: 'sounds/cash.mp3'
      },
      gameDayCountdownTimer: {
        template: `
      <div class="profile">
        <img src="{{participant.avatarImageURL}}" class="profileAvatar"/>
        <div class="profileUsername">
          {{participant.displayName}}
        </div>
      </div>
      <div class="timer">
        <div class="timerHead">
          Time Until
        </div>
        <div class="timerBody">
          <div id="timer"></div>
        </div>
      </div>
      <div class="amountRaised">
        <div class="amountRaisedHead">
          Amount Raised
        </div>
        <div class="amountRaisedBody">
          \${{participant.sumDonations}}!
        </div>
      </div>`,
        speak: false,
        speakTemplate: 'Replace this and set speak to true to make me speak.',
        playSound: false,
        soundUrl: 'sounds/cash.mp3'
      }
    }
  }
}
/* eslint-disable-next-line*/
// @ts-ignore
Window.globalConfiguration = globalConfiguration