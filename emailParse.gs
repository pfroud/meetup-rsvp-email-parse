function parseAllEmails(eventName){
  const searchQuery = "from:info@meetup.com AND (subject:(latest RSVPs for "+eventName+") OR subject:(RSVPed to "+eventName+"))";
  const threads = GmailApp.search(searchQuery);
  
  const threadCount = threads.length;
  
  
  var rv = [];
  
  threads.forEach(function (thread){
    thread.getMessages().forEach(function(message){      
      rv = rv.concat(parseMessage(message));
    })
  });
  return rv;
  
  
  //return parseMessage(threads[0].getMessages()[0]);
  
//  return parseMessage(GmailApp.getMessageById("16752b24b28f3fdd"));
  
}


function parseMessage(gmailMessage){
  const rsvpsString = getStringBetween(gmailMessage.getPlainBody().trim(), "\n----\n\n", "View full RSVP list").trim();
  
  const splitRsvpGroups = rsvpsString.split("\n\n");
  

  const groupCount = splitRsvpGroups.length;
  
  var rv = new Array(groupCount);
  
  for(var i = 0; i < groupCount-1; i++) {
    rv[i] = parseRsvpGroup(splitRsvpGroups[i], gmailMessage, false);
  }
  
  rv[groupCount-1] = parseRsvpGroup(splitRsvpGroups[groupCount-1], gmailMessage, true);
  
  return rv;
}

function parseRsvpGroup(rsvpGroupString, gmailMessage, isLastRow){
  
  
  if(isLastRow){
    // index where "x Cool weirdos are going to this Meetup" starts
    const idx = rsvpGroupString.search(/\d+ Cool weirdo/);
    if(idx > -1){
      rsvpGroupString = rsvpGroupString.substring(0, idx).trim();
    }
  }
  
  const splitLines = rsvpGroupString.trim().split("\n");
  
  
  var rv = parseRsvpLine(splitLines[1]);
  rv.rsvpDate = parseDateLine(splitLines[0], gmailMessage.getDate());
  rv.messageID = gmailMessage.getId();
  rv.messageDate = gmailMessage.getDate().toString();
  return rv;
  
}

function parseDateLine(dateString, messageDate){
  return new Date(dateString + messageDate.getYear());
}

function parseRsvpLine(rsvpString){
  rsvpString = rsvpString.replace(/\-+/, "").replace(", First Timer,", "");
  
  var name, newRsvp, isUpdate;
  
  const delimiters = [
    " updated their RSVP to ",
    " was added to the ",
    " said "
  ];
  
  
  for(var i=0; i<delimiters.length; i++){
    var delim = delimiters[i];
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