'use strict';

/**
 * @typedef {{code: number, message: string}|string} TwitError
 * @typedef {{allErrors: TwitError[], message?: string, code: number, twitterReply:  Object|string}} TwitResponse
 */

/**
 * Identity function. Coerces string/number literals to literal types.
 * @template {number} T
 * @param {T} v
 * @return {T}
 */
function c(v) {
    return v;
}

// See https://developer.twitter.com/en/docs/basics/response-codes.html
const codes = {
    INVALID_COORDINATES: c(3),
    NO_DATA_FOR_COORDINATES_AND_RADIUS: c(7),
    NO_DATA_FOR_THAT_ID: c(8),
    MUST_PROVIDE_VALID_GEO_DATA: c(12),
    NO_LOCATION_FOR_THAT_IP_ADDRESS: c(13),
    NO_USER_MATCHES_THOSE_TERMS: c(17),
    MISSING_QUERY_PARAMS: c(25),
    AUTH_FAILED: c(32),
    NOT_FOUND: c(34),
    CANT_REPORT_YOURSELF_FOR_SPAM: c(36),
    PARAMETER_MISSING: c(38),
    ATTACHMENT_URL_INVALID: c(44),
    COULDNT_FIND_USER: c(50),
    USER_SUSPENDED: c(63),
    ACCOUNT_SUSPENDED: c(64),
    GOTO_NEW_API: c(68),
    CLIENT_NOT_PERMITTED_TO_DO_THAT: c(87),
    RATE_LIMIT_EXCEEDED: c(88),
    INVALID_OR_EXPIRED_TOKEN: c(89),
    SSL_REQUIRED: c(92),
    APP_NOT_ALLOWED_TO_ACCESS_DMS: c(93),
    UNABLE_TO_VERIFY_CREDENTIALS: c(99),
    USER_NOT_FOUND_IN_THE_LIST: c(109),
    USER_NOT_IN_THE_LIST: c(110),
    ACCOUNT_UPDATE_FAILED: c(120),
    TWITTER_NEEDS_A_BREAK: c(130),
    TWITTERS_DOWN_SORRY: c(131),
    AUTH_FAILED_DUE_TO_TIMESTAMPS: c(135),
    BLOCKED_BY_USER: c(136), // Didn't find in docs, but I got it in a response as recently as last week🤷‍♀️
    ALREADY_LIKED_THAT_SHIT: c(139),
    NO_SUCH_TWEET: c(144),
    CANT_DM_THIS_USER: c(150),
    COULDNT_DM: c(151),
    ALREADY_FOLLOWED: c(160),
    CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL: c(161),
    COULDNT_DETERMINE_SOURCE_USER: c(163),
    TWEET_PROTECTED: c(179),
    HIT_TWEET_LIMIT: c(185),
    TWEET_TOO_LONG: c(186),
    DUPLICATE_TWEET: c(187),
    INVALID_URL_PARAMETER: c(195),
    DEVICE_ERROR: c(203),
    REACHED_LIMIT_FOR_SPAM_REPORTS: c(205),
    OWNER_MUST_ALLOW_DMS_FROM_ANYONE: c(214),
    BAD_AUTH_DATA: c(215),
    YOUR_CREDENTIALS_DONT_COVER_THIS: c(220),
    WE_FELT_LIKE_FLAGGING_YOU: c(226),
    USER_MUST_VERIFY_LOGIN: c(231),
    THIS_ENDPOINT_HAS_BEEN_RETIRED: c(251),
    APP_MUZZLED: c(261),
    HAHA_CANT_MUTE_YOURSELF: c(271),
    CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING: c(272),
    GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES: c(323),
    MEDIA_ID_GOT_A_PROBLEM: c(324),
    DIDNT_FIND_A_MEDIA_ID: c(325),
    ACCOUNT_LOCKED_TEMPORARILY: c(326),
    ALREADY_RETWEETED: c(327),
    CANT_DM_THE_FELLA: c(349),
    DM_TOO_LONG: c(354),
    SUBSCRIPTION_ALREADY_EXISTS: c(355),
    REPLIED_TO_UNAVAILABLE_TWEET: c(385),
    ONLY_ONE_ATTACHMENT_TYPE_ALLOWED: c(386),
    YOU_NEED_TO_ENABLE_COOKIES: c(404),
    INVALID_URL: c(407),
    CALLBACK_URL_NOT_APPROVED: c(415),
    APP_SUSPENDED: c(416),
    DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH: c(417),
    TWEET_UNAVAILABLE: c(63),
    TWEET_UNAVAILABLE_FOR_VIOLATING_RULES: c(422),
    TWEET_RESTRICTED_BY_TWITTER: c(425),
    INVALID_CONVERSATION_CONTROLS: c(431),
    REPLIES_RESTRICTED: c(433),
};

