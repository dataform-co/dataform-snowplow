module.exports = (params) => {
  return publish("sessions", {
    ...params.defaultConfig
  }).query(ctx => `
  select
    session_id,
    user_custom_id,
    user_snowplow_domain_id,
    user_snowplow_crossdomain_id,
    min(page_view_start) as session_start,
    max(page_view_end) as session_end,
    sum(1) as page_views,
    sum(case when user_bounced then 1 else 0 end) as bounced_page_views,
    sum(case when user_engaged then 1 else 0 end) as engaged_page_views,
    sum(time_engaged_s) as session_length_s
  from 
    ${ctx.ref("page_views")}
  group by 1
`)
}
