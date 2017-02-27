# Chatbase Node.JS Client

## Setting up from repo clone

1. mount the repo
	* `cd chatbase-node`

2. install dependencies
	* `npm install`

3. done!

## Use

Require the client in your application:

```JS
var chatbase = require('chatbase-node');
```

Set your api key, user id, agent-type, and platform on the imported module to automatically create new messages with these fields pre-populated:

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

Or you can set these on each individual message. Note: api key and user id must be provided as arguments to newMessage if you would like to override the factory when it has been previously set.

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