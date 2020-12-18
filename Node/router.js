const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const calendar = require('./automation/googleCal.js');
const monitoring = require('./prtg/prtg.js')
var schedule = require('node-schedule');
const discordUtils = require('./utils/discordUtils');

monitoring.prtg()
client.login(config.botToken);

//create a test channel


client.on('message', message => {

    console.log(message.content)
    if (message.content.toLowerCase() === '!ping') {
        // send back "Pong." to the channel the message was sent in
        require("./endpoints/ping.js").ping(message)
    }
    else {
        return
    }

});

// Initialize the invite cache
const invites = {};

// Create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);

client.on('ready', () => {
    // "ready" isn't really ready. We need to wait a spell.
    wait(1000);
    console.log("Ready!")

    //move yesterday's events
discordUtils.moveYesterday(client,config);
    //create the channels for today
    //calendar.eventChannels(client, config);

    //start the calendar job
    schedule.scheduleJob('0 0 * * *', () => {
    }) // run everyday at midnight

    // Load all invites for all guilds and save them to the cache.
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });


});



client.on('guildMemberAdd', member => {
    const logChannel = member.guild.channels.cache.find(channel => channel.name === config.inviteLogChannel);

    console.log(member.id);
    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
        // This is the *existing* invites for the guild.
        const ei = invites[member.guild.id];
        // Update the cached invites for the guild.
        invites[member.guild.id] = guildInvites;
        // Look through the invites, find the one for which the uses went up.
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        // Get the log channel (change to your liking)
        // A real basic message with the information we need. 
        for (i = 0; i < config.inviteTokens.length; i++) {
            if (invite.code === config.inviteTokens[i].token) {
                let role = member.guild.roles.cache.find(r => r.name === config.inviteTokens[i].role);

                // Add the role!
                member.roles.add(role).catch(console.error);
                logChannel.send("Joined using code " + config.inviteTokens[i].token + " assigned role " + config.inviteTokens[i].role)
                member.send(config.inviteTokens[i].msg);


            }
        }

    });

});



