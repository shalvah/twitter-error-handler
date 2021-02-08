const tap = require('tap');

const {
    wrapTwitterErrors,
    errors: {
        ProblemWithAuth,
        NotFound
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


t.get('nonexistentpath')
    .catch(e => wrapTwitterErrors('nonexistentpath', e))
    .catch(e => {
        tap.true(e instanceof NotFound);
        tap.same(e.code, codes.NOT_FOUND);
    });

// A simple mock. We want to assert other errors are also propagated.
t.get = () => Promise.reject(new RangeError());
t.get('statuses/mentions_timeline', )
    .catch(e => wrapTwitterErrors('statuses/mentions_timeline', e))
    .catch(e => {
        tap.true(e instanceof RangeError);
    });

const fakeResponse = {"message":"Invalid or expired token.","code":89,"allErrors":[{"code":89,"message":"Invalid or expired token."}],"twitterReply":{
    "errors":[{"code":89,"message":"Invalid or expired token."}]},"statusCode":401};
