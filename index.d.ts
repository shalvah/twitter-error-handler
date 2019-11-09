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
    export const INVALID_COORDINATES: number;
    export const NO_LOCATION_ASSOCIATED_WITH_THE_SPECIFIED_IP_ADDRESS: number;
    export const NO_USER_MATCHES_FOR_SPECIFIED_TERMS: number;
    export const AUTH_FAILED: number;
    export const NOT_FOUND: number;
    export const CANT_REPORT_YOURSELF_FOR_SPAM: number;
    export const PARAMETER_MISSING: number;
    export const ATTACHMENT__URL_INVALID: number;
    export const COULDNT_FIND_USER: number;
    export const USER_SUSPENDED: number;
    export const ACCOUNT_SUSPENDED: number;
    export const GOTO_NEW_API: number;
    export const CLIENT_IS_NOT_PERMITTED: number;
    export const RATE_LIMIT_EXCEEDED: number;
    export const INVALID_OR_EXPIRED_TOKEN: number;
    export const SSL_REQUIRED: number;
    export const APP_NOT_ALLOWED_TO_ACCESS_DMS: number;
    export const UNABLE_TO_VERIFY_CREDENTIALS: number;
    export const PAST_ALLOWED_FIELD_LENGTH: number;
    export const TWITTER_NEEDS_A_BREAK: number;
    export const TWITTERS_DOWN_SORRY: number;
    export const ALSO_AUTH_FAILED: number;
    export const ALREADY_LIKED_THAT_SHIT: number;
    export const NO_SUCH_TWEET: number;
    export const CANT_DM_THIS_USER: number;
    export const COULDNT_DM: number;
    export const ALREADY_FOLLOWED: number;
    export const CANT_FOLLOW_MORE_PEOPLE_NOW_SO_CHILL: number;
    export const TWEET_PROTECTED: number;
    export const HIT_TWEET_LIMIT: number;
    export const TWEET_TOO_LONG: number;
    export const DUPLICATE_TWEET: number;
    export const INVALID_URL_PARAMETER: number;
    export const REACHED_LIMIT_FOR_SPAM_REPORTS: number;
    export const OWNER_MUST_ALLOW_DMS_FROM_ANYONE: number;
    export const BAD_AUTH_DATA: number;
    export const YOUR_CREDENTIALS_DONT_COVER_THIS: number;
    export const WE_FELT_LIKE_FLAGGING_YOU: number;
    export const USER_MUST_VERIFY_LOGIN: number;
    export const THIS_ENDPOINT_HAS_BEEN_RETIRED_SO_FUCK_OFF: number;
    export const APP_MUZZLED: number;
    export const HAHA_CANT_MUTE_YOURSELF: number;
    export const CANT_UNMUTE_BECAUSE_YOU_WERENT_MUTING: number;
    export const GIFS_NOT_ALLOWED_WITH_OTHER_IMAGES: number;
    export const MEDIA_ID_GOT_A_PROBLEM: number;
    export const DIDNT_FIND_A_MEDIA_ID: number;
    export const ACCOUNT_LOCKED_TEMPORARILY: number;
    export const ALREADY_RETWEETED: number;
    export const CANT_DM_THE_FELLA: number;
    export const DM_TOO_LONG: number;
    export const SUBSCRIPTION_ALREADY_EXISTS: number;
    export const REPLIED_TO_UNAVAILABLE_TWEET: number;
    export const ONLY_ONE_ATTACHMENT_TYPE_ALLOWED: number;
    export const INVALID_URL: number;
    export const CALLBACK_URL_NOT_APPROVED: number;
    export const APP_SUSPENDED: number;
    export const DESKTOP_APPLICATIONS_ONLY_SUPPORT_OOB_OAUTH: number;
}
/**
 * For when your Twitter app or user account is having issues (for instance, account locked or app suspended by Twitter).
 * You'll probably want to take action ASAP.
 */
declare class ProblemWithAppOrAccount extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For errors caused by permissions issues.
 * For example, not allowed to view a protected tweet or DM a user.
 */
declare class ProblemWithPermissions extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For errors caused by hitting a rate limit. You should implement backoff to avoid being banned by Twitter.
 */
declare class RateLimited extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For errors caused by bad requests (invalid parameters, overly long values etc)
 */
declare class BadRequest extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For errors caused by authentication issues.
 */
declare class ProblemWithAuth extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
/**
 * For internal server errors and "Twitter is over capacity" errors.
 * It's recommended to wait a few minutes before retrying.
 */
declare class ProblemWithTwitter extends TwitterApiError {
    constructor(endpoint: any, errors: any);
}
declare class TwitterApiError extends Error {
    /**
     * @param {string} endpoint The endpoint which triggered the error
     * @param {TwitError[]} errors The errors object from the Twitter response
     * @param {string} type Category of the error
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
    export { ProblemWithAppOrAccount };
    export { ProblemWithPermissions };
    export { RateLimited };
    export { BadRequest };
    export { ProblemWithAuth };
    export { ProblemWithTwitter };
    export { TwitterApiError };
}
export {};