class TwitterApiError extends Error {
    /**
     * @param {string} endpoint The endpoint which triggered the error
     * @param {TwitError[]} errors The errors object from the Twitter response
     * @param {string} type Category of the error
     *
     * Base error class covers:
     * - GOTO_NEW_API (68)
     * - SSL_REQUIRED (92)
     * - THIS_ENDPOINT_HAS_BEEN_RETIRED (251)
     */
    constructor(endpoint, errors, type = 'Unknown') {
        super(`[${type}]: Twitter API Error; endpoint=${endpoint}; error=${JSON.stringify(errors[0])}`);
        this.errors = errors;
        this.code = typeof errors[0] === "string" ? null : Number(errors[0].code);
        this.endpoint = endpoint;
        this.name = 'Twitter API Error';
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

/**
 * For when your Twitter app or user account is having issues (for instance, account locked or app suspended by Twitter).
 * You'll probably want to take action ASAP.
 * Covers:
 * - ACCOUNT_LOCKED_TEMPORARILY (326)
 * - ACCOUNT_SUSPENDED (64)
 * - APP_SUSPENDED (416)
 * - APP_MUZZLED (261)
 * - CALLBACK_URL_NOT_APPROVED (415)
 * - DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH (417)
 * - CLIENT_NOT_PERMITTED_TO_DO_THAT (87)
 * - APP_NOT_ALLOWED_TO_ACCESS_DMS (93)
 * - YOUR_CREDENTIALS_DONT_COVER_THIS (220)
 * - WE_FELT_LIKE_FLAGGING_YOU (226)
 */
class ProblemWithYourAppOrAccount extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'YourAppOrAccount');
        this.name = 'ProblemWithYourAppOrAccount';
    }
}

/**
 * For when the requested resource (eg Tweet/user) wasn't found.
 * Covers:
 * - NO_LOCATION_FOR_THAT_IP_ADDRESS (13)
 * - NO_USER_MATCHES_THOSE_TERMS (17)
 * - NOT_FOUND (34)
 * - COULDNT_FIND_USER (50)
 * - USER_NOT_FOUND_IN_THE_LIST (109)
 * - NO_SUCH_TWEET (144)
 * - USER_SUSPENDED (63)
 * - TWEET_UNAVAILABLE (422)
 * - TWEET_UNAVAILABLE_FOR_VIOLATING_RULES (421)
 */
class NotFound extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'NotFound');
        this.name = 'NotFound';
    }
}

/**
 * For internal server errors and "Twitter is over capacity" errors.
 * It's recommended to wait a few minutes before retrying.
 * Covers:
 * - TWITTER_NEEDS_A_BREAK (130)
 * - TWITTERS_DOWN_SORRY (131)
 */
class ProblemWithTwitter extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'Server');
        this.name = 'ProblemWithTwitter';
    }
}

