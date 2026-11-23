# Doodle Wall

Guests scan a QR code, pick a Christmas shape, color it on their phone and send it. It pops up live on the big screen.

| Page | Use |
|---|---|
| `index.html` | Phone page (the QR code points here) |
| `display.html` | Big screen. Options: `?title=`, `?tagline=`, `?max=40`, `?e=event-name` |
| `operator.html` | Hide drawings, clear the wall, download all as zip (needs the operator code) |

Backend is Supabase (table `doodle_drawings`, bucket `doodle-wall`). Setup SQL is in `supabase/schema.sql`.
