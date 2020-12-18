function eventChannels(client, config) {
    let { google } = require('googleapis');
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

    var start = new Date();
    start.setHours(0, 0, 0, 0); // last midnight

    var end = new Date();
    end.setHours(24, 0, 0, 0); // next midnight

    let calendar = google.calendar('v3');
    calendar.events.list({
        auth: jwtClient,
        calendarId: 'codewithgroup@gmail.com',//whatever
        maxResults: 200,
        showDeleted: true,
        timeMin: start,
        timeMax: end
    }, function (err, response) {
        if (response.data.items.length > 0) {
            response.data.items.forEach(event => {
                console.log(event.summary);

                var server = client.guilds.cache.get(config.server);

                //create the text channel
                server.channels.create(event.summary, "text")
                    .then(channel => {
                        let category = server.channels.cache.get(config.eventCategory.today);

                        if (!category) throw new Error("Category channel does not exist");
                        channel.setParent(category.id);
                    }).catch(console.error);

                //create the voice channel
                server.channels.create(event.summary, {type:"voice"})
                    .then(channel => {
                        let category = server.channels.cache.get(config.eventCategory.today);

                        if (!category) throw new Error("Category channel does not exist");
                        channel.setParent(category.id);
                    }).catch(console.error);
            });
        } else { console.log("No events today") }
    });
}

module.exports = { eventChannels }