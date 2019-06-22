/**
called when an email is opened.
Which function gets called when an email is opened is specified in the manifest (appsscript.json).
**/
function handleContextualTrigger(actionEvent) {
  // need to get an access token to do anything
  const accessToken = actionEvent.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  // get message that triggered the add-on to start
  const message = GmailApp.getMessageById(actionEvent.messageMetadata.messageId);  
  const messageSubject = message.getSubject();
  
  var sectionMain = CardService.newCardSection();
  
  var textInputEventName = CardService.newTextInput().setFieldName("eventName").setTitle("Event name");
  
  if(message.getFrom() == '"Silicon Valley Offbeat Fun for 20s & 30s" <info@meetup.com>') {
    // try to figure out the name of the event
    
    if(stringContains(messageSubject, "Latest RSVPs for")) {
      addTextWidgetToSection(sectionMain, "Found this event name in the open message:");
      textInputEventName.setValue(getStringBetween(messageSubject, "Latest RSVPs for ", " on"));
      
    } else if (stringContains(subject, "RSVPed to")) {
      addTextWidgetToSection(sectionMain, "Found this event name in the open message:");
      textInputEventName.setValue(getStringBetween(messageSubject, "RSVPed to ", " on"));
      
    } else {
      addTextWidgetToSection(sectionMain, "Enter the name of the event:");
    }
    
    
  } else {
    addTextWidgetToSection(sectionMain, "Enter the name of the event:");
  }
  
  sectionMain.addWidget(textInputEventName);
  
  
  sectionMain.addWidget(
    CardService.newTextButton().setText("parse RSVP emails")
    .setOnClickAction(
      CardService.newAction().setFunctionName("parseRSVPEmails")
    )
  );
  
  return CardService.newCardBuilder().setHeader(getHeader("Meetup RSVP Email Parser")).addSection(sectionMain).build();
  
  
}

function parseRSVPEmails(actionEvent) {
  
  const section = CardService.newCardSection();
  
  const eventName = actionEvent.formInput.eventName.trim();
  
  if(eventName.length > 0) {
    const parsed = parseAllEmails(eventName); 
    addTextWidgetToSection(section, "Here's the output:");
    section.addWidget(CardService.newTextInput().setMultiline(true).setFieldName("output").setValue(JSON.stringify(parsed)));
  } else {
    addTextWidgetToSection(section, "The event name is empty");
  }
  
  
  const card = CardService.newCardBuilder().setHeader(getHeader("Results")).addSection(section).build();
  
  const nav = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .build();
  
}





