# React & Mustache Extra Life Alerting System

## What is this?
ExtraLifeAlerts is an (in-development) flexible alerting system which masks Extra Life's API.

This software provides a runnable/ buildable and embeddable solution for displaying new extra life donations, total amount $ raised, total time played, a countdown timer leading up until a desired date-time and more.

The software is designed to be as flexible as possible, providing the capibility to template the look and feel at will using Mustache HTML templating and CSS. You can even have different looks for different streaming scenes by simply providing more templates.

## Setup
This setup assumes you have npm running locally.
```
//to build and launch a hot-change react service:
npm install
npm run watch

//to build a standalone js/ html launcher (./build)
npm install
npm run build
```

## Configuring
Right now we're a bit light on the ground for flexible configuration, so bear with me as this is implemented.
```
//go to
src/config.ts
//modify the exported config object to manipulate alerting output
//note:: the running service url (for example /brb) directly ties to the content key
//for this reason, the base / path will likely break at this time
```
```
//available configurable values for mustache templating
//manipulated by altering {{}} tags in the config object
//for instance {{participant.displayName}} for Extra Life username
//be aware that, depending on the functionality, some may not be 
//available
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
Part of the app provided is the ability to provide custom functions to logically change the display output based on custom logic. This allows, for instance, a custom script to run that displays a different output style if a donation comes in of $100. Part of this, in progress, is access to the internal mechanisms to perform custom actions. This would allow setting timeouts to display other screens, displaying different images and, in future, playing different audio.

```
//go to ./src/config.ts
//inside of here you can see a commented out example of an ovveride function, shaped like so:

override: async (sceneContentData: SceneContentData, _controller: CustomControllers) => {
    if (sceneContentData.donation?.displayName) {
        return sceneContentData.donation.displayName
    }
    return 'Anonymous'
}
```
In the above example you can see the custom use case of this, catching donations without a display name and returning a custom string. In the typing, you can see `SceneContentData`, the contents of which is the same stucture as that which is influencing mustache. The custom controllers parameter is still being devised, but would contain the ScreenManager instance, AudioManager etc.

**If an override function is provided, the template field is not used**

## Styling
This app is equipped with scss support. Simply modify the main.css file with whatever you want. The templates support custom html, so feel free to add you own classes to style these as needed.
