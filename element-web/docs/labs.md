# Labs features

If Labs is enabled in the [Element config](config.md), you can enable some of these features by going
to `Settings->Labs`. This list is non-exhaustive and subject to change, chat in
[#element-web:matrix.org](https://matrix.to/#/#element-web:matrix.org) for more information.

**Be warned! Labs features are not finalised, they may be fragile, they may change, they may be
dropped. Ask in the room if you are unclear about any details here.**

## Submit Abuse Report to Moderators [MSC3215](https://github.com/matrix-org/matrix-doc/pull/3215) support (`feature_report_to_moderators`)

A new version of the "Report" dialog that lets users send abuse reports directly to room moderators,
if the room supports it.

## Render LaTeX maths in messages (`feature_latex_maths`)

Enables rendering of LaTeX maths in messages using [KaTeX](https://katex.org/). LaTeX between single dollar-signs is interpreted as inline maths and double dollar-signs as display maths (i.e. centred on its own line).

## Message pinning (`feature_pinning`)

Allows you to pin messages in the room. To pin a message, use the 3 dots to the right of the message
and select "Pin".

## Jump to date (`feature_jump_to_date`)

Note: This labs feature is only visible when your homeserver has MSC3030 enabled
(in Synapse, add `experimental_features` -> `msc3030_enabled` to your
`homeserver.yaml`) which means `GET /_matrix/client/versions` responds with
`org.matrix.msc3030` under the `unstable_features` key.

Adds a dropdown menu to the date separator headers in the timeline which allows
you to jump to last week, last month, the beginning of the room, or choose a
date from the calendar.

Also adds the `/jumptodate 2022-01-31` slash command.

## Render simple counters in room header (`feature_state_counters`)

Allows rendering of labelled counters above the message list.

Once enabled, send a custom state event to a room to set values:

1. In a room, type `/devtools` to bring up the devtools interface
2. Click "Send Custom Event"
3. Toggle from "Event" to "State Event"
4. Set the event type to: `re.jki.counter` and give it a unique key
5. Specify the content in the following format:

```
{
    "link": "",
    "severity": "normal",
    "title": "my counter",
    "value": 0
}
```

That's it. Now should see your new counter under the header.

## New ways to ignore people (`feature_mjolnir`)

When enabled, a new settings tab appears for users to be able to manage their ban lists.
This is a different kind of ignoring where the ignored user's messages still get rendered,
but are hidden by default.

Ban lists are rooms within Matrix, proposed as [MSC2313](https://github.com/matrix-org/matrix-doc/pull/2313).
[Mjolnir](https://github.com/matrix-org/mjolnir) is a set of moderation tools which support
ban lists.

## Verifications in DMs (`feature_dm_verification`)

An implementation of [MSC2241](https://github.com/matrix-org/matrix-doc/pull/2241). When enabled, verification might not work with devices which don't support MSC2241.

This also includes a new implementation of the user & member info panel, designed to share more code between showing community members & room members. Built on top of this new panel is also a new UX for verification from the member panel.

The setting will be removed in a future release, enabling it non-optionally for
all users.

## Bridge info tab (`feature_bridge_state`)

Adds a "Bridge Info" tab to the Room Settings dialog, if a compatible bridge is
present in the room. The Bridge info tab pulls information from the `m.bridge` state event ([MSC2346](https://github.com/matrix-org/matrix-doc/pull/2346)). Since the feature is based upon a MSC, most
bridges are not expected to be compatible, and users should not rely on this
tab as the single source of truth just yet.

## Presence indicator in room list (`feature_presence_in_room_list`)

This adds a presence indicator in the room list next to DM rooms where the other
person is online.

## Custom themes (`feature_custom_themes`)

Custom themes are possible through Element's [theme support](./theming.md), though
normally these themes need to be defined in the config for Element. This labs flag
adds an ability for end users to add themes themselves by using a URL to the JSON
theme definition.

For some sample themes, check out [aaronraimist/element-themes](https://github.com/aaronraimist/element-themes).

## Message preview tweaks

To enable message previews in the left panel for reactions in all rooms, enable `feature_roomlist_preview_reactions_all`.

To enable message previews for reactions in DMs only, enable `feature_roomlist_preview_reactions_dms`. This is ignored when it is enabled for all rooms.

## Dehydrated devices (`feature_dehydration`)

Allows users to receive encrypted messages by creating a device that is stored
encrypted on the server, as described in [MSC2697](https://github.com/matrix-org/matrix-doc/pull/2697).

## Breadcrumbs v2 (`feature_breadcrumbs_v2`)

Instead of showing the horizontal list of breadcrumbs under the filter field, the new UX is an interactive context menu
triggered by the button to the right of the filter field.

## Spotlight search (`feature_spotlight`) [In Development]

Switches to a new room search experience.

## Extensible events rendering (`feature_extensible_events`) [In Development]

*Intended for developer use only at the moment.*

Extensible Events are a [new event format](https://github.com/matrix-org/matrix-doc/pull/1767) which
supports graceful fallback in unknown event types. Instead of rendering nothing or a blank space, events
can define a series of other events which represent the event's information but in different ways. The
base of these fallbacks being text.

Turning this flag on indicates that, when possible, the extensible events structure should be parsed on
supported event types. This should lead to zero perceptual change in the timeline except in cases where
the sender is using unknown/unrecognised event types.

Sending events with extensible events structure is always enabled - this should not affect any downstream
client.

## Right panel stays open (`feature_right_panel_default_open`)

This is an experimental default open right panel mode as a quick fix for those
who prefer to have the right panel open consistently across rooms.

If no right panel state is known for the room or it was closed on the last room
visit, it will default to the room member list. Otherwise, the saved card last
used in that room is shown.

## Pin drop location sharing (`feature_location_share_pin_drop`) [In Development]

Enables sharing a pin drop location to the timeline.

## Live location sharing (`feature_location_share_live`) [In Development]

Enables sharing your current location to the timeline, with live updates.

## Threaded Messaging (`feature_thread`)

Threading allows users to branch out a new conversation from the main timeline of a room. This is particularly useful in high traffic rooms where multiple conversations can happen in parallel or when a single discussion might stretch over a very long period of time.

Threads can be access by clicking their summary below the root event on the room timeline. Users can find a comprehensive list of threads by click the icon on the room header button.

This feature might work in degraded mode if the homeserver a user is connected to does not advertise support for the unstable feature `org.matrix.msc3440`  when calling the `/versions` API endpoint.

## Video rooms (`feature_video_rooms`)

Enables support for creating and joining video rooms, which are persistent video chats that users can jump in and out of.

## Element Call video rooms (`feature_element_call_video_rooms`) [In Development]

Enables support for video rooms that use Element Call rather than Jitsi, and causes the 'New video room' option to create Element Call video rooms rather than Jitsi ones.

This flag will not have any effect unless `feature_video_rooms` is also enabled.

## New group call experience (`feature_group_calls`) [In Development]

This feature allows users to place and join native [MSC3401](https://github.com/matrix-org/matrix-spec-proposals/pull/3401) group calls in compatible rooms, using Element Call.

If you're enabling this at the deployment level, you may also want to reference the docs for the `element_call` config section.

## Rich text in room topics (`feature_html_topic`) [In Development]

Enables rendering of MD / HTML in room topics.

## Exploring public spaces (`feature_exploring_public_spaces`)

Enables exploring public spaces in the new search dialog. Requires the server to
have [MSC3827](https://github.com/matrix-org/matrix-spec-proposals/pull/3827) enabled.

## Favourite Messages (`feature_favourite_messages`) [In Development]

Enables users to bookmark a message or content for a later reference.
