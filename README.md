# dataform-snowplow

Common data models for snowplow data, including page views, sessions and users.

## Install the package

TODO

## Configure the package

Create a new JS file in your `definitions/` folder and create the snowplow tables with the following example:

```js
const snowplow = require("@dataform/snowplow");

snowplow({
  // the name of your snowplow schema
  snowplowSchema: "atomic",
  // heartbeat interval setting from the javascript tracker
  heartBeatSeconds: 10,
  // minimumVisitLength setting from the javascript tracker
  minimumVisitLengthSeconds: 30,
  // Default configuration applied to all produced datasets.
  defaultConfig: {
    schema: "snowplow_package_example",
    tags: ["snowplow"],
    type: "view"
  }
});
```