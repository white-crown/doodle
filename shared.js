// Shared config + shapes for the phone, display and operator pages.

// Publishable key: safe in the browser, access is limited by RLS (see supabase/schema.sql).
window.DW = {
  SUPABASE_URL: 'https://dwwsyaanyisevtioaiht.supabase.co',
  SUPABASE_KEY: 'sb_publishable_Ynnr4pueZ2Rfqhq4uPXCNQ_V8k-Bj-O',
  BUCKET: 'doodle-wall',
  TABLE: 'doodle_drawings',
  // ?e=<event> in the URL picks the event, so one setup can run many activations.
  EVENT: (new URLSearchParams(location.search).get('e') || 'christmas').slice(0, 40),
  // ?max=<n> on the display: fewer = bigger drawings.
  MAX_ON_WALL: Math.min(200, Math.max(6, +(new URLSearchParams(location.search).get('max')) || 40)),
};

DW.client = function () {
  return supabase.createClient(DW.SUPABASE_URL, DW.SUPABASE_KEY);
};

DW.imageUrl = function (path) {
  return DW.SUPABASE_URL + '/storage/v1/object/public/' + DW.BUCKET + '/' + path;
};

function starPath(cx, cy, outer, inner, points) {
  var d = '';
  for (var i = 0; i < points * 2; i++) {
    var r = i % 2 === 0 ? outer : inner;
    var a = -Math.PI / 2 + (i * Math.PI) / points;
    d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2) + ' ';
  }
  return d + 'Z';
}

// Every shape lives in a 100 x 100 box.
DW.SHAPES = [
  { id: 'star', label: 'Star', d: starPath(50, 54, 46, 20, 5) },
  { id: 'tree', label: 'Tree',
    d: 'M50 4 L72 34 L62 34 L81 59 L69 59 L90 85 L57 85 L57 97 L43 97 L43 85 L10 85 L31 59 L19 59 L38 34 L28 34 Z' },
  { id: 'ornament', label: 'Ornament',
    d: 'M42 10 L58 10 L58 23 L42 23 Z M85 58 A35 35 0 1 1 15 58 A35 35 0 1 1 85 58 Z' },
  { id: 'gingerbread', label: 'Gingerbread',
    d: 'M50 4 C61 4 67 13 64 23 C63 26 62 28 60 29 L84 32 C93 33 93 46 84 47 L64 47 L66 62 L81 86 C85 95 74 100 69 92 L50 71 L31 92 C26 100 15 95 19 86 L34 62 L36 47 L16 47 C7 46 7 33 16 32 L40 29 C38 28 37 26 36 23 C33 13 39 4 50 4 Z' },
  { id: 'stocking', label: 'Stocking',
    d: 'M32 4 L72 4 L72 22 L68 22 L68 54 C68 61 65 66 59 71 L43 87 C35 96 18 95 14 84 C10 74 16 67 23 62 L36 53 L36 22 L32 22 Z' },
  { id: 'bell', label: 'Bell',
    d: 'M50 6 C54 6 57 9 57 13 C71 17 77 29 77 45 C77 61 81 70 89 77 L89 83 L11 83 L11 77 C19 70 23 61 23 45 C23 29 29 17 43 13 C43 9 46 6 50 6 Z M41 87 A9 9 0 0 0 59 87 Z' },
];

DW.shapeById = function (id) {
  for (var i = 0; i < DW.SHAPES.length; i++) if (DW.SHAPES[i].id === id) return DW.SHAPES[i];
  return DW.SHAPES[0];
};
