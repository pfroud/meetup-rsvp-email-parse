function parseAllEmails(){
  const eventName = "vr/ar party"
  const searchQuery = "from:info@meetup.com AND (subject:(latest RSVPs for "+eventName+") OR subject:(RSVPed to "+eventName+"))";
  const threads = GmailApp.search(searchQuery);
  
  //  Logger.log("query: \""+searchQuery+"\"");
  //  Logger.log("number of threads returned by search: "+threads.length);
  
  
  /*
  threads.forEach(function (thread){
  thread.getMessages().forEach(function(message){      
  const rv = parseMessage(message);
  })
  });
  */
  
  return parseMessage(threads[0].getMessages()[0]);
  
}


function parseMessage(gmailMessage){
  const messageDate = gmailMessage.getDate();
  const rsvpsString = getStringBetween(gmailMessage.getPlainBody().trim(), "\n----\n\n", "View full RSVP list").trim();
  
  const splitRsvpGroups = rsvpsString.split("\n\n")
  
  const count = splitRsvpGroups.length;
  
  var rv = new Array(count);
  
  for(var i = 0; i < count-1; i++) {
    rv[i] = parseRsvpGroup(splitRsvpGroups[i], messageDate, false);
  }
  
  rv[count-1] = parseRsvpGroup(splitRsvpGroups[count-1], messageDate, true);
  
  return rv;
}

function parseRsvpGroup(rsvpGroupString, messageDate, isLastRow){
  
  if(isLastRow){
    // index where "x Cool weirdos are going to this Meetup" starts
    const idx = rsvpGroupString.search(/\d+Cool weirdo/);
    if(idx > -1){
      rsvpGroupString = rsvpGroupString.substring(0, idx);
    }
  }
  
  const splitLines = rsvpGroupString.trim().split("\n");
  
  var rv = parseRsvpLine(splitLines[1]);
  rv.date = parseDateLine(splitLines[0], messageDate);
  return rv;
  
}

function parseDateLine(dateString, messageDate){
  return new Date(dateString + messageDate.getYear());
}

function parseRsvpLine(rsvpString){
  rsvpString = rsvpString.replace(/\-+/, "");
  
  var name, newRsvp, isUpdate;
  
  const delimiters = [
    " updated their RSVP to ",
    " was added to the ",
    " said "
  ];
  
  
  for(var i=0; i<delimiters.length; i++){
    const delim = delimiters[i];
    
    if(stringContains(rsvpString, delim)){
      const splitDelim = rsvpString.split(delim);
      name = splitDelim[0];
      newRsvp = splitDelim[1];
      
      isUpdate = stringContains(delim, "updated");
      break;
    }
  }
  
  return {
    name: name,
    rsvp: newRsvp,
    isUpdate: isUpdate
  };
  
}