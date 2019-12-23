module.exports = (params) => {
  return publish("page_view_events", {
    ...params.defaultConfig
  }).query(ctx => `
  select
    ${event_fields.DATE_TIME_FIELDS},
    ${event_fields.DATE_TIME_FIELDS},
    ${event_fields.EVENT_TRANSACTION_FIELDS},
    ${event_fields.SNOWPLOW_VERSION_FIELDS},
    ${event_fields.USER_FIELDS},
    ${event_fields.DEVICE_OS_FIELDS},
    ${event_fields.LOCATION_FIELDS},
    ${event_fields.IP_FIELDS},
    ${event_fields.METADATA_FIELDS},
    ${event_fields.PAGE_FIELDS},
    ${event_fields.DOCUMENT_FIELDS},
    ${event_fields.MARKETING_FIELDS},
    ${event_fields.BROWSER_FIELDS}
  from
    ${ctx.ref(params.snowplowSchema, "events")}
  where
    platform = 'web'
    and event_name = 'page_view'
`)
}
