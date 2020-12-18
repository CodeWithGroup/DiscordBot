module.exports = {
    getUserFromMention: (client, mention) => {
        if (!mention) return;

        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            return client.users.cache.get(mention);
        }
    },
    clearOld, moveYesterday
}

function clearOld(client, config) {

}

function moveYesterday(client, config) {

}