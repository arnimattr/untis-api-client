# Untis API Client

## About

A client for accessing the [WebUntis](https://untis.com) API as documented [here](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf).

As described in the [implementation details](#implementation-details), this client only uses the public API.
If you need to use the internal API, check out [this library](https://github.com/SchoolUtils/WebUntis) instead.

## Usage

### Installation

```bash
$ npm install untis-api-client
```

### Example

```ts
import { LoginStatus, searchSchoolsByName } from "./mod.ts";

let [school] = await searchSchoolsByName("my school name");
if (!school) {
  throw new Error("school not found");
}

let client = school.getClient();

let status = await client.login("username", "password");

if (!status.Ok) {
  throw new Error(`Login failed: ${LoginStatus[status.value]}`);
}

let timetable = await client.getOwnTimetable("2022-01-01", "2022-12-31");
client.logout();

console.log(timetable);
```

[More examples](examples/)

## Implementation details

The client uses the "public" API. The official mobile WebUntis mobile apps and 3rd-party apps such as [BetterUntis](https://github.com/SapuSeven/BetterUntis) use the internal API,
which allows you to log in anonymously or with an OTP.  
Because I couldn't find any official documentation for it and the official API seemed more user-friendly, I didn't implement the internal API,
so I don't know if either API has more or less features than the other one.  
Also, not all documented methods are currently implemented in this client because I don't have the necessary permissions to access them, they are unavailable,
or I don't need them in a backend environment. They are:

- requesting departments (`getDepartments`)
- requesting the time grid (`getTImegridUnits`)
- requesting status data (`getStatusData`)
- searching a person's id (`getPersonId`)
- requesting substitutions (`getSubstitutions`)
- getting exams or exam types (`getExams`, `getExamTypes`)
- requesting a timetable with absences (`getTimetableWithAbsences`)
- requesting class-reg events or remark categories (`getClassregEvents`, `getClassregCategories`, `getClassregCategoryGroups`)

## Contributing

I am unable to test a lot of the WebUntis API features myself because
they are undocumented, or I don't have permission to use them.
Therefore, feel free to contribute to this API client!  
Here are a few things you should keep in mind:

- add tests wherever possible
- test your additions thoroughly before committing
- format your code using `npm run format:apply`

### Project structure

If you contribute, please follow the code structure.

```
src/
  webuntis/
    requests/: method names and their parameter and return types.
    resources/: resources returned by WebUntis
  wrappers/: wrapper classes around resources
```

## Notice

I am not affiliated with WebUntis in any way. Use at your own risk.
