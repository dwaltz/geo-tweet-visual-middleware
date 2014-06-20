'use strict';

var express = require('express');
var Twitter = require('twit');

//Twitter Application information
var twitter = new Twitter({
	consumer_key: 'ob4kks6sec77NVbEq317SDS4m',
	consumer_secret: '9WGERSvYsEe9pPy2Amy0ZwHYkdd1DBuFnTEMDiMW0nnQ73eScc',
	access_token: '884498701-Eu1DKP2oFlrk3jGMQxt5EuMEGLRTSsGmnglv2oQE',
	access_token_secret: 'pBAe5yguK9T62n0xdMbqNrrAkYOm4tMJYMNAbbSz8BfQ3'
});

var app = express();

// configure express
app.set('port', process.env.PORT || 9000);
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);

// index page
app.get('/test', function(req, res) {
	var stream = twitter.stream('statuses/filter', { locations: [ '-180','-90','180','90' ] });
	var tweetPayload = [];
	res.setHeader( 'content-type', 'application/json' );

	stream.on('tweet', function (tweet) {
		if( tweetPayload.length > 20 ) {
			stream.stop();
			res.send( tweetPayload );
		} else {
			tweetPayload.push(tweet);
		}
	});
});

// START SERVER
var server = app.listen(app.get('port'), function() {
	console.log('listening on port', app.get('port'));
});