/**
 * For errors caused by bad requests (invalid parameters, overly long values etc)
 * Covers:
 * - INVALID_COORDINATES (3)
 * - NO_DATA_FOR_COORDINATES_AND_RADIUS (7)
 * - NO_DATA_FOR_THAT_ID (8)
 * - MUST_PROVIDE_VALID_GEO_DATA (12)
 * - CANT_REPORT_YOURSELF_FOR_SPAM (36)
 * - REPLIED_TO_UNAVAILABLE_TWEET (385)
 * - MISSING_QUERY_PARAMS (25)
 * - PARAMETER_MISSING (38)
 * - ATTACHMENT_URL_INVALID (44)
 * - TWEET_TOO_LONG (186)
 * - DUPLICATE_TWEET (187)
 * - INVALID_URL_PARAMETER (195)
 * - ACCOUNT_UPDATE_FAILED (120)
 * - ALREADY_LIKED_THAT_SHIT (129)
 * - ALREADY_FOLLOWED (160)
 * - USER_NOT_IN_THE_LIST (110)
 * - COULDNT_DETERMINE_SOURCE_USER (163)
 * - DEVICE_ERROR (203)
 * - HAHA_CANT_MUTE_YOURSELF (271)
 * - CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING (272)
 * - GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES (323)
 * - MEDIA_ID_GOT_A_PROBLEM (324)
 * - DIDNT_FIND_A_MEDIA_ID (325)
 * - ALREADY_RETWEETED (327)
 * - DM_TOO_LONG (354)
 * - SUBSCRIPTION_ALREADY_EXISTS (355)
 * - ONLY_ONE_ATTACHMENT_TYPE_ALLOWED (386)
 * - YOU_NEED_TO_ENABLE_COOKIES (404)
 * - INVALID_URL (407)
 * - INVALID_CONVERSATION_CONTROLS (431)
 */
class BadRequest extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, 'Client');
        this.name = 'BadRequest';
    }
}

/**
 * For errors caused by hitting a rate limit. You should implement backoff to avoid being banned by Twitter.
 * Covers:
 * - RATE_LIMIT_EXCEEDED (88)
 * - HIT_TWEET_LIMIT (185)
 * - CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL (161)
 * - REACHED_LIMIT_FOR_SPAM_REPORTS (205)
 */
class RateLimited extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, `RateLimited`);
        this.name = 'RateLimited';
    }
}

/**
 * For errors caused by authentication issues.
 * Covers:
 * - INVALID_OR_EXPIRED_TOKEN (89)
 * - AUTH_FAILED (32)
 * - AUTH_FAILED_DUE_TO_TIMESTAMPS (135)
 * - UNABLE_TO_VERIFY_CREDENTIALS (99)
 * - BAD_AUTH_DATA (215)
 */
class ProblemWithAuth extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, `Auth`);
        this.name = 'ProblemWithAuth';
    }
}

/**
 * For errors caused by permissions issues.
 * For example, not allowed to view a protected tweet or DM a user.
 * Covers:
 * - CANT_DM_THIS_USER (150)
 * - COULDNT_DM (151)
 * - TWEET_PROTECTED (179)
 * - REPLIES_RESTRICTED (433)
 * - BLOCKED_BY_USER (136)
 * - OWNER_MUST_ALLOW_DMS_FROM_ANYONE (214)
 * - CANT_DM_THE_FELLA (349)
 * - TWEET_RESTRICTED_BY_TWITTER (425)
 */
class ProblemWithPermissions extends TwitterApiError {
    constructor(endpoint, errors) {
        super(endpoint, errors, `Permissions`);
        this.name = 'ProblemWithPermissions';
    }
}

/**
 *
 * @param {string} endpoint
 * @param {TwitResponse} response
 */
