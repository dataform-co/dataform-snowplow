const settings = {
  database: "tada-analytics",
  snowplowSchema: "atomic",
  sessionTimeoutSeconds: 30 * 60,
  heartBeatSeconds: 10,
  minimumVisitLengthSeconds: 30,
  outputSchema: "snowplow_package",
  tags: ["snowplow"]
}

const page_view_events = require("./includes/page_view_events");
const page_view_derived = require("./includes/page_view_derived");
// const sessionizedEvents = require("./includes/sessionized_events");
// const sessions = require("./includes/sessions");

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
    // sessionizedEvents: sessionizedEvents(params),
    // sessions: sessions(params),
  }
}
