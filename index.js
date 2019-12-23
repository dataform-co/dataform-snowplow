const settings = {
  database: "tada-analytics",
  snowplowSchema: "atomic",
  heartBeatSeconds: 10,
  minimumVisitLengthSeconds: 30,
  outputSchema: "snowplow_package",
  tags: ["snowplow"]
}

const page_view_events = require("./includes/page_view_events");
const page_view_derived = require("./includes/page_view_derived");
const page_views = require("./includes/page_views");
const sessions = require("./includes/sessions");
const users = require("./includes/users");

module.exports = (params) => {

  const {
    defaultConfig,
    snowplowSchema
  } = params;

  // Declare the source snowplow tables.
  declare({
    ...defaultConfig,
    schema: snowplowSchema,
    name: "events"
  });

  // Publish and return datasets.
  return {
    page_view_events: page_view_events(params),
    page_view_derived: page_view_derived(params),
    page_views: page_views(params),
    sessions: sessions(params),
    users: users(params),
  }
}
