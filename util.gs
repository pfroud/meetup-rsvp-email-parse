function getOpenLink(url){
  return CardService.newOpenLink().setUrl(url);
}

function stringContains(wholeThing, searchFor){
  return wholeThing.indexOf(searchFor) > -1;
}

function addTextWidgetToSection(section, message){
  section.addWidget(CardService.newTextParagraph().setText(message));
}

function getStringBetween(input, before, after) {
  return input.split(before)[1].split(after)[0];
}

function objectToString(obj){
  var rv = "{";
  for(var key in obj){
    rv += key+": "+ obj[key] + ", ";
  }
  rv += "}";
  return rv;
}