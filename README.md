# Meetup RSVP email parser

## Background & motivation

I organize community events with [Silicon Valley Offbeat Fun](https://www.meetup.com/Offbeat-Fun/).  We host our group on Meetup.

It is important to know in advance how many people will attend an event. Meetup allows guests to RSVP to events and keeps track of the numbers. But, in our experience, only about half of the people who RSVP yes will actually come.

For an event organizer, having fewer people attend than planned is frustrating and can sometimes lead to a lower quality event. To discourage this behavior, the organizers keep track of unreliable guests. We record a strike to people who either:

* RSVP yes but do not show up to the event
* Change their RSVP from yes to no within 48 hours of the start of the event

After three strikes, they may be banned from the group. 

Meetup sends automated emails to an event's organizers when the RSVPs change. Unfortunately, these emails are usually misleading. This project aims to process RSVP emails and produce an unambiguous conclusion.


## Problem example

This part is so long I moved it into a [separate file](the-problem.md).

## Operation

It's a [Gmail Add-on](https://developers.google.com/gmail/add-ons/). The add-on collects RSVP data from multiple emails and produces a big JSON string. Next, the user must paste the JSON string into my [meetup-rsvp-email-parse-client](https://github.com/pfroud/meetup-rsvp-email-parse-client) tool. That tool reads the JSON and draws a chart.
 

If you want to run this add-on yourself:

1. Follow the [Gmail Add-on Quickstart](https://developers.google.com/gmail/add-ons/guides/quickstart) to learn how to set up the environment.
2. Either copy and paste the code from this repository, or use the [Google Apps Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo) browser extension to pull the code from Github.
3. Go to the Gmail web interface (mail.google.com). 
4. If you don't see a thin sidebar on the right, click the small "<" icon on the bottom-right of the browser window.
5. Open any email.
6. Click the red circular M icon on the sidebar. 
7. If you opened an RSVP email, it will detect the name of the event. Otherwise, type in the event name.
8. Click the "parse RSVP emails button."
9. After several seconds, it will come back with a big JSON string. Click in the text area with the JSON string, hit ctrl-A then ctrl-C.
10. Paste the JSON string into my [meetup-rsvp-email-parse-client](https://github.com/pfroud/meetup-rsvp-email-parse-client) , which isn't done yet.

