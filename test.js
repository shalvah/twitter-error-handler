const tap = require('tap');

const {
    wrapTwitterErrors,
    errors: {
        ProblemWithAuth,
        BadRequest
    },
    codes,
} = require('./index');

const Twit = require('twit');

const t = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'something',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'something',
    access_token: process.env.TWITTER_ACCESS_TOKEN || 'something',
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRE || 'something',
});

t.get('statuses/mentions_timeline')
    .catch(e => wrapTwitterErrors('statuses/mentions_timeline', e))
    .catch(e => {
        tap.true(e instanceof ProblemWithAuth);
        tap.same(e.code, codes.INVALID_OR_EXPIRED_TOKEN);
    });


t.get('rarararara')
    .catch(e => wrapTwitterErrors('rarararara', e))
    .catch(e => {
        tap.true(e instanceof BadRequest);
        tap.same(e.code, codes.NOT_FOUND);
    });

const fakeResponse = {"message":"Invalid or expired token.","code":89,"allErrors":[{"code":89,"message":"Invalid or expired token."}],"twitterReply":{
    "errors":[{"code":89,"message":"Invalid or expired token."}]},"statusCode":401};
