# Chatbase Node.JS Client

## Setting up from repo clone

1. mount the repo
	* `cd chatbase-node`

2. install dependencies
	* `npm install`

3. done!

## Use

Require the client in the target application:

```JS
var chatbase = require('chatbase-node');
```

Set a valid api key, user id, agent-type, and platform on the imported module to automatically create new messages with these fields pre-populated:

```JS
var chatbase = require('chatbase-node')
	.setApiKey(process.env.MY_CHATBASE_KEY)
	.setUserId(process.env.MY_CHATBASE_ID)
	.setPlatform('PLATFORM-X')
	.setAsTypeUser();
	
var msg = chatbase.newMessage();
// the following would then be true
assert(msg.api_key === process.env.MY_CHATBASE_KEY);
```

Or one can set these on each individual message. Note: api key and user id must be provided as arguments to newMessage if one would like to override the factory when it has been previously set.

```JS
var chatbase = require('chatbase-node')
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
var chatbase = require('chatbase-node');
	
var msg = chatbase.newMessage('my-api-key', 'my-user-id')
	.setAsTypeUser()
	.setAsTypeAgent()
	.setTimestamp(Date.now().toString())
	.setPlatform('PLATFORM-Z');
	.setMessage('MY MESSAGE')
	.setIntent('book-flight')
	.setAsHandled()
	.setAsNotHandled()
	.setVersion('1.0')
	.setAsFeedback()
	.setAsNotFeedback()
	.setMessageId('123');
```

Once a message is populated, one can send it to the service and listen on its progress using promises. Note that timestamp is not explicitly set here (although it can be) since it is automatically set on the message to the time of instantiation. Note also that the client type does not need to be explictly set either unless an agent client type is required since the message will automatically default to the user type.

```JS
var chatbase = require('chatbase-node');

chatbase.newMessage('my-api-key', 'my-user-id')
	.setPlatform('INTERWEBZ')
	.setMessage('CAN I HAZ?')
	.setVersion('1.0')
	.send()
	.then(msg => console.log(msg.getCreateResponse()))
	.catch(err => console.error(err));
```

Given that a newly created message can be updated this can be achieved via the message interface as well.

```JS
var chatbase = require('chatbase-node');

chatbase.newMessage('my-api-key', 'my-user-id')
	.setPlatform('INTERWEBZ')
	.setMessage('DO NOT WORK')
	.setVersion('1.0');
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
var chatbase = require('chatbase-node');

const set = chatbase.newMessageSet()
	// The following are optional setters which will produce new messages with
	// the corresponding fields already set!
	.setApiKey('abc')
	.setUserId('123')
	.setPlatform('chat-space');

// Once can add new messages to the set without storing them locally
set.newMessage()
	.setMessage('test_1')
	.setIntent('book-flight')
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
