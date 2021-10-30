# React & Mustache Extra Life Alerting System

## What is this?
ExtraLifeAlerts is a flexible alerting system which masks Extra Life's API.

It provides a runnable/ buildable and embeddable solution for displaying new extra life donations, total amount $ raised, total time played and a countdown timer leading up until a desired date-time.

The software is designed to be as flexible as possible, providing the capibility to template the look and feel at will using mustache, custom CSS and JS functions. You can even have different looks for different streaming scenes by simply providing more templates.

## Setup
```
//to build and launch a hot-change react service:
npm install
npm run watch

//to build a standalone js/ html launcher (./build)
npm install
npm run build
```
## Configuring
In your build go to **/assets/base-configuration.json**

Before we start:
- Assume all timestamps are UTC milliseconds.
- Look at the existing file to see the default values.

The file is laid out as follows.
```javascript
{
  participantId: //your extra life id
  teamId: //your extra life team
  eventStartTimestamp: //event start time
  showDonationCents: //show donations in decimal format ($50 | $50.00)
  donationPopupTimeout: //length of time to show the donation popup
  donationMessagePopupTimeout: //length of time to show the donation message popup
  soundVolume: //volume of the application sounds (either synthetic speech or otherwise)
  speechLanguage: //spoken language of the speaking tools,
  mockEnabled: //enables a developer mode,
  timer: {
    elementId://element id of the on screen timer in your scene: "#timer"
    template: //template for time format: "{{DD}}d:{{hh}}:{{mm}}:{{ss}}"
  }
  content: {
    brb:{ //url address that this config applies to (brb.html)
        donationAlertPopup: { //scene/ div id see other available scenes below
            override: //custom function, see **Advanced Configuration**
            template: //mustache template for scene, see **Templating**
            speak: //true or false if you want text-to-speech on scene entry
            speakTemplate: //template of what you want the screen to say
            playSound: //true or false if you want audio to play on entry
            soundUrl: //url of the audio to play
        }
        donationAlertMessagePopup: { ... } //same as donationAlertPopup
        gameDayTimer: { ... } //same as donationAlertPopup
        gameDayCountdownTimer: { ... } //same as donationAlertPopup
    }
  }
}
```

Page based configuration can be achieved by duplicating the default brb.html file into any other name you choose and then appending a new element to the **content** object above. This allows you to service different styled themes for different stream scenes depending on need.

Here's an example.
```javascript
{
    ...,
    content: {
        brb: { ... } //theme content applicable to brb.html
        game: { ... } //theme content applicable to game.html
    }
}
```


## Templating
This system uses mustache templating. An example of which you can see below...
```
<div class="donationHead">
    New Donation!
</div>
<div class="donationFrom">
    Donation from {{donation.displayName}}
</div>
<div class="donationAmount">
    \${{donation.amount}}!
</div>
```
Templates are applied in real time based on context, inserted into whatever scene it is configured on top of. For instance, the below example will configure the formatting of the **donationAlertPopup** screen.

```javascript
{
    ...,
    content: {
        brb:{
            donationAlertPopup: { //scene/ div id
                ...,
                template: "<div>Donation! {{donation.displayName}}</div>"
                speechTemplate: "New dono from {{donation.displayName}}"
            }
        }
    }
}
```

Within the above you can see an example mustache template. The available fields that are available to use are below. **Be aware that in the non-donation scenes, the donation object may not be available.**

```typescript
{
    participant: {
        displayName: string
        fundraisingGoal: number
        eventName: string
        links: {
            donate: string
            stream: string
            page: string
        }
        eventID: number
        sumDonations: number
        createdDateUTC: string
        numAwardedBadges: number
        participantID: number
        numMilestones: number
        teamName: string
        streamIsLive: boolean
        avatarImageURL: string
        teamID: number
        numIncentives: number
        isTeamCaptain: boolean
        streamIsEnabled: boolean
        streamingPlatform: string
        sumPledges: number
        streamingChannel: string
        numDonations: number
    },
    team: {
        numParticipants: number
        fundraisingGoal: number
        eventName: string
        links: {
            stream: string
            page: string
        }
        eventID: number
        sumDonations: number
        createdDateUTC: string
        name: string
        numAwardedBadges: number
        captainDisplayName: string
        hasTeamOnlyDonations: false
        streamIsLive: boolean
        avatarImageURL: string
        teamID: number
        streamIsEnabled: boolean
        streamingPlatform: string
        sumPledges: number
        streamingChannel: string
        numDonations: number
    },
    donation: {
        displayName: string
        donorID: string
        links: {
            recipient: string
        }
        eventID: number
        createdDateUTC: string
        recipientName: string
        participantID: number
        amount: number
        avatarImageURL: string
        teamID: number
        donationID: string
        message: string
    }
    extraData: {
        timer: string
    }
}
```

For example:
- {{participant.displayName}} For participant name
- {{team.fundraisingGoal}} For teams fundraising goal
- {{donation.amount}} For the donation amount 


## Styling
This app builds with an external output css file. Simply modify the .css file with whatever you want. As noted in **Templates**, the templates support custom html, so feel free to add you own classes to style these as needed reflecing your output requirements.

## Advanced Configuration
You can provide custom functions to your config change the display output based on your own custom logic. This allows, for instance, a custom script to run that displays a different output if a donation comes in at $100. These custom functions allow access to internal mechanisms to perform your custom actions.

**Please note that if an override function is provided in your configuration, the template field is not used. Also if you break your page with custom functions... thats on you.**

Below is an example custom override.

```
override: async (sceneData, controllers) => {
    if (sceneData.donation && sceneData.donation.displayName) {
        return sceneContentData.donation.displayName
    }
    return 'Anonymous'
}
```

The parameters available to the override can be summed up as follows:
```
sceneData: {
    donation: //donation object (see **Templating**) if the context is a donation
    participant: //your participant object (see **Templating**)
    team: //your team object (see **Templating**)
    extraData: {
        timer: TimerContent //current timer if relevant
    },
}
controllers: {
    screenManager: //screen manager instance
    elAPIManager: //extra life API functions
    soundManager: //sound manager
}
```

The custom controllers provide the following functionality:

ScreenManager:

```
hideScreen(divId) //hide a screen by div Id / scene Id
showScreen(divId) //show a screen by div Id / scene Id
goToScreen(divId) //hide all scenes and show one specified
generateContent(template, data) //return mustache processed string
setDivContentById(id, template, data) //apply mustache procesed string to div
processAndActivateScreenContent(screenName, sceneContentData), //reassign scene
createContentChangeTimeout(screenName, timeout, sceneContentData) //above with timeout
```

elAPIManager
```
getParticipantDonations() //async call to fetch donations
getTeamDonations() //async call to get all of team donations
getTeamInfo() //async call to get team information
getParticipantInfo() //async call to get participant information
getTeamParticipants() //async call to get all participants in team
```
soundManager
```
playSound(soundUrl, callback) //play a sound, run a function when done
delaySound(soundUrl, timeout, callback) //above with timeout
saySomething(speechText) //text to speech
```
