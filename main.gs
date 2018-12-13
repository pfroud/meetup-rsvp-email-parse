function doSomething() {
  
  const header = CardService.newCardHeader().setTitle("Meetup RSVP Email Parser")
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
  
  const searchQuery = "subject:(vr/ar party)";
  const threads = GmailApp.search(searchQuery);
  
  const widgetText = CardService.newTextParagraph().setText("Search query <b>\""+searchQuery+"\"</b> returned "+threads.length +" threads.");
  
  
  const plainBody = threads[0].getMessages()[0].getPlainBody();
  
  const eventName = getBetween(plainBody, "Latest RSVPs for", "with Silicon Valley Offbeat Fun for 20s & 30s").trim();
  const eventDate = getBetween(plainBody, "with Silicon Valley Offbeat Fun for 20s & 30s", "\n\n----\n\n").trim();
  
  
  const widgetText2 = CardService.newTextParagraph().setText(eventName+"; "+eventDate);
  
  
  
  const widgetButtonToOpenLink = CardService.newTextButton().setText("open link to pfroud.com")
  .setOpenLink(CardService.newOpenLink().setUrl("https://pfroud.com/meetup-rsvp-email-parser/"));
  
  
  const section = CardService.newCardSection().addWidget(widgetText).addWidget(widgetText2).addWidget(widgetButtonToOpenLink);
  
  const card = CardService.newCardBuilder().setName("name of the card").setHeader(header).addSection(section).build();
  
  
  return CardService.newUniversalActionResponseBuilder().displayAddOnCards([card]).build();
  
  
}

function getBetween(input, before, after) {
  return input.split(before)[1].split(after)[0];
}