const WebSocketClient = require('websocket').client;
const lcuAuthInfo = require('./lcu_auth');

let plugins;

// Configures the websocket connection to...
// a. Allow uncertified connections to the client(client has invalid cert).
// b. Authenticate the connection with the password from lockfile.
let leagueWsClient = new WebSocketClient({
	tlsOptions: {
		rejectUnauthorized: false,
		auth: `riot:${lcuAuthInfo.password}`,
	},
});

let initSocketHandler = function(newPlugins) {
    plugins = newPlugins;
	// TODO: Add an error message or something to the window.
	leagueWsClient.on('connectFailed', error => {
		info.error(err.message);
	});

	leagueWsClient.on('connect', connection => {
		logger.info("Connected to the LCU's internal WebSocket server");
		// Tells the client to send me all JSON API event information.
		// Thanks to molenzwiebel, who made the project(Mimic) I found this snippet in.
		connection.send('[5,"OnJsonApiEvent"]');
		logger.info('Successfully subscribed to JSON API client events');

		connection.on('error', error => {
			console.log(error.toString());
		});

		connection.on('close', () => {
			logger.info('WebSocket connection with client closed');
		});

		connection.on('message', message => {
			// Make sure the message is a string, and also make sure that it isn't blank(for some reason, the LCU always sends a blank message first...).
			if (message.type != 'utf8' || message.utf8Data === '') return;
			handleMessage(message);
		});
	});
};

function handleMessage(message) {
    let parsedData = JSON.parse(message.utf8Data);
	let uri = parsedData[2].uri;

    // Check every plugin's trigger URI, and if it's the same URI, pull the trigger.
    plugins.forEach( plugin => {
        if (uri.startsWith(plugin.triggerURI) && plugin.isEnabled) {
            plugin.onTrigger(parsedData[2], uri);
		}
    })
}

// Already configured to use the password from lockfile, all I need to do is pass the port.
leagueWsClient.connect(`wss://127.0.0.1:${lcuAuthInfo.port}/`);

module.exports = { initSocketHandler: initSocketHandler };
