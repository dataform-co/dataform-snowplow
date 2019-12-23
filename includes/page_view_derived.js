function extractSecondsFromTimestamp(timestamp) {
  return ({
    bigquery: `unix_seconds(${timestamp})`,
    redshift: `extract(epoch from ${timestamp})`,
    snowflake: `extract(epoch from ${timestamp})`
  })[global.session.config.warehouse];
}

module.exports = (params) => {
  return publish("page_view_time", {
    ...params.defaultConfig
  }).query(ctx => `
  with initial as (
  select
    page_view_id,
    min(derived_tstamp) as min_page_timestamp,
    max(derived_tstamp) as max_page_timestamp,
    sum(case when event_name = 'page_view' then 1 else 0 end) as page_view_count,
    sum(case when event_name = 'page_ping' then 1 else 0 end) as page_ping_count,
    ${params.heartBeatSeconds} * count(distinct(floor(${extractSecondsFromTimestamp("derived_tstamp")})/${params.heartBeatSeconds}))) - ${params.minimumVisitLengthSeconds} as time_engaged_s, --TODO: Understand this logic
    max(doc_width) as max_doc_width,
    max(doc_height) as max_doc_height,
    max(br_viewwidth) as max_br_viewwidth,
    max(br_viewwheight) as max_br_viewheight,
    least(greatest(min(coalesce(pp_xoffset_min, 0)), 0), max(doc_width)) as hmin,
    least(greatest(max(coalesce(pp_xoffset_max, 0)), 0), max(doc_width)) as hmax,
    least(greatest(min(coalesce(pp_yoffset_min, 0)), 0), max(doc_height)) as vmin,
    least(greatest(max(coalesce(pp_yoffset_max, 0)), 0), max(doc_height)) as vmax
  from
    ${ctx.ref(params.snowplowSchema, "events")}
  where
    platform = 'web'
    and event_name in ('page_view','page_ping')
  )

  select
    page_view_id,
    min_page_timestamp,
    max_page_timestamp,
    page_view_count,
    page_ping_count,
    time_engaged_s,
    max_doc_width,
    max_doc_height,
    max_br_viewwidth,
    max_br_viewheight,
    hmax as horizontal_pixels_scrolled,
    vmax as vertical_pixels_scrolled,
    round(100*(least(hmax + br_viewwidth, doc_width)/doc_width)) as horizontal_percentage_scrolled,
    round(100*(least(vmax + br_viewheight, doc_height)/doc_height)) as vertical_percentage_scrolled
  from
    initial
`)
}
