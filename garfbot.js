const _ = require('lodash');
const config = require('config');
const logger = require('./utils/logger');
const muxer = require('./utils/muxer');
const SlackBot = require('slackbots');

const params = {
  icon_emoji: ':garf:'
};

const bot = new SlackBot({
  token: config.slack.api_token,
  name: config.username
});

bot.on('start', () => {
  logger.log(`Connected as ${bot.self.name} (ID ${bot.self.id})`);
});

bot.on('message', (data) => {
  switch (data.type) {
    case 'message':
      muxer({
        self: {
          id: bot.self.id,
          name: bot.self.name
        },
        message: data
      }).then(replies => {
        _(replies).each(reply => {
          bot.postMessageToChannel(config.slack.default_room, reply, params)
            .fail(logger.error);
        });
      });
      break;

    default:
      break;
  }
});