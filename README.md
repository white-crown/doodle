# Doodle Wall

Guests scan a QR code, pick a shape, color it on their phone and send it. It pops up live on the big screen.

| Page | Use |
|---|---|
| `index.html` | Phone page (the QR code points here) |
| `display.html` | Big screen. Options: `?title=`, `?tagline=`, `?max=40`, `?e=event-name` |
| `operator.html` | Pick the theme (Christmas, Qatar, New Year, Birthday, Wedding), set title, tagline and a background per theme (colors or a picture), hide drawings, clear the wall, download all as zip (needs the operator code) |

Backend is Supabase (table `doodle_drawings`, bucket `doodle-wall`). Setup SQL is in `supabase/schema.sql`.

Themes: Christmas (snow), Qatar (map of Qatar, a falcon carries each drawing onto the map), New Year (each drawing launches as a firework), Birthday (confetti, balloons lift each drawing), Wedding (falling petals, heart sparkle).
The operator's pick lives in `doodle_events`; the display switches live.
