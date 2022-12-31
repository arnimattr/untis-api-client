# Untis API Client

## About

A client library for accessing the [WebUntis](https://untis.com) API following
[this](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf)
documentation.

As described in the [implementation details](#implementation-details), this
client only uses the public API. If you need to use the internal API, check out
[this library](https://github.com/SchoolUtils/WebUntis) instead.

This is a deno-first module, which means that even though there is an
[NPM package](https://www.npmjs.com/package/untis-api-client), it will only work
with Node.js 18+ (due to usage of `fetch()`) and ES Modules.

## Example Usage

```ts
import { LoginStatus, searchSchoolsByName } from "./mod.ts";

let [school] = await searchSchoolsByName("School name");

if (!school) {
  throw new Error("School not found");
}

let client = school.getClient();

let status = await client.login("username", "password");

if (status !== LoginStatus.Ok) {
  throw new Error(`Login failed: ${LoginStatus[status]}`);
}

let timetable = await client.getOwnTimetable("2022-01-01", "2022-12-31");
await client.logout();

console.log(timetable.lessons);
```

[More examples](examples/)

## Implementation details

The client uses the "public" API. The official mobile WebUntis mobile apps and
3rd-party apps such as [BetterUntis](https://github.com/SapuSeven/BetterUntis)
use the internal API, which allows you to log in anonymously or with an OTP.\
Because I couldn't find any official documentation for it and the official API
seemed more user-friendly, I didn't implement the internal API, so I don't know
if either API has more or less features.\
Also, not all documented methods are currently implemented in this client
because I don't have the necessary permissions to access them, they are
unavailable, or I don't need them in a backend environment. They are:

- requesting departments (`getDepartments`)
- requesting the time grid (`getTimegridUnits`)
- requesting status data (`getStatusData`)
- getting a person's id (`getPersonId`)
- requesting substitutions (`getSubstitutions`)
- getting exams or exam types (`getExams`, `getExamTypes`)
- requesting a timetable with absences (`getTimetableWithAbsences`)
- requesting class-reg events or remark categories (`getClassregEvents`,
  `getClassregCategories`, `getClassregCategoryGroups`)

## Contributing

As mentioned above, I am unable to test a lot of the API features myself because
they are undocumented or I don't have the necessary permission to use them. So
feel free to contribute to this API client!\
Here are a few things you should keep in mind:

- add tests wherever possible
- test your additions thoroughly before committing
- format your code using `deno fmt`

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
