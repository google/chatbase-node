# Chatbase Node.JS Client
> This is not an official Google Product

## Use

Install Via NPM

```sh
npm install --save @google/chatbase
```

Require the client in the target application:

```JS
var chatbase = require('@google/chatbase');
```

Set a valid api key, user id, agent-type, and platform on the imported module to automatically create new messages with these fields pre-populated:

```JS
var chatbase = require('@google/chatbase')
	.setApiKey(process.env.MY_CHATBASE_KEY) // Your Chatbase API Key
	.setPlatform('PLATFORM-X') // The platform you are interacting with the user over
	.setAsTypeUser(); // The type of message you are sending to chatbase: user (user) or agent (bot)
	
var msg = chatbase.newMessage();
// the following would then be true
assert(msg.api_key === process.env.MY_CHATBASE_KEY);
```

Or one can set these on each individual message. Note: api key and user id must be provided as arguments to newMessage if one would like to override the factory when it has been previously set.

```JS
var chatbase = require('@google/chatbase')
	.setAsTypeAgent()
	.setPlatform('PLATFORM-Y');
	
var msg = chatbase.newMessage('my-api-key', 'my-user-id')
	.setAsTypeUser()
	.setPlatform('PLATFORM-Y');
// the following would then be true
assert(msg.platform === 'PLATFORM-Y');
```

All fields, with the exception of user id and api key can be set on a message instance. User id and api key must be given as arguments when the message is instantiated.

```JS
var chatbase = require('@google/chatbase');
	
var msg = chatbase.newMessage('my-api-key', 'my-user-id')
	.setAsTypeUser() // sets the message as type user
	.setAsTypeAgent() // sets the message as type agent
	// WARNING: setTimestamp() should only be called with a Unix Epoch with MS precision
	.setTimestamp(Date.now().toString()) // Only unix epochs with Millisecond precision
	.setPlatform('PLATFORM-Z') // sets the platform to the given value
	.setMessage('MY MESSAGE') // the message sent by either user or agent
	.setIntent('book-flight') // the intent of the sent message (does not have to be set for agent messages)
	.setAsHandled() // set the message as handled -- this means the bot understood the message sent by the user
	.setAsNotHandled() // set the message as not handled -- this means the opposite of the preceding
	.setVersion('1.0') // the version that the deployed bot is
	.setUserId('user-1234') // a unique string identifying the user which the bot is interacting with
	.setAsFeedback() // sets the message as feedback from the user
	.setAsNotFeedback() // sets the message as a regular message -- this is the default
	.setCustomSessionId('123') // custom sessionId. A unique string used to define the scope of each individual interaction with bot.
	.setMessageId('123'); // the id of the message, this is optional
	.setClientTimeout(5000) // Set the TTL in Milliseconds on requests to the Chatbase API. Default is 5000ms.
```

Once a message is populated, one can send it to the service and listen on its progress using promises. Note that timestamp is not explicitly set here (although it can be) since it is automatically set on the message to the time of instantiation. Note also that the client type does not need to be explictly set either unless an agent client type is required since the message will automatically default to the user type.

```JS
var chatbase = require('@google/chatbase');

chatbase.newMessage('my-api-key')
	.setPlatform('INTERWEBZ')
	.setMessage('CAN I HAZ?')
	.setVersion('1.0')
	.setUserId('unique-user-0')
	.send()
	.then(msg => console.log(msg.getCreateResponse()))
	.catch(err => console.error(err));
```

Given that a newly created message can be updated this can be achieved via the message interface as well.

```JS
var chatbase = require('@google/chatbase');

chatbase.newMessage('my-api-key', 'my-user-id')
	.setPlatform('INTERWEBZ')
	.setMessage('DO NOT WORK')
	.setVersion('1.0');
	.setUserId('unique-user-0')
	.send()
	.then(msg => {
		msg.setIntent('an-intent')
			.setAsFeedback()
			.setAsNotHandled()
			.update()
			.then(msg => console.log(msg.getUpdateResponse()))
			.catch(err => console.error(err));
	})
	.catch(err => console.error(err));
```

Groups of messages can also be queued and sent together:

```JS
var chatbase = require('@google/chatbase');

const set = chatbase.newMessageSet()
	// The following are optional setters which will produce new messages with
	// the corresponding fields already set!
	.setApiKey('abc')
	.setPlatform('chat-space');

// Once can add new messages to the set without storing them locally
set.newMessage()
	.setMessage('test_1')
	.setIntent('book-flight')
	.setUserId('unique-user-0')
	.setClientTimeout(8000)
	// This is a regular message object with all the same setter with the caveat
	// that one cannot send the message individually. All other setter methods
	// still apply though.

// One can also store the reference to the individual message if one would like
// to keep a reference to the individual message instance
const msg = set.newMessage()
	.setMessage('test_2')
	// Pass msg around and profit

// Once the desired messages are queued on the set it can be sent
set.sendMessageSet()
	.then(set => {
		// The API accepted our request!
		console.log(set.getCreateResponse());
	})
	.catch(error => {
		// Something went wrong!
		console.error(error);
	})
```
