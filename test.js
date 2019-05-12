const tap = require('tap');

const {
    BackOffTwitterError,
    ClientTwitterError,
    BadAuthTwitterError,
    handleTwitterErrors
} = require('./index');

const Twit = require('twit');

const t = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'something',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'something',
    access_token: process.env.TWITTER_ACCESS_TOKEN || 'something',
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRE || 'something',
});

tap.rejects(() => {
    return t.get('statuses/mentions_timeline')
        .catch(e => handleTwitterErrors(e, 'statuses/mentions_timeline'))
}, BadAuthTwitterError);

const fakeResponse = {"message":"Invalid or expired token.","code":89,"allErrors":[{"code":89,"message":"Invalid or expired token."}],"twitterReply":{
    "errors":[{"code":89,"message":"Invalid or expired token."}]},"statusCode":401};
