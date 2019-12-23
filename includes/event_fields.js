// From here: https://github.com/snowplow/snowplow/wiki/canonical-event-model

let DATE_TIME_FIELDS = `collector_tstamp,
dvce_created_tstamp,
dvce_sent_tstamp,
etl_tstamp,
os_timezone,
derived_tstamp,
true_tstamp`;

let EVENT_TRANSACTION_FIELDS = `event,
event_id,
txn_id,
event_fingerprint`;

let SNOWPLOW_VERSION_FIELDS = `v_tracker,
v_collector,
v_etl,
name_tracker,
etl_tags`;

let USER_FIELDS = `user_id,
domain_userid,
network_userid,
user_ipaddress,
domain_sessionidx,
domain_sessionid`;

let DEVICE_OS_FIELDS = `useragent,
dvce_type,
dvce_ismobile,
dvce_screenheight,
dvce_screenwidth,
os_name,
os_family,
os_manufacturer`;

let LOCATION_FIELDS = `geo_region,
geo_country,
geo_city,
geo_zipcode,
geo_latitude,
geo_longitude,
geo_region_name,
geo_timezon`;

let IP_FIELDS = `ip_isp,
ip_organization,
ip_domain,
ip_netspeed`;

let METADATA_FIELDS = `event_vendor,
event_name,
event_format,
event_version`;

let PAGE_FIELDS = `page_url,
page_urlscheme,
page_urlhost,
page_urlport,
page_urlpath,
page_urlquery,
page_urlfragment,
page_referrer,
page_title,
refr_urlscheme,
refr_urlhost,
refr_urlport,
refr_urlpath,
refr_urlquery,
refr_urlfragment,
refr_medium,
refr_source,
refr_term,
refr_domain_userid,
refr_dvce_tstamp`;

let DOCUMENT_FIELDS = `doc_charset,
doc_width,
doc_height`;

let MARKETING_FIELDS = `mkt_medium,
mkt_source,
mkt_term,
mkt_content,
mkt_campaign,
mkt_clickid,
mkt_network`;

let BROWSER_FIELDS = `user_fingerprint,
connection_type,
cookie,
br_name,
br_version,
br_family,
br_type,
br_renderengine,
br_lang,
br_features_pdf,
br_features_flash,
br_features_java,
br_features_director,
br_features_quicktime,
br_features_realplayer,
br_features_windowsmedia,
br_features_gears,
br_features_silverlight,
br_cookies,
br_colordepth,
br_viewheight,
br_viewwidt`;

let PAGE_PING_FIELDS = `pp_xoffset_min,
pp_xoffset_max,
pp_yoffset_min,
pp_yoffset_max`;

let ECOMMERCE_FIELDS = `tr_orderid,
tr_affiliation,
tr_total,
tr_tax,
tr_shipping,
tr_total_base,
tr_tax_base,
tr_shipping_base,
tr_city,
tr_state,
tr_country,
tr_currency,
ti_orderid,
ti_sku,
ti_name,
ti_category,
ti_price,
ti_price_base,
ti_quantity,
ti_currency,
base_currency`;

let CUSTOM_STRUCURED_EVENTS_FIELDS = `se_category,
se_action,
se_label,added,
se_property,
se_value`;

module.exports = {
  DATE_TIME_FIELDS,
  EVENT_TRANSACTION_FIELDS,
  SNOWPLOW_VERSION_FIELDS,
  USER_FIELDS,
  DEVICE_OS_FIELDS,
  LOCATION_FIELDS,
  IP_FIELDS,
  METADATA_FIELDS,
  PAGE_FIELDS,
  DOCUMENT_FIELDS,
  MARKETING_FIELDS,
  BROWSER_FIELDS,
  PAGE_PING_FIELDS,
  ECOMMERCE_FIELDS,
  CUSTOM_STRUCURED_EVENTS_FIELDS
}
