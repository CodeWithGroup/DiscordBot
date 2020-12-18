let {google} = require('googleapis');
let privatekey = require("./private-key.json");
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
       privatekey.client_email,
       null,
       privatekey.private_key,
       ['https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log("Successfully connected!");
 }
});

let calendar = google.calendar('v3');
calendar.events.list({
   auth: jwtClient,
   calendarId: 'codewithgroup@gmail.com',//whatever
   maxResults:200,
   showDeleted: true
}, function (err, response) {
    response.data.items.forEach(event => {
        console.log(event.summary);

    });
});