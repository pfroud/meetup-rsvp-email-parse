/**
called when an email is opened. specified in the manifest.
**/
function handleContextualTrigger(e) {
  const accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  const message = GmailApp.getMessageById(e.messageMetadata.messageId);  
  const subject = message.getSubject();
  
  var section = CardService.newCardSection();
  
  var textInput = CardService.newTextInput().setFieldName("textInputEventName").setTitle("Event name");
  
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
      CardService.newAction()
      .setFunctionName("actionResponsePushCard")
      .setParameters({eventName: "whatever"})
    )
  );
  
  
  const header = CardService.newCardHeader()
  .setTitle("Meetup RSVP Email Parser - start")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  return CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  
}

function actionResponsePushCard(e){
  
  //e.parameters.eventName
  
  const parsed = parseAllEmails();
  
  const header = CardService.newCardHeader()
  .setTitle("Results")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  const section = CardService.newCardSection();
  
  
  parsed.forEach(function(rsvpObj){
    addTextWidgetToSection(section,
                           "<b>date:</b> " + rsvpObj.date + "<br><b>name:</b> " + rsvpObj.name + "<br><b>rsvp:</b> " + rsvpObj.rsvp + "<br><b>isUpdate:</b> " + rsvpObj.isUpdate
                          );
  });
  
  
  
  const card = CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  const nav = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .build();
  
}





