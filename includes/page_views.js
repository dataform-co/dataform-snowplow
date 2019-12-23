module.exports = (params) => {
  return publish("page_views", {
    ...params.defaultConfig
  }).query(ctx => `
  select
    pve.user_id AS user_custom_id,
    pve.domain_userid AS user_snowplow_domain_id,
    pve.network_userid AS user_snowplow_crossdomain_id,
    pve.domain_sessionid AS session_id,
    pve.domain_sessionidx AS session_index,
    pve.page_view_id as page_view_id,
    ROW_NUMBER() OVER (PARTITION BY pve.domain_userid ORDER BY pvd.min_tstamp) as page_view_index,
    ROW_NUMBER() OVER (PARTITION BY pve.domain_sessionid ORDER BY pvd.min_tstamp) AS page_view_in_session_index,
    pvd.time_engaged_s,
    CASE
      WHEN pvd.time_engaged_in_s BETWEEN 0 AND 9 THEN '0s to 9s'
      WHEN pvd.time_engaged_in_s BETWEEN 10 AND 29 THEN '10s to 29s'
      WHEN pvd.time_engaged_in_s BETWEEN 30 AND 59 THEN '30s to 59s'
      WHEN pvd.time_engaged_in_s > 59 THEN '60s or more'
      ELSE NULL
    END AS time_engaged_in_s_tier,
    pvd.horizontal_pixels_scrolled,
    pvd.vertical_pixels_scrolled,
    pvd.horizontal_percentage_scrolled,
    pvd.vertical_percentage_scrolled,
    CASE
      WHEN pvd.vertical_percentage_scrolled BETWEEN 0 AND 24 THEN '0% to 24%'
      WHEN pvd.vertical_percentage_scrolled BETWEEN 25 AND 49 THEN '25% to 49%'
      WHEN pvd.vertical_percentage_scrolled BETWEEN 50 AND 74 THEN '50% to 74%'
      WHEN pvd.vertical_percentage_scrolled BETWEEN 75 AND 100 THEN '75% to 100%'
      ELSE NULL
    END AS vertical_percentage_scrolled_tier,
    CASE WHEN pvd.time_engaged_in_s = 0 THEN TRUE ELSE FALSE END AS user_bounced,
    CASE WHEN pvd.time_engaged_in_s >= 30 AND pvd.vertical_percentage_scrolled >= 25 THEN TRUE ELSE FALSE END AS user_engaged,
    pve.page_urlhost || pve.page_urlpath AS page_url,
    pve.page_urlscheme AS page_url_scheme,
    pve.page_urlhost AS page_url_host,
    pve.page_urlport AS page_url_port,
    pve.page_urlpath AS page_url_path,
    pve.page_urlquery AS page_url_query,
    pve.page_urlfragment AS page_url_fragment,
    pve.page_title,
    pvd.doc_width AS page_width,
    pvd.doc_height AS page_height,
    pve.refr_urlhost || pve.refr_urlpath AS referer_url,
    pve.refr_urlscheme AS referer_url_scheme,
    pve.refr_urlhost AS referer_url_host,
    pve.refr_urlport AS referer_url_port,
    pve.refr_urlpath AS referer_url_path,
    pve.refr_urlquery AS referer_url_query,
    pve.refr_urlfragment AS referer_url_fragment,
    CASE
      WHEN pve.refr_medium IS NULL THEN 'direct'
      WHEN pve.refr_medium = 'unknown' THEN 'other'
      ELSE pve.refr_medium
    END AS referer_medium,
    pve.refr_source AS referer_source,
    pve.refr_term AS referer_term,
    pve.mkt_medium AS marketing_medium,
    pve.mkt_source AS marketing_source,
    pve.mkt_term AS marketing_term,
    pve.mkt_content AS marketing_content,
    pve.mkt_campaign AS marketing_campaign,
    pve.mkt_clickid AS marketing_click_id,
    pve.mkt_network AS marketing_network,
    pve.geo_country,
    pve.geo_region,
    pve.geo_region_name,
    pve.geo_city,
    pve.geo_zipcode,
    pve.geo_latitude,
    pve.geo_longitude,
    pve.geo_timezone,
    pve.user_ipaddress AS ip_address,
    pve.ip_isp,
    pve.ip_organization,
    pve.ip_domain,
    pve.ip_netspeed AS ip_net_speed,
    pve.app_id,
    d.useragent_version AS browser,
    d.useragent_family AS browser_name,
    d.useragent_major AS browser_major_version,
    d.useragent_minor AS browser_minor_version,
    d.useragent_patch AS browser_build_version,
    pve.br_renderengine AS browser_engine,
    pvd.br_viewwidth AS browser_window_width,
    pvd.br_viewheight AS browser_window_height,
    pve.br_lang AS browser_language,
    pve.os_manufacturer,
    pve.os_timezone,
    pve.dvce_type AS device_type,
    pve.dvce_ismobile AS device_is_mobile,
  from
    ${ctx.ref("page_view_events")} as pve
    inner join ${ctx.ref("page_view_derived")} as pvd
      on pve.page_view_id = pvd.page_view_id
  where 
    pve.br_family != 'Robot/Spider'
    and not
    (pve.useragent like '%bot%'
       or pve.useragent like '%crawl%'
       or pve.useragent like '%slurp%'
       or pve.useragent like '%spider%'
       or pve.useragent like '%archiv%'
       or pve.useragent like '%spinn%'
       or pve.useragent like '%sniff%'
       or pve.useragent like '%seo%'
       or pve.useragent like '%audit%'
       or pve.useragent like '%survey%'
       or pve.useragent like '%pingdom%'
       or pve.useragent like '%worm%'
       or pve.useragent like '%capture%'
       or pve.useragent like '%browsershots%'
       or pve.useragent like '%screenshots%'
       or pve.useragent like '%analyz%'
       or pve.useragent like '%index%'
       or pve.useragent like '%thumb%'
       or pve.useragent like '%check%'
       or pve.useragent like '%facebook%'
       or pve.useragent like '%PingdomBot%'
       or pve.useragent like '%PhantomJS%'
       or pve.useragent like '%YorexBot%'
       or pve.useragent like '%Twitterbot%'
       or pve.useragent like '%a_archiver%'
       or pve.useragent like '%facebookexternalhit%'
       or pve.useragent like '%Bingbot%'
       or pve.useragent like '%BingPreview%'
       or pve.useragent like '%Googlebot%'
       or pve.useragent like '%Baiduspider%'
       or pve.useragent like '%360Spider%'
       or pve.useragent like '%360User-agent%'
       or pve.useragent like '%semalt%'
    )
    and pve.domain_userid is not null
    and pve.domain_sessionidx > 0 
`)
}
