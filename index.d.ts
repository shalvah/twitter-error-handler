export type TwitError = string | {
    code: number;
    message: string;
};
export type TwitResponse = {
    allErrors: (string | {
        code: number;
        message: string;
    })[];
    message?: string;
    code: number;
    twitterReply: any;
};
export namespace codes {
    export const INVALID_COORDINATES: 3;
    export const NO_DATA_FOR_COORDINATES_AND_RADIUS: 7;
    export const NO_DATA_FOR_THAT_ID: 8;
    export const MUST_PROVIDE_VALID_GEO_DATA: 12;
    export const NO_LOCATION_FOR_THAT_IP_ADDRESS: 13;
    export const NO_USER_MATCHES_THOSE_TERMS: 17;
    export const MISSING_QUERY_PARAMS: 25;
    export const AUTH_FAILED: 32;
    export const NOT_FOUND: 34;
    export const CANT_REPORT_YOURSELF_FOR_SPAM: 36;
    export const PARAMETER_MISSING: 38;
    export const ATTACHMENT_URL_INVALID: 44;
    export const COULDNT_FIND_USER: 50;
    export const USER_SUSPENDED: 63;
    export const ACCOUNT_SUSPENDED: 64;
    export const GOTO_NEW_API: 68;
    export const CLIENT_NOT_PERMITTED_TO_DO_THAT: 87;
    export const RATE_LIMIT_EXCEEDED: 88;
    export const INVALID_OR_EXPIRED_TOKEN: 89;
    export const SSL_REQUIRED: 92;
    export const APP_NOT_ALLOWED_TO_ACCESS_DMS: 93;
    export const UNABLE_TO_VERIFY_CREDENTIALS: 99;
    export const USER_NOT_FOUND_IN_THE_LIST: 109;
    export const USER_NOT_IN_THE_LIST: 110;
    export const ACCOUNT_UPDATE_FAILED: 120;
    export const TWITTER_NEEDS_A_BREAK: 130;
    export const TWITTERS_DOWN_SORRY: 131;
    export const AUTH_FAILED_DUE_TO_TIMESTAMPS: 135;
    export const BLOCKED_BY_USER: 136;
    export const ALREADY_LIKED_THAT_SHIT: 139;
    export const NO_SUCH_TWEET: 144;
    export const CANT_DM_THIS_USER: 150;
    export const COULDNT_DM: 151;
    export const ALREADY_FOLLOWED: 160;
    export const CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL: 161;
    export const COULDNT_DETERMINE_SOURCE_USER: 163;
    export const TWEET_PROTECTED: 179;
    export const HIT_TWEET_LIMIT: 185;
    export const TWEET_TOO_LONG: 186;
    export const DUPLICATE_TWEET: 187;
    export const INVALID_URL_PARAMETER: 195;
    export const DEVICE_ERROR: 203;
    export const REACHED_LIMIT_FOR_SPAM_REPORTS: 205;
    export const OWNER_MUST_ALLOW_DMS_FROM_ANYONE: 214;
    export const BAD_AUTH_DATA: 215;
    export const YOUR_CREDENTIALS_DONT_COVER_THIS: 220;
    export const WE_FELT_LIKE_FLAGGING_YOU: 226;
    export const USER_MUST_VERIFY_LOGIN: 231;
    export const THIS_ENDPOINT_HAS_BEEN_RETIRED: 251;
    export const APP_MUZZLED: 261;
    export const HAHA_CANT_MUTE_YOURSELF: 271;
    export const CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING: 272;
    export const GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES: 323;
    export const MEDIA_ID_GOT_A_PROBLEM: 324;
    export const DIDNT_FIND_A_MEDIA_ID: 325;
    export const ACCOUNT_LOCKED_TEMPORARILY: 326;
    export const ALREADY_RETWEETED: 327;
    export const CANT_DM_THE_FELLA: 349;
    export const DM_TOO_LONG: 354;
    export const SUBSCRIPTION_ALREADY_EXISTS: 355;
    export const REPLIED_TO_UNAVAILABLE_TWEET: 385;
    export const ONLY_ONE_ATTACHMENT_TYPE_ALLOWED: 386;
    export const YOU_NEED_TO_ENABLE_COOKIES: 404;
    export const INVALID_URL: 407;
    export const CALLBACK_URL_NOT_APPROVED: 415;
    export const APP_SUSPENDED: 416;
    export const DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH: 417;
    export const TWEET_UNAVAILABLE: 63;
    export const TWEET_UNAVAILABLE_FOR_VIOLATING_RULES: 422;
    export const TWEET_RESTRICTED_BY_TWITTER: 425;
    export const INVALID_CONVERSATION_CONTROLS: 431;
    export const REPLIES_RESTRICTED: 433;
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
declare class ProblemWithYourAppOrAccount extends TwitterApiError {
    constructor(endpoint: any, errors: any);
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
declare class NotFound extends TwitterApiError {
    constructor(endpoint: any, errors: any);
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
declare class ProblemWithPermissions extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For errors caused by hitting a rate limit. You should implement backoff to avoid being banned by Twitter.
 * Covers:
 * - RATE_LIMIT_EXCEEDED (88)
 * - HIT_TWEET_LIMIT (185)
 * - CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL (161)
 * - REACHED_LIMIT_FOR_SPAM_REPORTS (205)
 */
declare class RateLimited extends TwitterApiError {
    constructor(endpoint: any, errors: any);
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
declare class BadRequest extends TwitterApiError {
    constructor(endpoint: any, errors: any);
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
declare class ProblemWithAuth extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For internal server errors and "Twitter is over capacity" errors.
 * It's recommended to wait a few minutes before retrying.
 * Covers:
 * - TWITTER_NEEDS_A_BREAK (130)
 * - TWITTERS_DOWN_SORRY (131)
 */
declare class ProblemWithTwitter extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
declare class TwitterApiError extends Error {
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
    constructor(endpoint: string, errors: (string | {
        code: number;
        message: string;
    })[], type?: string);
    errors: (string | {
        code: number;
        message: string;
    })[];
    code: number;
    endpoint: string;
    valueOf(): string;
}
export function wrapTwitterErrors(endpoint: string, response: {
    allErrors: (string | {
        code: number;
        message: string;
    })[];
    message?: string;
    code: number;
    twitterReply: any;
}): never;
export declare namespace errors {
    export { ProblemWithYourAppOrAccount };
    export { NotFound };
    export { ProblemWithPermissions };
    export { RateLimited };
    export { BadRequest };
    export { ProblemWithAuth };
    export { ProblemWithTwitter };
    export { TwitterApiError };
}
export {};
