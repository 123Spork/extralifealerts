# React & Mustache Extra Life Alerting System

## What is this?
ExtraLifeAlerts is an (in-development) flexible alerting system which masks Extra Life's API.

This software provides a runnable/ buildable and embeddable solution for displaying new extra life donations, total amount $ raised, total time played and a countdown timer leading up until a desired date-time.

The software is designed to be as flexible as possible, providing the capibility to template the look and feel at will using Mustache HTML templating, CSS and JS functions. You can even have different looks for different streaming scenes by simply providing more templates.

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
```
//when built, go to
./dist/assets/base-configuration.json

//this is laid out as follows
//assume all timestamps are utc miliseconds
//compare this with the default provided if confused
{
  participantId: //your extra life id
  teamId: //your extra life team
  eventStartTimestamp: //event start time
  showDonationCents: //show donation decimalised
  donationPopupTimeout: //time duration the donation popup shows
  donationMessagePopupTimeout: //time duration the donation message shows
  speech: {
    voice: //1 to 10, which voice you want to use
    volume: //0 to 1, voice volume
    rate: //0.1 to 10, voice rate
    pitch: //0 to 2, voice pitch
    language: //voice language code: "en", "es" etc
  }
  timer: {
    elementId: //element id of the on screen timer: "#timer"
    template: //templated time format: "{{DD}}d:{{hh}}:{{mm}}:{{ss}}"
  }
  content: {
    "brb":{ //url address that this config applies to (brb.html)
        donationAlertPopup: { //scene/ div id
            override: ( //configurable async override function 
                sceneData: {
                    donation: //donation object if the context is a donation
                    participant: //your participant object
                    team: //your team object
                    extraData: {
                        timer: TimerContent //current timer if relevant
                    },
                }
                controllers: {
                    screenManager: //screen manager instance
                    elAPIManager: //extra life API functions
                    soundManager: //sound manager
                }
            )
            template: //template screen format
            speak: //true or false if you want to speak on scene entry
            speakTemplate: //template of what you want the screen to say
            playSound: //true or false if you want audio to play on entry
            soundUrl: //url of the audio to play
        }
        donationAlertMessagePopup: //...SAME AS ABOVE
        gameDayTimer: //...SAME AS ABOVE
        gameDayCountdownTimer: //...SAME AS ABOVE
    }
  }
}
```

Within the above you can see templating files. The available objects usable in those templates you can find below. 

Note that this the same format for custom overridable functions.

```
//manipulated by altering {{}} tags in the config object
//for instance {{participant.displayName}} for Extra Life username
//be aware that, depending on the context, donation may not be available
{
    participant: {
        displayName: number
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
        displayName?: string
        donorID?: string
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
        message?: string
    }
    extraData: {
        timer: string
    }
}
```

## Advanced Configuration
Part of the app provided is the ability to provide custom functions to change the display output based on custom logic. This allows, for instance, a custom script to run that displays a different output style if a donation comes in at $100. Part of this is access to internal mechanisms to perform custom actions.

**If an override function is provided, the template field is not used**

```
//here you can see a commented out example of an ovveride function, shaped like so:

override: async (sceneData, controllers) => {
    if (sceneData.donation && sceneData.donation.displayName) {
        return sceneContentData.donation.displayName
    }
    return 'Anonymous'
}

//again the parameters are as so
//fair warning that if you break your page with custom functions,
//thats on you
sceneData: {
    donation: //donation object if the context is a donation
    participant: //your participant object
    team: //your team object
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

Going deeper into this, the custom controllers provide the following functionality...

```
//screenManager

hideScreen(divId) //hide a screen by div Id / scene Id
showScreen(divId) //show a screen by div Id / scene Id
goToScreen(divId) //hide all scenes and show one specified
generateContent(template, data) //return mustache processed string
setDivContentById(id, template, data) //apply mustache procesed string to div
processAndActivateScreenContent(screenName, sceneContentData), //reassign scene
createContentChangeTimeout(screenName, timeout, sceneContentData) //above with timeout
```

```
//elAPIManager
getParticipantDonations() //async call to fetch donations
getTeamDonations() //async call to get all of team donations
getTeamInfo() //async call to get team information
getParticipantInfo() //async call to get participant information
getTeamParticipants() //async call to get all participants in team
```
```
//soundManager
playSound(soundUrl, callback) //play a sound, run a function when done
delaySound(soundUrl, timeout, callback) //above with timeout
saySomething(speechText) //text to speech
```

## Styling
This app is build with an output css file. Simply modify the .css file with whatever you want. The templates support custom html, so feel free to add you own classes to style these as needed reflecing your output
