module.exports = (params) => {
  return publish("page_views", {
    ...params.defaultConfig
  }).query(ctx => `
  select
    pve.user_id as user_custom_id,
    pve.domain_userid as user_snowplow_domain_id,
    pve.network_userid as user_snowplow_crossdomain_id,
    pve.domain_sessionid as session_id,
    pve.domain_sessionidx as session_index,
    pve.page_view_id as page_view_id,
    row_number() over (partition by pve.domain_userid order by pvd.min_tstamp) as page_view_index,
    row_number() over (partition by pve.domain_sessionid order by pvd.min_tstamp) as page_view_in_session_index,
    pvd.time_engaged_s,
    case
      when pvd.time_engaged_in_s between 0 and 9 then '0s to 9s'
      when pvd.time_engaged_in_s between 10 and 29 then '10s to 29s'
      when pvd.time_engaged_in_s between 30 and 59 then '30s to 59s'
      when pvd.time_engaged_in_s > 59 then '60s or more'
      else null
    end as time_engaged_in_s_tier,
    pvd.horizontal_pixels_scrolled,
    pvd.vertical_pixels_scrolled,
    pvd.horizontal_percentage_scrolled,
    pvd.vertical_percentage_scrolled,
    case
      when pvd.vertical_percentage_scrolled between 0 and 24 then '0% to 24%'
      when pvd.vertical_percentage_scrolled between 25 and 49 then '25% to 49%'
      when pvd.vertical_percentage_scrolled between 50 and 74 then '50% to 74%'
      when pvd.vertical_percentage_scrolled between 75 and 100 then '75% to 100%'
      else null
    end as vertical_percentage_scrolled_tier,
    case when pvd.time_engaged_in_s = 0 then true else false end as user_bounced,
    case when pvd.time_engaged_in_s >= 30 and pvd.vertical_percentage_scrolled >= 25 then true else false end as user_engaged,
    pve.page_urlhost || pve.page_urlpath as page_url,
    pve.page_urlscheme as page_url_scheme,
    pve.page_urlhost as page_url_host,
    pve.page_urlport as page_url_port,
    pve.page_urlpath as page_url_path,
    pve.page_urlquery as page_url_query,
    pve.page_urlfragment as page_url_fragment,
    pve.page_title,
    pvd.doc_width as page_width,
    pvd.doc_height as page_height,
    pve.refr_urlhost || pve.refr_urlpath as referer_url,
    pve.refr_urlscheme as referer_url_scheme,
    pve.refr_urlhost as referer_url_host,
    pve.refr_urlport as referer_url_port,
    pve.refr_urlpath as referer_url_path,
    pve.refr_urlquery as referer_url_query,
    pve.refr_urlfragment as referer_url_fragment,
    case
      when pve.refr_medium is null then 'direct'
      when pve.refr_medium = 'unknown' then 'other'
      else pve.refr_medium
    end as referer_medium,
    pve.refr_source as referer_source,
    pve.refr_term as referer_term,
    pve.mkt_medium as marketing_medium,
    pve.mkt_source as marketing_source,
    pve.mkt_term as marketing_term,
    pve.mkt_content as marketing_content,
    pve.mkt_campaign as marketing_campaign,
    pve.mkt_clickid as marketing_click_id,
    pve.mkt_network as marketing_network,
    pve.geo_country,
    pve.geo_region,
    pve.geo_region_name,
    pve.geo_city,
    pve.geo_zipcode,
    pve.geo_latitude,
    pve.geo_longitude,
    pve.geo_timezone,
    pve.user_ipaddress as ip_address,
    pve.ip_isp,
    pve.ip_organization,
    pve.ip_domain,
    pve.ip_netspeed as ip_net_speed,
    pve.app_id,
    d.useragent_version as browser,
    d.useragent_family as browser_name,
    d.useragent_major as browser_major_version,
    d.useragent_minor as browser_minor_version,
    d.useragent_patch as browser_build_version,
    pve.br_renderengine as browser_engine,
    pvd.br_viewwidth as browser_window_width,
    pvd.br_viewheight as browser_window_height,
    pve.br_lang as browser_language,
    pve.os_manufacturer,
    pve.os_timezone,
    pve.dvce_type as device_type,
    pve.dvce_ismobile as device_is_mobile,
  from
    ${ctx.ref("page_view_events")} as pve
    inner join ${ctx.ref("page_view_derived")} as pvd
      on pve.page_view_id = pvd.page_view_id
  where 
    pve.br_family != 'robot/spider'
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
       or pve.useragent like '%pingdombot%'
       or pve.useragent like '%phantomjs%'
       or pve.useragent like '%yorexbot%'
       or pve.useragent like '%twitterbot%'
       or pve.useragent like '%a_archiver%'
       or pve.useragent like '%facebookexternalhit%'
       or pve.useragent like '%bingbot%'
       or pve.useragent like '%bingpreview%'
       or pve.useragent like '%googlebot%'
       or pve.useragent like '%baiduspider%'
       or pve.useragent like '%360spider%'
       or pve.useragent like '%360user-agent%'
       or pve.useragent like '%semalt%'
    )
    and pve.domain_userid is not null
    and pve.domain_sessionidx > 0 
`)
}
