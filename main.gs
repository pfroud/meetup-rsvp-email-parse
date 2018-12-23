/**
called when an email is opened. specified in the manifest.
**/
function handleContextualTrigger(e) {
  const accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  const message = GmailApp.getMessageById(e.messageMetadata.messageId);  
  const subject = message.getSubject();
  
  var section = CardService.newCardSection();
  
  var textInput = CardService.newTextInput().setFieldName("eventName").setTitle("Event name");
  
  if(message.getFrom() == '"Silicon Valley Offbeat Fun for 20s & 30s" <info@meetup.com>'){
    if(stringContains(subject, "Latest RSVPs for")){
      addTextWidgetToSection(section, "Found this event name in the open message:");
      textInput.setValue(getStringBetween(subject, "Latest RSVPs for ", " on"));
      
    } else if (stringContains(subject, "RSVPed to")){
      addTextWidgetToSection(section, "Found this event name in the open message:");
      textInput.setValue(getStringBetween(subject, "RSVPed to ", " on"));
      
    } else {
      addTextWidgetToSection(section, "Enter the name of the event:");
    }
    
    
  } else {
    addTextWidgetToSection(section, "Enter the name of the event:");
    
    
  }
  
  section.addWidget(textInput);
  
  
  section.addWidget(
    CardService.newTextButton().setText("parse RSVP emails")
    .setOnClickAction(
      CardService.newAction().setFunctionName("actionResponsePushCard")
    )
  );
  
  
  const header = CardService.newCardHeader()
  .setTitle("Meetup RSVP Email Parser - start")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  return CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  
}

function actionResponsePushCard(e){
  
  const header = CardService.newCardHeader()
  .setTitle("Results")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  const section = CardService.newCardSection();
  
  const eventName = e.formInput.eventName.trim();
  
  if(eventName.length > 0){
  
    const parsed = parseAllEmails(eventName);
    
    /*
    parsed.forEach(function(rsvpObj){
      addTextWidgetToSection(
        section,
        "<b>date:</b> " + rsvpObj.date +
        "<br><b>name:</b> " + rsvpObj.name + 
        "<br><b>rsvp:</b> " + rsvpObj.rsvp + 
        "<br><b>isUpdate:</b> " + rsvpObj.isUpdate
      );
    });
    */
    
    
    addTextWidgetToSection(section, "Here's the output:");
    section.addWidget(CardService.newTextInput().setMultiline(true).setFieldName("output").setValue(JSON.stringify(parsed)));
    
    
    /*
    addTextWidgetToSection(section, "Array length is "+parsed.length+", if this is okay click the button below.");
    const url = "https://pfroud.com/meetup-rsvp-email-parser/?data=" + encodeURIComponent(JSON.stringify(parsed));
    section.addWidget(CardService.newTextButton().setText("send results to grapher").setOpenLink(getOpenLink(url)));
    */
    
  } else {
    addTextWidgetToSection(section, "The event name is empty");
  }
  
  
  const card = CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  const nav = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .build();
  
}





