# Untis API Client

## About

A Client for accessing the [WebUntis](https://untis.com) API as documented [here](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf).
I know that there are other libraries for accessing the API like [SchoolUtils'](https://github.com/SchoolUtils/WebUntis),
but I wanted to create a client that is written in TypeScript, properly structured and well documented. For more info, read the [implementation details](#implementation-details) and
please let me know if you know anything about the WebUntis API that I don't!

## Usage

### Installation

```bash
$ npm install untis-api-client
```

### Example

```ts
import {
  LoginResult,
  searchSchoolsByName,
  setJSONRPCRequestLogger,
  UntisClient,
} from "untis-api-client";

setJSONRPCRequestLogger((method, duration) => {
  console.log(`completed WebUntis API request for ${method} in ${duration}ms`);
});

let [school] = await searchSchoolsByName("school name");
if (!school) {
  throw new Error("no school found");
}

const c = new UntisClient(school.server, school.loginName);

let loginStatus = await c.login("username", "password");
if (loginStatus !== LoginResult.Ok) {
  // login failed
}

let currentSchoolyear = await c.getCurrentSchoolyear();

let timetable = await c.getOwnTimetableUntil(currentSchoolyear.endDate);

// "An application should always logout as soon as possible
// to free system resources on the server."
c.logout();

for (let period of timetable) {
  console.log(period);
}
```

To learn more, look at the source code or use your IDE's autocompletion feature.
I added doc comments to everything that is exported.

## Implementation details

This API client uses the `/WebUntis/jsonrpc.do` JSON-RPC API. Other 3rd party apps such as [BetterUntis](https://github.com/SapuSeven/BetterUntis)
use the internal `/WebUntis/jsonrpc_intern.do` API, which is currently also used by the official mobile app.

> :warning: When I asked Untis about this, they said that **"the JSON API" will be deprecated by Summer 2023**, so unless updated, this client will
> probably no longer work by then.

For now, the JSON-RPC methods that I didn't need or had no access to are not implemented.
This includes `getDepartments`, `getStatusData`, `getPersonId`, `getSubstitutions`, and some more.
If you implement them, please create a PR for your additions.

## Copyright and contributing

I am unable to test a lot of the WebUntis API features myself because
they are undocumented or I don't have access to them.
Therefore, feel free to contribute to this API client!

Here are a few things you should keep in mind:

- add tests wherever possible
- test your additions thourougly before committing
- format your code using `npm run format:apply`