const wrapTwitterErrors = (endpoint, response) => {
    const errors = response.allErrors;
    if (!errors || !errors.length) {
        // In case some other error happened, we handle that
        throw response;
    }

    if (typeof errors[0] === "string") {
        throw new TwitterApiError(endpoint, errors);
    }

    switch (errors[0].code) {
        case codes.RATE_LIMIT_EXCEEDED:
        case codes.HIT_TWEET_LIMIT:
        case codes.CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL:
        case codes.REACHED_LIMIT_FOR_SPAM_REPORTS:
            throw new RateLimited(endpoint, errors);
        case codes.TWITTER_NEEDS_A_BREAK:
        case codes.TWITTERS_DOWN_SORRY:
            throw new ProblemWithTwitter(endpoint, errors);
        case codes.ACCOUNT_LOCKED_TEMPORARILY:
        case codes.ACCOUNT_SUSPENDED:
        case codes.APP_SUSPENDED:
        case codes.APP_MUZZLED:
        case codes.CALLBACK_URL_NOT_APPROVED:
        case codes.DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH:
        case codes.CLIENT_NOT_PERMITTED_TO_DO_THAT:
        case codes.APP_NOT_ALLOWED_TO_ACCESS_DMS:
        case codes.YOUR_CREDENTIALS_DONT_COVER_THIS:
        case codes.WE_FELT_LIKE_FLAGGING_YOU:
            throw new ProblemWithYourAppOrAccount(endpoint, errors);
        case codes.INVALID_COORDINATES:
        case codes.NO_DATA_FOR_COORDINATES_AND_RADIUS:
        case codes.NO_DATA_FOR_THAT_ID:
        case codes.MUST_PROVIDE_VALID_GEO_DATA:
        case codes.CANT_REPORT_YOURSELF_FOR_SPAM:
        case codes.REPLIED_TO_UNAVAILABLE_TWEET:
        case codes.MISSING_QUERY_PARAMS:
        case codes.PARAMETER_MISSING:
        case codes.ATTACHMENT_URL_INVALID:
        case codes.TWEET_TOO_LONG:
        case codes.DUPLICATE_TWEET:
        case codes.INVALID_URL_PARAMETER:
        case codes.ACCOUNT_UPDATE_FAILED:
        case codes.ALREADY_LIKED_THAT_SHIT:
        case codes.ALREADY_FOLLOWED:
        case codes.USER_NOT_IN_THE_LIST:
        case codes.COULDNT_DETERMINE_SOURCE_USER:
        case codes.DEVICE_ERROR:
        case codes.HAHA_CANT_MUTE_YOURSELF:
        case codes.CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING:
        case codes.GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES:
        case codes.MEDIA_ID_GOT_A_PROBLEM:
        case codes.DIDNT_FIND_A_MEDIA_ID:
        case codes.ALREADY_RETWEETED:
        case codes.DM_TOO_LONG:
        case codes.SUBSCRIPTION_ALREADY_EXISTS:
        case codes.ONLY_ONE_ATTACHMENT_TYPE_ALLOWED:
        case codes.YOU_NEED_TO_ENABLE_COOKIES:
        case codes.INVALID_URL:
        case codes.INVALID_CONVERSATION_CONTROLS:
            throw new BadRequest(endpoint, errors);
        case codes.NO_LOCATION_FOR_THAT_IP_ADDRESS:
        case codes.NO_USER_MATCHES_THOSE_TERMS:
        case codes.NOT_FOUND:
        case codes.COULDNT_FIND_USER:
        case codes.USER_NOT_FOUND_IN_THE_LIST:
        case codes.NO_SUCH_TWEET:
        case codes.USER_SUSPENDED:
        case codes.TWEET_UNAVAILABLE:
        case codes.TWEET_UNAVAILABLE_FOR_VIOLATING_RULES:
            throw new NotFound(endpoint, errors);
        case codes.INVALID_OR_EXPIRED_TOKEN:
        case codes.AUTH_FAILED:
        case codes.AUTH_FAILED_DUE_TO_TIMESTAMPS:
        case codes.UNABLE_TO_VERIFY_CREDENTIALS:
        case codes.BAD_AUTH_DATA:
            throw new ProblemWithAuth(endpoint, errors);
        case codes.CANT_DM_THIS_USER:
        case codes.COULDNT_DM:
        case codes.TWEET_PROTECTED:
        case codes.REPLIES_RESTRICTED:
        case codes.BLOCKED_BY_USER:
        case codes.OWNER_MUST_ALLOW_DMS_FROM_ANYONE:
        case codes.CANT_DM_THE_FELLA:
        case codes.TWEET_RESTRICTED_BY_TWITTER:
            throw new ProblemWithPermissions(endpoint, errors);
        case codes.GOTO_NEW_API:
        case codes.SSL_REQUIRED:
        case codes.THIS_ENDPOINT_HAS_BEEN_RETIRED:
        default:
            throw new TwitterApiError(endpoint, errors);
    }
};

module.exports = {
    codes,
    errors: {
        ProblemWithYourAppOrAccount,
        NotFound,
        ProblemWithPermissions,
        RateLimited,
        BadRequest,
        ProblemWithAuth,
        ProblemWithTwitter,
        TwitterApiError,
    },
    wrapTwitterErrors,
};