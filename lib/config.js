const convict = require('convict');

const config = convict({
  create_endpoint: {
      doc: "Chatbase create endpoint url.",
      format: String,
      default: 'https://chatbase-area120.appspot.com/api/message'
  },
  create_set_endpoint: {
      doc: "Chatbase create set endpoint url.",
      format: String,
      default: 'https://chatbase-area120.appspot.com/api/messages'
  },
  update_endpoint: {
      doc: "Chatbase update endpoint url.",
      format: String,
      default: 'https://chatbase-area120.appspot.com/api/message/update'
  }
});

config.validate({ allowed: "strict" });

// Make config accessible as JS object
module.exports = config.getProperties();
