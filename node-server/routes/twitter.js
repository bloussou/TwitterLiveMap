let express = require('express'),
    router = express.Router();
require('dotenv').config();

// Initialisation de Twit
let Twit = require('twit');

var T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
})

// Configuration de socket io
var io = require('socket.io')();
router.io = io;
var streams = new Map();
var lang = new Map();

io.on("connection", function (socket) {


    socket.on('subscribe', (newTag) => {
        socket.join(newTag);
        if (streams.get(newTag) !== undefined) {
            if (streams.get(newTag)[0] === 0) {
                stream = T.stream('statuses/filter', { track: newTag });
                streams.set(newTag, [1, stream])
            }
            else {
                tagInfo = streams.get(newTag) // [n, stream] where n is the number of user connected to the stream
                var n = tagInfo[0];
                n = n + 1;
                tagInfo[0] = n;
                streams.set(newTag, tagInfo);
            }

        }
        else {
            stream = T.stream('statuses/filter', { track: newTag });
            streams.set(newTag, [1, stream])
        }
    })


    socket.on('newTag', (newTag) => {

        streams.get(newTag)[1].on('tweet', function (tweet) {

            io.in(newTag).emit('tweetLanguage', Array.from(lang));
            if (lang.get(tweet.user.lang) !== undefined) {
                lang.set(tweet.user.lang, lang.get(tweet.user.lang) + 1)
            }
            else {
                lang.set(tweet.user.lang, 1)
            }


            if (tweet.place !== null) {

                io.in(newTag).emit('tweet', toTweet(tweet));
                //io.in(newTag).emit('tweetLanguage', Array.from(lang));
            }
        })
    })

    socket.on('unsubscribe', (tag) => {
        socket.leave(tag);
        var tagInfo = streams.get(tag);
        var n = tagInfo[0];
        if (n === 1) {
            streams.get(tag)[1].stop();
            streams.get(tag)[0] = 0;
        }
        else {
            streams.get(tag)[0] = n - 1;
        }

    })

    socket.on('resetGraph', () => {
        lang = new Map();
    })

});

function toTweet(tweet) {
    var newTweet = new Object();
    newTweet.id = tweet.id;
    newTweet.date = tweet.created_at;
    newTweet.location = tweet.user.location;
    newTweet.place = tweet.place;
    newTweet.coordinates = tweet.place.bounding_box.coordinates[0][0];
    newTweet.text = tweet.text;
    return newTweet;

};

module.exports = router;


