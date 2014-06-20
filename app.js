'use strict';

var express = require('express');
var Twitter = require('twit');
var twitterCreds = require('./creds.json');

//Twitter Application information
var twitter = new Twitter(twitterCreds);

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
app.get('/tweets', function(req, res) {
	var stream = twitter.stream('statuses/filter', { locations: [ '-180','-90','180','90' ] });
	var tweetPayload = [];
	var resSent;
	res.setHeader( 'content-type', 'application/json' );

	stream.on('tweet', function (tweet) {
		if( tweetPayload.length > 20 ) {
			if( !resSent ){
				resSent = true;
				stream.stop();
				res.send( tweetPayload );
			}
		} else {
			tweetPayload.push(tweet);
		}
	});

	//Handling a twitter stream cutoff situation
	setTimeout(function(){
		if( !resSent ){
			resSent = true;
			stream.stop();
			res.send( tweetPayload );
		}
	},5000);
});

// START SERVER
var server = app.listen(app.get('port'), function() {
	console.log('listening on port', app.get('port'));
});
