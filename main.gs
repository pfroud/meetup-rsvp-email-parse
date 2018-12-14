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
      //      .setFunctionName("actionResponseShowNotification")
      .setFunctionName("actionResponsePushCard")
      //      .setParameters({notificationMessage: "pressed button"})
    )
  );
  
  
  const header = CardService.newCardHeader()
  .setTitle("Meetup RSVP Email Parser - start")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  return CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  
}

function actionResponsePushCard(){
  
  const header = CardService.newCardHeader()
  .setTitle("push card")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  const section = CardService.newCardSection();
  addTextWidgetToSection(section, "action response push card");
  
  const card = CardService.newCardBuilder().setHeader(header).addSection(section).build();
  
  const nav = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder()
  .setNavigation(nav)
  .build();
  
}


function actionResponseShowNotification(e){
  return CardService.newActionResponseBuilder().setNotification(
    CardService.newNotification()
    .setText(e.parameters.notificationMessage)
  ).build();
}

function getOpenLink(url){
  return CardService.newOpenLink().setUrl(url);
}

function stringContains(wholeThing, searchFor){
  return wholeThing.indexOf(searchFor) > -1;
}

function addTextWidgetToSection(section, message){
  section.addWidget(CardService.newTextParagraph().setText(message));
}

function parseEmail(){
  const eventName = "ar/vr party"
  const searchQuery = "subject:(latest RSVPs for "+eventName+") OR subject:(RSVPed to "+eventName+")";
  const threads = GmailApp.search(searchQuery);
  
  threads.forEach(function (thread){
    thread.getMessages().forEach(function(message){
      const plainBody = message.getPlainBody();
    })
  });
  
  const widgetText = CardService.newTextParagraph().setText("Search query <b>\""+searchQuery+"\"</b> returned "+threads.length +" threads.");
  
  
  const plainBody = threads[0].getMessages()[0].getPlainBody();
  
  
}

function getStringBetween(input, before, after) {
  return input.split(before)[1].split(after)[0];
}