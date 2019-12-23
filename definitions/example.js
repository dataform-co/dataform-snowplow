const snowplow = require("../");

const {
  page_view_events,
  page_view_derived,
  page_views,
  sessions,
  users
} = snowplow({
  snowplowSchema: "atomic",
  heartBeatSeconds: 10,
  minimumVisitLengthSeconds: 30,
  defaultConfig: {
    schema: "snowplow_package_example",
    tags: ["snowplow"],
    type: "view"
  }
});

// Override the sessions table type to "table".
page_views.type("table");
sessions.type("table");
users.type("table");
