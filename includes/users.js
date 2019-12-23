module.exports = (params) => {
  return publish("users", {
    ...params.defaultConfig
  }).query(ctx => `
  select
    user_snowplow_domain_id,
    min(session_start) as first_session_start,
    max(session_end) as last_session_end,
    sum(page_views) as page_views,
    sum(1) as sessions,
    sum(time_engaged_s) as total_session_time_s
  from 
    ${ctx.ref("sessions")}
  group by
    1
`)
}
