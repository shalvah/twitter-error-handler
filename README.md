# twitter-error-handler

[![npm version](https://badge.fury.io/js/twitter-error-handler.svg)](https://badge.fury.io/js/twitter-error-handler)
[![npm](https://img.shields.io/npm/dt/twitter-error-handler)](https://www.npmjs.com/package/twitter-error-handler)

Wrap errors from Twitter API calls like a boss. 😎

## Okay, what's this?

Let's take a look. You're writing a service where you make calls to the Twitter API. Suppose you're using the
package [Twit](https://github.com/ttezel/twit#readme). Your code would look something like this:

```javascript
return t.get('statuses/mentions_timeline', options)
    .then(r => r.data)
    .then(tweets => tweets.map(processTweet));
```

But how do you handle errors from the Twitter API? Maybe your API token is wrong, or your app has been suspended, or
you've hit a rate limit. Well, here's one way:

```javascript
return t.get('statuses/mentions_timeline', options)
    .catch(e => {
        const error = JSON.stringify(e);
        if (error.includes("Invalid or expired token")) {
            // uh-oh, your token is wrong, do stuff
        } else if (error.includes("Invalid / suspended application")) {
            // This is very bad, as it means your app is broken for its users
        } else if (error.includes("Rate limit exceeded")
            || error.includes("User is over daily status update limit")) {
            // implement a backoff so Twitter doesn't suspend your app
        } // you get the idea...
    })
    .then(r => r.data)
    .then(tweets => tweets.map(processTweet));
```

But this isn't very optimal, is it? What happens if Twitter changes their error messages? Also, that code makes my eyes
bleeeed. Here's what this package lets you do:

```javascript
const {wrapTwitterErrors, errors, codes} = require('twitter-error-handler');
return t.get('statuses/mentions_timeline', options)
    .catch(e => wrapTwitterErrors(e, 'statuses/mentions_timeline'))
    .catch(e => {
        if (e instanceof errors.ProblemWithAuth) {
            // uh-oh, your token is wrong, do stuff
        } else if (e instanceof errors.ProblemWithAppOrAccount) {
            // you need to take action
        } else if (e instanceof errors.RateLimited) {
            // implement a backoff so Twitter doesn't suspend your app
        }
    })
    .then(r => r.data)
    .then(tweets => tweets.map(processTweet));
```

If you mix in the [aargh package](https://github.com/shalvah/aargh), even neater:

```javascript
return t.get('statuses/mentions_timeline', options)
    .catch(e => wrapTwitterErrors(e, 'statuses/mentions_timeline'))
    .catch(e => {
        return aargh(e)
            .type(ProblemWithAuth, (e) => {
                // uh-oh, your token is wrong, do stuff
            })
            .type(ProblemWithAppOrAccount, notifyMe)
            .type(RateLimited, backOff)
            .throw();
    })
    .then(r => r.data)
    .then(tweets => tweets.map(processTweet));
```

## Installation

```
npm i twitter-error-handler
```

## Usage

This package wraps the errors into a bunch of classes that represent the kinds of errors you can get from Twitter. To
use this package, call the `wrapTwitterErrors` function with an `endpoint` and a `response` object within your first
catch (or try/catch or however you handle errors) statement after your Twitter API call.

- The `endpoint` is the path to the API you called. It's helpful so you can easily track what calls triggered what
  errors in your logs.

- The `response` object is the original Twitter API response, as a JavaScript object. This package was designed to work
  with [Twit](https://github.com/ttezel/twit#readme) (a very good Twitter API client). With Twit, the `response` object
  you pass in is the error in the catch block (as shown in the examples above). To use any other Twitter API client, you
  only need to pass in an `endpoint` and a `response` object matching the description above.

## Output

When you call the `wrapTwitterErrors` function within a catch block, it wil perform checks on any errors passed to it
and wrap the errors into a special Error object, and then throw it. The idea is to represent
all [possible Twitter API errors](https://developer.twitter.com/en/support/twitter-api/error-troubleshooting) as an
instance of one of the following:

- `ProblemWithYourAppOrAccount`: This covers cases where your Twitter app or user account is having issues (for
  instance, account locked or app suspended by Twitter). You'll probably want to take action ASAP. <details><summary>Covers the following errors:</summary>
  <ul>
  <li><code>ACCOUNT_LOCKED_TEMPORARILY</code> (326)</li>
  <li><code>ACCOUNT_SUSPENDED</code> (64)</li>
  <li><code>APP_SUSPENDED</code> (416)</li>
  <li><code>APP_MUZZLED</code> (261)</li>
  <li><code>CALLBACK_URL_NOT_APPROVED</code> (415)</li>
  <li><code>DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH</code> (417)</li>
  <li><code>CLIENT_NOT_PERMITTED_TO_DO_THAT</code> (87)</li>
  <li><code>APP_NOT_ALLOWED_TO_ACCESS_DMS</code> (93)</li>
  <li><code>YOUR_CREDENTIALS_DONT_COVER_THIS</code> (220)</li>
  <li><code>WE_FELT_LIKE_FLAGGING_YOU</code> (226)</li>
  </ul>
  </details>
- `RateLimited`: For errors caused by hitting a rate limit. You should implement backoff to avoid being banned by
  Twitter. Covers:
    - `RATE_LIMIT_EXCEEDED` (88)
    - `HIT_TWEET_LIMIT` (185)
    - `CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL` (161)
    - `REACHED_LIMIT_FOR_SPAM_REPORTS` (205)
- `ProblemWithAuth`: For errors caused by authentication issues. Covers:
    - `INVALID_OR_EXPIRED_TOKEN` (89)
    - `AUTH_FAILED` (32)
    - `AUTH_FAILED_DUE_TO_TIMESTAMPS` (135)
    - `UNABLE_TO_VERIFY_CREDENTIALS` (99)
    - `BAD_AUTH_DATA` (215)
- `ProblemWithTwitter`: For internal server errors and "Twitter is over capacity" errors. It's recommended to wait a few
  minutes before retrying. Covers:
  - `TWITTER_NEEDS_A_BREAK` (130)
  - `TWITTERS_DOWN_SORRY` (131)
- `ProblemWithPermissions`: For errors caused by permissions issues. For example, not allowed to view a protected tweet
  or DM a user. Covers:
    - `CANT_DM_THIS_USER` (150)
    - `COULDNT_DM` (151)
    - `TWEET_PROTECTED` (179)
    - `REPLIES_RESTRICTED` (433)
    - `BLOCKED_BY_USER` (136)
    - `OWNER_MUST_ALLOW_DMS_FROM_ANYONE` (214)
    - `CANT_DM_THE_FELLA` (349)
    - `TWEET_RESTRICTED_BY_TWITTER` (425)
- `BadRequest`: For errors caused by bad requests (invalid parameters, overly long values, invalid urls etc)
  . <details><summary>Covers the following errors:</summary>
  <ul>
  <li><code>INVALID_COORDINATES</code> (3)</li>
  <li><code>NO_DATA_FOR_COORDINATES_AND_RADIUS</code> (7)</li>
  <li><code>NO_DATA_FOR_THAT_ID</code> (8)</li>
  <li><code>MUST_PROVIDE_VALID_GEO_DATA</code> (12)</li>
  <li><code>CANT_REPORT_YOURSELF_FOR_SPAM</code> (36)</li>
  <li><code>REPLIED_TO_UNAVAILABLE_TWEET</code> (385)</li>
  <li><code>MISSING_QUERY_PARAMS</code> (25)</li>
  <li><code>PARAMETER_MISSING</code> (38)</li>
  <li><code>ATTACHMENT_URL_INVALID</code> (44)</li>
  <li><code>TWEET_TOO_LONG</code> (186)</li>
  <li><code>DUPLICATE_TWEET</code> (187)</li>
  <li><code>INVALID_URL_PARAMETER</code> (195)</li>
  <li><code>ACCOUNT_UPDATE_FAILED</code> (120)</li>
  <li><code>ALREADY_LIKED_THAT_SHIT</code> (129)</li>
  <li><code>ALREADY_FOLLOWED</code> (160)</li>
  <li><code>USER_NOT_IN_THE_LIST</code> (110)</li>
  <li><code>COULDNT_DETERMINE_SOURCE_USER</code> (163)</li>
  <li><code>DEVICE_ERROR</code> (203)</li>
  <li><code>HAHA_CANT_MUTE_YOURSELF</code> (271)</li>
  <li><code>CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING</code> (272)</li>
  <li><code>GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES</code> (323)</li>
  <li><code>MEDIA_ID_GOT_A_PROBLEM</code> (324)</li>
  <li><code>DIDNT_FIND_A_MEDIA_ID</code> (325)</li>
  <li><code>ALREADY_RETWEETED</code> (327)</li>
  <li><code>DM_TOO_LONG</code> (354)</li>
  <li><code>SUBSCRIPTION_ALREADY_EXISTS</code> (355)</li>
  <li><code>ONLY_ONE_ATTACHMENT_TYPE_ALLOWED</code> (386)</li>
  <li><code>YOU_NEED_TO_ENABLE_COOKIES</code> (404)</li>
  <li><code>INVALID_URL</code> (407)</li>
  <li><code>INVALID_CONVERSATION_CONTROLS</code> (431)</li>
  </ul>
  </details>
- `NotFound`: For when the requested resource (eg Tweet/user) wasn't found. <details><summary>Covers the following
  errors:</summary>
  <ul>
  <li><code>NO_LOCATION_FOR_THAT_IP_ADDRESS</code> (13)  </li><li><code>NO_USER_MATCHES_THOSE_TERMS</code> (17)  </li><li><code>NOT_FOUND</code> (34)  </li><li><code>COULDNT_FIND_USER</code> (50)  <li><code>USER_NOT_FOUND_IN_THE_LIST</code> (109)  <li><code>NO_SUCH_TWEET</code> (144)  <li><code>USER_SUSPENDED</code> (63)  </li><li><code>TWEET_UNAVAILABLE</code> (422)  <li><code>TWEET_UNAVAILABLE_FOR_VIOLATING_RULES</code> (421)</li>
  </ul>
  </details>
- `TwitterApiError`: the base error class. Used for any errors which don't fall into the above groups; for instance,
  using a retired endpoint or no SSL. Currently covers:
  - `GOTO_NEW_API` (68)
  - `SSL_REQUIRED` (92)
  - `THIS_ENDPOINT_HAS_BEEN_RETIRED` (251)

> I've also included some error codes not mentioned in the docs (as at the time of writing), but which I've personally received.

If you need to take action based on a specific type of error, I recommend checking the response code rather than relying
on the inferred class.

Each error thrown by this package has the following properties:

- `code`: The error code from the Twitter response. You can programmatically inspect the code and decide what specific
  action to take. For instance, for a rate limit error, to back off for a varying number of minutes depending on the
  error, we could do (from the last example):

```javascript
     return aargh(e)
    .type(RateLimited, (e) => {
        if (e.code === codes.CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL) {
            retryIn({hours: 24});
        } else if (e.code === codes.HIT_TWEET_LIMIT) {
            retryIn({minutes: 30});
        }
    })
    .throw();
```

The various error codes are provided as properties of the `codes` object.

- `name`: The name of the error class
- `errors`: The original array of errors from the Twitter API response (as gotten from the `response` value passed to
  the `wrapTwitterErrors` function)
- `endpoint`: The endpoint for the API call (the same value passed to the `wrapTwitterErrors` function)

Calling the `valueOf()` method of any of the error objects returns a nice JSON representation of the above properties (
useful for logging purposes).