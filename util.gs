function getOpenLink(url) {
  return CardService.newOpenLink().setUrl(url);
}

function stringContains(wholeThing, searchFor) {
  // String.prototype.includes not supported in Google Apps Scripts
  return wholeThing.indexOf(searchFor) > -1;
}

function addTextWidgetToSection(section, message) {
  section.addWidget(CardService.newTextParagraph().setText(message));
}

function getStringBetween(input, before, after) {
  return input.split(before)[1].split(after)[0];
}

function getHeader(title) {
  return CardService.newCardHeader()
  .setTitle(title)
  .setImageUrl("https://cdn1.iconfinder.com/data/icons/iconza-circle-social/64/697072-meetup-128.png");
}