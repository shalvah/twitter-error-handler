'use strict';

// see https://developer.twitter.com/en/docs/basics/response-codes.html

const COULDNT_FIND_USER = 17;
const AUTH_FAILED = 32;
const USER_SUSPENDED = 63;
const ACCOUNT_SUSPENDED = 64;
const RATE_LIMIT_EXCEEDED = 88;
const INVALID_OR_EXPIRED_TOKEN = 89;
const TWITTER_NEEDS_A_BREAK = 130;
const TWITTERS_DOWN_SORRY = 131;
const HIT_TWEET_LIMIT = 185;
const APP_MUZZLED = 261;
const ACCOUNT_LOCKED_TEMPORARILY = 326;
const REPLIED_TO_UNAVAILABLE_TWEET = 385;
const APP_SUSPENDED = 416;

class TwitterApiError extends Error {
    constructor(endpoint, errors, type = 'Unknown') {
        super(`[${type}]: Error from Twitter API call`);
        this.errors = errors;
        this.code = errors[0].code;
        this.endpoint = endpoint;
    }

    valueOf() {
        return JSON.stringify({
            name: this.name,
            errors: this.errors,
            code: this.code,
            endpoint: this.endpoint,
        });
    }
}

class NeedsActionTwitterError extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'NeedsAction');
        this.name = 'NeedsActionTwitterError';
    }
}

class ClientTwitterError extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'Client');
        this.name = 'ClientTwitterError';
    }
}

class BackOffTwitterError extends TwitterApiError {
    constructor(endpoint, errors, backOffFor = 12) {
        super(endpoint, errors, `BackOff For ${backOffFor} Minutes`);
        this.name = 'BackOffTwitterError';
        this.backOffFor = backOffFor;
    }
}

class BadAuthTwitterError extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, `BadAuth`);
        this.name = 'BadAuthTwitterError';
    }
}

const handleTwitterErrors = (e, endpoint) => {
    const errors = e.allErrors || e.errors;
    switch (errors[0].code) {
        case RATE_LIMIT_EXCEEDED:
        case HIT_TWEET_LIMIT:
            throw new BackOffTwitterError(endpoint, errors);
        case TWITTER_NEEDS_A_BREAK:
        case TWITTERS_DOWN_SORRY:
            throw new BackOffTwitterError(endpoint, errors, 4);
        case ACCOUNT_LOCKED_TEMPORARILY:
        case ACCOUNT_SUSPENDED:
        case APP_SUSPENDED:
        case USER_SUSPENDED:
        case APP_MUZZLED:
            throw new NeedsActionTwitterError(endpoint, errors);
        case COULDNT_FIND_USER:
        case AUTH_FAILED:
        case REPLIED_TO_UNAVAILABLE_TWEET:
            throw new ClientTwitterError(endpoint, errors);
        case INVALID_OR_EXPIRED_TOKEN:
            throw new BadAuthTwitterError(endpoint, errors);
        default:
            throw new TwitterApiError(endpoint, errors);
    }
};

module.exports = {
    NeedsActionTwitterError,
    BackOffTwitterError,
    ClientTwitterError,
    BadAuthTwitterError,
    TwitterApiError,
    handleTwitterErrors
};