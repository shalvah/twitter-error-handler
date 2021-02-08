# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres (or tries to🤷‍♂️) to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - Monday, 8 February 2021
- Re-added `USER_MUST_VERIFY_LOGIN` (231).
- Added undocumented code `BLOCKED_BY_USER` (136)
- Moved `CANT_DM_THE_FELLA` (349) from `BadRequest` to `ProblemWithPermissions`

## [3.0.0] - Monday, 8 February 2021
- Added a new error type, `NotFound`
- Renamed some of the codes
  - `NO_LOCATION_ASSOCIATED_WITH_THE_SPECIFIED_IP_ADDRESS` -> `NO_LOCATION_FOR_THAT_IP_ADDRESS`,
  - `NO_USER_MATCHES_FOR_SPECIFIED_TERMS` -> `NO_USER_MATCHES_THOSE_TERMS`,
  - `ATTACHMENT__URL_INVALID` -> `ATTACHMENT_URL_INVALID`,
  - `CLIENT_IS_NOT_PERMITTED` -> `CLIENT_NOT_PERMITTED_TO_DO_THAT`
  - `PAST_ALLOWED_FIELD_LENGTH` -> `ACCOUNT_UPDATE_FAILED`
  - `THIS_ENDPOINT_HAS_BEEN_RETIRED_SO_FUCK_OFF` -> `THIS_ENDPOINT_HAS_BEEN_RETIRED`
- Removed `USER_MUST_VERIFY_LOGIN` (231), as it's no longer in the Twitter docs.
- Added the latest Twitter error codes,
  - `NO_DATA_FOR_COORDINATES_AND_RADIUS`: 7,
  - `NO_DATA_FOR_THAT_ID`: 8,
  - `MUST_PROVIDE_VALID_GEO_DATA`: 12,
  - `USER_NOT_FOUND_IN_THE_LIST`: 109,
  - `USER_NOT_IN_THE_LIST`: 110,
  - `COULDNT_DETERMINE_SOURCE_USER`: 163,
  - `DEVICE_ERROR`: 203,
  - `YOU_NEED_TO_ENABLE_COOKIES`: 404,
  - `TWEET_UNAVAILABLE`: 421,
  `TWEET_UNAVAILABLE_FOR_VIOLATING_RULES- `: 422,
  - `TWEET_RESTRICTED_BY_TWITTER`: 425,
  - `INVALID_CONVERSATION_CONTROLS`: 431

## [2.0.1] - Saturday, 21 September 2019
### Fixed
- Handle non-Twitter API errors properly (https://github.com/shalvah/twitter-error-handler/commit/f4a5c48c8d0d9275a003fd586e539b02073aec1f)