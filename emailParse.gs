function parseAllEmails(eventName) {
  const searchQuery = "from:info@meetup.com AND (subject:(latest RSVPs for "+eventName+") OR subject:(RSVPed to "+eventName+"))";
  const threads = GmailApp.search(searchQuery);
  const threadCount = threads.length;
  
  var rv = [];
  
  threads.forEach(function (thread) {
    thread.getMessages().forEach(function(message) {
      rv = rv.concat(parseMessage(message));
    })
  });
  return rv;
  
  //return parseMessage(threads[0].getMessages()[0]);
  
  //return parseMessage(GmailApp.getMessageById("16752b24b28f3fdd"));
  
}


function parseMessage(gmailMessage) {
  /*
  The emails from Meetup have Content-Type: multipart/alternative, with two parts. One part is text/plain
  and the other is text/html. The plaintext and HTML versions contain different information. We want to
  get the plaintext version.
  */
  const plainBodyStr = gmailMessage.getPlainBody().trim();
  
  /*
  The emails start with a header which says the name of the group, name of the event, and event date and time.
  The footer contains a link to the full RSVP list and a bunch of links to Meetup.
  Remove the header and footer to extract only the RSVP list.
  */
  const rsvpsString = getStringBetween(plainBodyStr, "\n----\n\n", "View full RSVP list").trim();
  
  /*
  RSVP records are separated by two newlines, and there are two newlines before the first record.
  But, the last record has a string like "15 Cool weirdos are going to this Meetup" right after,
  with only one newline between.
  We can split the string on two newlines, then process everything except the last one in a loop.
  The last one needs special treatment.
  */
  const splitRsvpGroups = rsvpsString.split("\n\n");
  const groupCount = splitRsvpGroups.length;
  var rv = new Array(groupCount);
  for(var i = 0; i < groupCount-1; i++) {
    rv[i] = parseRsvpGroup(splitRsvpGroups[i], gmailMessage, false);
  }
  
  // last row needs special treatment
  rv[groupCount-1] = parseRsvpGroup(splitRsvpGroups[groupCount-1], gmailMessage, true);
  
  return rv;
}

function parseRsvpGroup(rsvpGroupString, gmailMessage, isLastRow) {
  if(isLastRow) {
  
    /*
    The last record has a string like "15 Cool weirdos are going to this Meetup" immediateley after it.
    Need to check for and remove it manually.
    */
    const idx = rsvpGroupString.search(/\d+ Cool weirdo/);
    if(idx > -1){
      rsvpGroupString = rsvpGroupString.substring(0, idx).trim();
    }
  }
  
  const splitLines = rsvpGroupString.trim().split("\n");
  /*
  Index zero has date and time, for example "Jun 7, 10:17 PM"
  Index one has person's name and the RSVP, for example "Marie updated their RSVP to No"
  */
  var rv = parseRsvpLine(splitLines[1]);
  rv.rsvpDate = parseDateLine(splitLines[0], gmailMessage.getDate());
  rv.gmailMessageID = gmailMessage.getId();
  rv.gmailMessageDate = gmailMessage.getDate().toString();
  return rv;
  
}

function parseRsvpLine(rsvpString) {
  rsvpString = rsvpString.replace(/\-+/, "").replace(", First Timer,", "");
  
  var name, latestRsvp, isUpdate;
  
  const delimiters = [
    " updated their RSVP to ",
    " was added to the ",
    " said "
  ];
  
  for(var i = 0; i < delimiters.length; i++) {
    var delim = delimiters[i];
    if(stringContains(rsvpString, delim)) {
      const splitDelim = rsvpString.split(delim);
      name = splitDelim[0];
      latestRsvp = splitDelim[1].toLowerCase();
      isUpdate = stringContains(delim, "updated");
      break;
    }
  }
  
  return {
    name: name,
    rsvp: latestRsvp,
    isUpdate: isUpdate
  };
  
}

function parseDateLine(dateString, messageDate){
  return new Date(dateString + messageDate.getYear());
}