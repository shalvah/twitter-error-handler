# twitter-error-handler

[![npm version](https://badge.fury.io/js/twitter-error-handler.svg)](https://badge.fury.io/js/twitter-error-handler)
[![npm](https://img.shields.io/npm/dt/twitter-error-handler)](https://www.npmjs.com/package/twitter-error-handler)

Wrap errors from Twitter API calls like a boss. 😎

## Okay, what's this?

Let's take a look. You're writing a service where you make calls to the Twitter API. Suppose you're using the package [Twit](https://github.com/ttezel/twit#readme). Your code would look something like this:

```javascript
return t.get('statuses/mentions_timeline', options)
  .then(r => r.data)
  .then(tweets => tweets.map(processTweet));
```

But how do you handle errors from the Twitter API? Maybe your API token is wrong, or your app has been suspended, or you've hit a rate limit. Well, here's one way:

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

But this isn't very optimal, is it? What happens if Twitter changes their error messages? Also, that code makes my eyes bleeeed. Here's what this package lets you do:

```javascript
const { wrapTwitterErrors, errors, codes } = require('twitter-error-handler');
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
This package wraps the errors into a bunch of classes that represent the kinds of errors you can get from Twitter. To use this package, call the `wrapTwitterErrors` function with an `endpoint` and a `response` object within your first catch (or try/catch or however you handle errors) statement after your Twitter API call.

- The `endpoint` is the path to the API you called. It's helpful so you can easily track what calls triggered what errors in your logs.

- The `response` object is the original Twitter API response, as a JavaScript object. This package was designed to work with [Twit](https://github.com/ttezel/twit#readme) (a very good Twitter API client). With Twit, the `response` object you pass in is the error in the catch block (as shown in the examples above). To use any other Twitter API client, you only need to pass in an `endpoint` and a `response` object matching the description above. 

## Output
When you call the `wrapTwitterErrors` function within a catch block, it wil perform checks on any errors passed to it and wrap the errors into a special Error object, and then throw it. The idea is to represent all [possible Twitter API errors](https://developer.twitter.com/en/support/twitter-api/error-troubleshooting) as an instance of one of the following

- `ProblemWithYourAppOrAccount`: This covers cases where your Twitter app or user account is having issues (for instance, account locked or app suspended by Twitter). You'll probably want to take action ASAP.
- `RateLimited`: For errors caused by hitting a rate limit. You should implement backoff to avoid being banned by Twitter.
- `ProblemWithAuth`: For errors caused by authentication issues.
- `ProblemWithTwitter`: For internal server errors and "Twitter is over capacity" errors. It's recommended to wait a few minutes before retrying.
- `BadRequest`: For errors caused by bad requests (invalid parameters, overly long values, invalid urls etc).
- `NotFound`: For when the requested resource (eg Tweet/user) wasn't found.
- `ProblemWithPermissions`: For errors caused by permissions issues. For example, not allowed to view a protected tweet or DM a user.
- `TwitterApiError`: the base error class. Used for any errors which don't fall into the above groups; for instance, using a retired endpoint or no SSL.

If you need to take action based on a specific type of error, I recommend checking the response code rather than relying on the inferred class.
 
 Each error thrown by this package has the following properties:
- `code`: The error code from the Twitter response. You can programmatically inspect the code and decide what specific action to take. For instance, for a rate limit error, to back off for a varying number of minutes depending on the error, we could do (from the last example):

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
- `errors`: The original array of errors from the Twitter API response (as gotten from the `response` value passed to the `wrapTwitterErrors` function)
- `endpoint`: The endpoint for the API call (the same value passed to the `wrapTwitterErrors` function)

Calling the `valueOf()` method of any of the error objects returns a nice JSON representation of the above properties (useful for logging purposes).