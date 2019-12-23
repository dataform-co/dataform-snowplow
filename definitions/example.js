const snowplow = require("../");

const {
  page_view_events,
  page_view_derived
} = snowplow({
  snowplowSchema: "atomic",
  sessionTimeoutSeconds: 30 * 60,
  heartBeatSeconds: 10,
  minimumVisitLengthSeconds: 30,
  defaultConfig: {
    schema: "snowplow_package_example",
    tags: ["snowplow"],
    type: "view"
  }
});

// Override the sessions table type to "table".
// sessions.type("table");
