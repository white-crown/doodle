// Shared config, themes and shapes for the phone, display and operator pages.

var _params = new URLSearchParams(location.search);

// Publishable key: safe in the browser, access is limited by RLS (see supabase/schema.sql).
window.DW = {
  SUPABASE_URL: 'https://dwwsyaanyisevtioaiht.supabase.co',
  SUPABASE_KEY: 'sb_publishable_Ynnr4pueZ2Rfqhq4uPXCNQ_V8k-Bj-O',
  BUCKET: 'doodle-wall',
  TABLE: 'doodle_drawings',
  EVENTS_TABLE: 'doodle_events',
  // ?e=<event> picks the wall. Each wall has its own drawings and theme.
  EVENT: (_params.get('e') || 'main').slice(0, 40),
  // ?theme= forces a theme for previewing; normally the operator picks it.
  THEME_OVERRIDE: _params.get('theme'),
  MAX_PARAM: +_params.get('max') || 0,
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

// Six round petals around a round middle. Every circle winds the same way, so they merge.
function flowerPath() {
  function circle(cx, cy, r) {
    return 'M' + (cx + r).toFixed(1) + ' ' + cy.toFixed(1) + ' A' + r + ' ' + r + ' 0 1 1 ' + (cx - r).toFixed(1) + ' ' + cy.toFixed(1) +
      ' A' + r + ' ' + r + ' 0 1 1 ' + (cx + r).toFixed(1) + ' ' + cy.toFixed(1) + ' Z ';
  }
  var d = '';
  for (var i = 0; i < 6; i++) {
    var a = -Math.PI / 2 + i * Math.PI / 3;
    d += circle(50 + Math.cos(a) * 26, 50 + Math.sin(a) * 26, 20);
  }
  return d + circle(50, 50, 18);
}

// Qatar outline (geoBoundaries, simplified). 1000-tall version for the display map,
// 100-box version for the phone shape.
DW.QATAR_MAP = { w: 488, h: 1000, d: 'M268.8 0.0 L253.6 11.2 L242.3 6.1 L236.2 11.8 L234.2 7.1 L212.9 44.8 L199.9 52.4 L193.3 46.3 L185.4 53.8 L178.5 47.8 L175.3 58.6 L152.0 68.3 L155.5 85.6 L152.9 101.8 L145.1 101.6 L146.1 113.1 L136.4 117.9 L133.7 104.9 L127.9 105.0 L131.9 142.2 L110.1 192.7 L126.4 200.3 L124.9 226.5 L110.2 233.2 L112.1 220.4 L96.8 207.9 L83.9 226.2 L89.5 248.9 L76.2 266.6 L81.6 301.9 L95.2 317.1 L115.0 311.8 L119.7 299.8 L127.5 307.0 L114.2 322.2 L116.2 332.1 L109.4 334.7 L101.6 322.7 L91.0 332.1 L94.1 337.6 L83.8 365.7 L88.3 386.2 L74.7 368.9 L63.0 364.8 L65.3 352.6 L59.0 340.5 L69.5 312.3 L53.2 307.2 L51.6 299.5 L46.9 311.1 L55.7 321.6 L35.4 318.0 L23.4 331.0 L30.6 336.7 L41.7 332.8 L45.9 358.1 L36.5 373.2 L46.5 384.5 L50.1 394.7 L45.5 398.2 L53.2 410.5 L40.2 411.4 L26.2 372.6 L3.6 387.9 L10.6 397.1 L0.0 436.6 L6.9 453.0 L10.5 508.1 L5.4 524.6 L11.3 619.3 L32.4 650.8 L25.4 696.5 L54.5 734.5 L61.0 758.3 L55.9 784.6 L64.7 804.2 L60.4 822.6 L33.0 837.9 L98.7 958.1 L130.9 980.3 L186.6 1000.0 L295.3 979.4 L294.4 940.7 L303.6 923.8 L293.5 927.8 L286.2 923.3 L285.8 912.0 L282.6 918.1 L249.3 912.3 L252.1 898.1 L281.6 890.6 L284.3 896.1 L288.3 878.5 L297.9 902.5 L298.1 897.4 L305.7 901.4 L308.0 891.8 L318.1 889.5 L326.0 911.8 L320.5 921.0 L317.8 915.3 L317.6 926.1 L311.3 924.3 L314.4 949.2 L336.4 928.2 L333.0 922.4 L346.8 891.4 L346.2 902.5 L356.4 894.4 L358.1 899.9 L367.1 889.5 L366.4 876.1 L369.8 879.6 L389.8 834.1 L392.2 815.1 L387.8 820.4 L382.8 814.4 L394.0 812.5 L386.4 811.2 L391.6 798.6 L394.4 811.6 L395.9 785.2 L440.9 738.3 L456.3 705.5 L445.3 707.8 L449.1 700.7 L486.9 671.4 L454.7 688.5 L451.1 666.4 L455.6 665.2 L459.8 679.2 L484.2 666.9 L466.3 661.8 L469.6 673.2 L463.8 664.3 L469.0 673.5 L461.8 674.2 L460.2 644.1 L466.7 632.3 L460.9 586.0 L469.1 565.1 L455.0 543.8 L464.6 533.6 L471.6 536.8 L460.0 507.6 L452.9 515.9 L447.6 512.6 L448.1 519.1 L443.6 508.9 L429.3 516.5 L432.9 503.8 L422.1 513.7 L412.2 509.2 L424.4 493.8 L413.7 487.5 L419.7 472.0 L404.0 467.4 L423.9 458.7 L415.1 453.5 L422.6 451.6 L421.5 444.3 L406.3 438.7 L409.5 434.2 L410.8 441.5 L418.2 443.0 L412.7 437.1 L417.7 434.3 L422.4 443.3 L420.6 424.5 L409.8 416.7 L422.7 424.2 L425.4 420.0 L419.2 421.3 L404.7 407.3 L421.2 403.4 L397.2 405.1 L387.8 382.2 L400.3 367.3 L397.9 330.8 L422.8 321.2 L430.1 308.3 L429.9 294.0 L418.7 289.2 L423.3 281.1 L416.2 283.6 L404.5 276.3 L431.2 268.2 L435.1 280.0 L426.7 283.3 L437.6 283.2 L439.2 288.8 L445.5 285.9 L451.5 266.7 L448.4 250.8 L442.7 248.2 L439.3 256.5 L421.8 242.5 L434.8 246.3 L440.1 228.8 L433.2 230.5 L448.6 217.8 L453.3 226.4 L446.3 176.5 L488.4 154.2 L483.5 147.8 L488.1 154.1 L480.4 151.9 L446.4 176.0 L441.7 159.2 L435.6 159.6 L441.7 158.6 L435.6 158.5 L474.6 151.2 L465.4 147.0 L467.1 151.0 L447.9 157.3 L450.0 148.1 L467.3 139.0 L474.9 143.5 L463.6 138.2 L448.4 144.0 L458.6 138.8 L449.4 137.7 L453.6 133.2 L465.8 136.0 L456.3 130.8 L469.1 128.7 L486.3 137.7 L467.2 128.0 L453.5 130.1 L439.7 142.2 L428.9 137.2 L428.3 129.6 L422.0 134.4 L428.4 128.1 L421.9 134.3 L395.0 118.5 L369.8 124.8 L350.4 114.8 L347.5 87.8 L325.5 62.9 L326.1 33.1 L268.8 0.0 Z' };
var QATAR_D100 = 'M52.4 2.0 L50.9 3.1 L49.8 2.6 L49.3 3.1 L49.1 2.7 L47.0 6.3 L45.8 7.0 L45.1 6.4 L44.4 7.2 L43.7 6.6 L43.4 7.6 L41.2 8.6 L41.5 10.2 L41.3 11.8 L40.5 11.8 L40.6 12.9 L39.7 13.3 L39.4 12.1 L38.9 12.1 L39.2 15.7 L37.1 20.5 L38.7 21.2 L38.6 23.7 L37.2 24.4 L37.3 23.2 L35.9 22.0 L34.6 23.7 L35.2 25.9 L33.9 27.6 L34.4 31.0 L35.7 32.4 L37.6 31.9 L38.1 30.8 L38.8 31.5 L37.5 32.9 L37.7 33.9 L37.1 34.1 L36.3 33.0 L35.3 33.9 L35.6 34.4 L34.6 37.1 L35.1 39.1 L33.7 37.4 L32.6 37.0 L32.8 35.8 L32.2 34.7 L33.2 32.0 L31.7 31.5 L31.5 30.8 L31.1 31.9 L31.9 32.9 L30.0 32.5 L28.8 33.8 L29.5 34.3 L30.6 33.9 L31.0 36.4 L30.1 37.8 L31.0 38.9 L31.4 39.9 L30.9 40.2 L31.7 41.4 L30.4 41.5 L29.1 37.8 L26.9 39.2 L27.6 40.1 L26.6 43.9 L27.2 45.5 L27.6 50.8 L27.1 52.4 L27.7 61.5 L29.7 64.5 L29.0 68.9 L31.8 72.5 L32.4 74.8 L31.9 77.3 L32.8 79.2 L32.4 81.0 L29.7 82.4 L36.1 94.0 L39.1 96.1 L44.5 98.0 L54.9 96.0 L54.8 92.3 L55.7 90.7 L54.8 91.1 L54.1 90.6 L54.0 89.6 L53.7 90.1 L50.5 89.6 L50.8 88.2 L53.6 87.5 L53.9 88.0 L54.3 86.3 L55.2 88.6 L55.2 88.2 L55.9 88.5 L56.1 87.6 L57.1 87.4 L57.9 89.5 L57.3 90.4 L57.1 89.9 L57.1 90.9 L56.5 90.7 L56.8 93.1 L58.9 91.1 L58.5 90.6 L59.9 87.6 L59.8 88.6 L60.8 87.9 L61.0 88.4 L61.8 87.4 L61.8 86.1 L62.1 86.4 L64.0 82.1 L64.2 80.2 L63.8 80.8 L63.3 80.2 L64.4 80.0 L63.7 79.9 L64.2 78.7 L64.4 79.9 L64.6 77.4 L68.9 72.9 L70.4 69.7 L69.3 69.9 L69.7 69.3 L73.3 66.5 L70.2 68.1 L69.9 66.0 L70.3 65.9 L70.7 67.2 L73.1 66.0 L71.3 65.5 L71.7 66.6 L71.1 65.8 L71.6 66.7 L70.9 66.7 L70.8 63.8 L71.4 62.7 L70.8 58.3 L71.6 56.2 L70.3 54.2 L71.2 53.2 L71.8 53.5 L70.7 50.7 L70.1 51.5 L69.5 51.2 L69.6 51.8 L69.2 50.9 L67.8 51.6 L68.1 50.4 L67.1 51.3 L66.1 50.9 L67.3 49.4 L66.3 48.8 L66.9 47.3 L65.4 46.9 L67.3 46.0 L66.4 45.5 L67.1 45.4 L67.0 44.7 L65.6 44.1 L65.9 43.7 L66.0 44.4 L66.7 44.5 L66.2 44.0 L66.7 43.7 L67.1 44.6 L67.0 42.8 L65.9 42.0 L67.2 42.7 L67.4 42.3 L66.8 42.4 L65.4 41.1 L67.0 40.7 L64.7 40.9 L63.8 38.7 L65.0 37.3 L64.8 33.8 L67.2 32.8 L67.9 31.6 L67.8 30.2 L66.8 29.8 L67.2 29.0 L66.5 29.2 L65.4 28.5 L68.0 27.7 L68.3 28.9 L67.5 29.2 L68.6 29.2 L68.7 29.7 L69.3 29.4 L69.9 27.6 L69.6 26.1 L69.1 25.8 L68.7 26.6 L67.1 25.3 L68.3 25.6 L68.8 24.0 L68.2 24.1 L69.6 22.9 L70.1 23.7 L69.4 18.9 L73.5 16.8 L73.0 16.2 L73.4 16.8 L72.7 16.6 L69.4 18.9 L69.0 17.3 L68.4 17.3 L69.0 17.2 L68.4 17.2 L72.1 16.5 L71.3 16.1 L71.4 16.5 L69.6 17.1 L69.8 16.2 L71.4 15.3 L72.2 15.8 L71.1 15.3 L69.6 15.8 L70.6 15.3 L69.7 15.2 L70.1 14.8 L71.3 15.1 L70.4 14.6 L71.6 14.4 L73.3 15.2 L71.4 14.3 L70.1 14.5 L68.8 15.7 L67.8 15.2 L67.7 14.4 L67.1 14.9 L67.7 14.3 L67.1 14.9 L64.5 13.4 L62.1 14.0 L60.2 13.0 L59.9 10.4 L57.8 8.0 L57.9 5.2 L52.4 2.0 Z';

// Every shape lives in a 100 x 100 box.
var SHAPES = {
  star: { label: 'Star', d: starPath(50, 54, 46, 20, 5) },
  tree: { label: 'Tree',
    d: 'M50 4 L72 34 L62 34 L81 59 L69 59 L90 85 L57 85 L57 97 L43 97 L43 85 L10 85 L31 59 L19 59 L38 34 L28 34 Z' },
  ornament: { label: 'Ornament',
    d: 'M42 10 L58 10 L58 23 L42 23 Z M85 58 A35 35 0 1 1 15 58 A35 35 0 1 1 85 58 Z' },
  gingerbread: { label: 'Gingerbread',
    d: 'M50 4 C61 4 67 13 64 23 C63 26 62 28 60 29 L84 32 C93 33 93 46 84 47 L64 47 L66 62 L81 86 C85 95 74 100 69 92 L50 71 L31 92 C26 100 15 95 19 86 L34 62 L36 47 L16 47 C7 46 7 33 16 32 L40 29 C38 28 37 26 36 23 C33 13 39 4 50 4 Z' },
  stocking: { label: 'Stocking',
    d: 'M32 4 L72 4 L72 22 L68 22 L68 54 C68 61 65 66 59 71 L43 87 C35 96 18 95 14 84 C10 74 16 67 23 62 L36 53 L36 22 L32 22 Z' },
  bell: { label: 'Bell',
    d: 'M50 6 C54 6 57 9 57 13 C71 17 77 29 77 45 C77 61 81 70 89 77 L89 83 L11 83 L11 77 C19 70 23 61 23 45 C23 29 29 17 43 13 C43 9 46 6 50 6 Z M41 87 A9 9 0 0 0 59 87 Z' },

  face: { label: 'Face',
    d: 'M50 3 C70 3 84 14 85 38 C88 38 90 41 90 46 L90 56 C90 62 88 65 84 66 C82 72 79 76 74 82 C66 91 58 97 50 97 C42 97 34 91 26 82 C21 76 18 72 16 66 C12 65 10 62 10 56 L10 46 C10 41 12 39 15 38 C16 14 30 3 50 3 Z' },

  cake: { label: 'Cake',
    d: 'M47 6 C47 2 53 2 53 6 C53 9 51 11 50 12 C49 11 47 9 47 6 Z M47 14 L53 14 L53 34 L47 34 Z M14 34 L86 34 C90 34 92 36 92 40 L92 90 L8 90 L8 40 C8 36 10 34 14 34 Z M4 90 L96 90 L96 96 L4 96 Z' },
  gift: { label: 'Gift',
    d: 'M8 40 L92 40 L92 56 L86 56 L86 94 L14 94 L14 56 L8 56 Z M50 40 C40 22 22 18 24 30 C25 36 38 40 50 40 Z M50 40 C60 22 78 18 76 30 C75 36 62 40 50 40 Z' },
  ring: { label: 'Ring',
    d: 'M84 62 A34 34 0 1 1 16 62 A34 34 0 1 1 84 62 Z M74 62 A24 24 0 1 0 26 62 A24 24 0 1 0 74 62 Z M36 16 L43 6 L57 6 L64 16 L50 28 Z' },
  dove: { label: 'Dove',
    d: 'M10 52 C20 50 30 52 38 56 C36 40 30 26 20 14 C36 18 50 32 56 50 C62 44 70 40 78 40 C84 40 88 44 90 46 L98 48 L90 52 C88 60 80 68 68 72 C58 76 46 76 36 72 L18 80 C22 72 26 68 28 64 C22 60 16 56 10 52 Z' },
  flower: { label: 'Flower', d: flowerPath() },
  weddingcake: { label: 'Wedding cake',
    d: 'M36 14 L64 14 L64 36 L76 36 L76 62 L88 62 L88 92 L12 92 L12 62 L24 62 L24 36 L36 36 Z' },

  qatar: { label: 'Qatar', d: QATAR_D100 },
  falcon: { label: 'Falcon',
    d: 'M46 10 C54 6 64 10 66 18 L77 22 L66 26 C66 30 64 32 62 34 C72 42 78 56 76 70 C75 78 70 84 64 88 L68 96 L56 96 L54 90 L46 90 L44 96 L32 96 L36 88 C28 82 24 70 26 58 C28 44 34 36 42 32 C38 26 38 16 46 10 Z' },
  dhow: { label: 'Dhow',
    d: 'M50 6 L50 60 L16 60 C24 42 36 22 50 6 Z M55 16 L55 60 L82 60 C78 44 68 28 55 16 Z M6 65 L94 65 L80 86 L20 86 Z' },
  palm: { label: 'Palm',
    d: 'M47 96 C48 80 49 62 48 46 C40 50 28 58 18 66 C22 54 32 44 42 40 C32 38 20 40 8 46 C14 34 30 28 44 32 C38 24 30 18 22 16 C34 12 44 18 50 28 C56 18 66 12 78 16 C70 18 62 24 56 32 C70 28 86 34 92 46 C80 40 68 38 58 40 C68 44 78 54 82 66 C72 58 60 50 52 46 C51 62 52 80 53 96 Z' },
  dallah: { label: 'Dallah',
    d: 'M45 4 L55 4 L57 12 C62 14 64 18 62 22 C67 24 68 30 63 34 C70 42 74 56 72 70 C80 70 86 64 86 56 C86 50 82 46 76 46 L76 40 C86 40 92 48 92 57 C92 68 84 76 71 76 C68 86 61 92 50 92 C38 92 31 86 29 76 C27 62 30 48 37 37 C28 33 18 24 10 12 C20 18 28 23 37 26 C36 22 38 18 42 16 C40 12 42 8 45 4 Z' },
  heart: { label: 'Heart',
    d: 'M50 90 C20 70 6 52 6 34 C6 18 18 8 31 8 C40 8 46 13 50 20 C54 13 60 8 69 8 C82 8 94 18 94 34 C94 52 80 70 50 90 Z' },

  firework: { label: 'Firework', d: starPath(50, 50, 47, 28, 12) },
  balloon: { label: 'Balloon',
    d: 'M50 6 C72 6 84 24 84 42 C84 62 66 76 54 78 L58 86 L42 86 L46 78 C34 76 16 62 16 42 C16 24 28 6 50 6 Z' },
  glass: { label: 'Glass',
    d: 'M30 6 L70 6 C72 28 66 46 54 52 L54 82 L68 90 L68 95 L32 95 L32 90 L46 82 L46 52 C34 46 28 28 30 6 Z' },
  clock: { label: 'Clock',
    d: 'M90 56 A40 40 0 1 1 10 56 A40 40 0 1 1 90 56 Z M16 18 L30 6 L36 13 L22 25 Z M84 18 L70 6 L64 13 L78 25 Z' },
  hat: { label: 'Party hat',
    d: 'M50 6 L80 88 C70 95 30 95 20 88 Z M58 7 A8 8 0 1 1 42 7 A8 8 0 1 1 58 7 Z' },
};

DW.THEMES = {
  christmas: {
    label: 'Christmas',
    title: 'Merry Christmas!',
    tagline: 'Scan the code, draw your own, and watch it appear here',
    shapes: ['star', 'tree', 'ornament', 'gingerbread', 'stocking', 'bell', 'face'],
    palette: ['#c8323b', '#8e1b24', '#f07f2e', '#e8b64c', '#ffe066', '#7ccf6b', '#2f8f4e', '#174d34',
              '#6ec3f0', '#2e5fc8', '#8a5cd6', '#f28cb8', '#8b5a3c', '#ffffff', '#9aa3ad', '#23201c'],
    vars: { bg1: '#1d4a3b', bg2: '#0a1f19', accent: '#c8323b', accentInk: '#ffffff', soft: '#cfe3d8' },
    max: 40,
  },
  qatar: {
    label: 'Qatar',
    title: 'Draw for Qatar',
    tagline: 'Scan the code, draw, and watch the falcon bring it to the map',
    shapes: ['qatar', 'falcon', 'dhow', 'palm', 'dallah', 'heart', 'face'],
    palette: ['#8a1538', '#5c0e25', '#ffffff', '#e9d8b4', '#c9a14a', '#d9822b', '#7a5a42', '#3e8e4f',
              '#1f5132', '#6ec3f0', '#1f6fb2', '#2bb3a8', '#f28cb8', '#8a5cd6', '#9aa3ad', '#23201c'],
    vars: { bg1: '#8a1538', bg2: '#33050f', accent: '#8a1538', accentInk: '#ffffff', soft: '#f1dbe2' },
    max: 30,
  },
  newyear: {
    label: 'New Year',
    title: 'Happy New Year!',
    tagline: 'Scan the code, draw your wish, and light up the sky',
    shapes: ['firework', 'star', 'balloon', 'glass', 'clock', 'hat', 'face'],
    palette: ['#e8b64c', '#ffe066', '#c9d1d9', '#ffffff', '#e5484d', '#f28cb8', '#8a5cd6', '#5b3fd1',
              '#2e5fc8', '#4cc9f0', '#4caf50', '#b5e853', '#f07f2e', '#8b5a3c', '#1b2350', '#23201c'],
    vars: { bg1: '#1f2a66', bg2: '#05060f', accent: '#e8b64c', accentInk: '#1b1405', soft: '#d6dcf5' },
    max: 40,
  },
  birthday: {
    label: 'Birthday',
    title: 'Happy Birthday!',
    tagline: 'Scan the code, draw a birthday wish, and watch the balloons bring it up',
    shapes: ['cake', 'balloon', 'gift', 'hat', 'star', 'heart', 'face'],
    palette: ['#ff5d8f', '#ff99b6', '#ffb347', '#ffe066', '#b5e853', '#4caf50', '#4cc9f0', '#2e5fc8',
              '#8a5cd6', '#c77dff', '#e5484d', '#8b5a3c', '#ffffff', '#c9d1d9', '#9aa3ad', '#23201c'],
    vars: { bg1: '#7b3fd1', bg2: '#2a0f5c', accent: '#ff5d8f', accentInk: '#ffffff', soft: '#ead9ff' },
    max: 40,
  },
  wedding: {
    label: 'Wedding',
    title: 'Happily Ever After',
    tagline: 'Scan the code and draw a wish for the couple',
    shapes: ['heart', 'ring', 'dove', 'flower', 'weddingcake', 'glass', 'face'],
    palette: ['#f4c2c2', '#e8909c', '#c45b74', '#fff8ee', '#f3e5c8', '#d4af37', '#b8935a', '#a8c3a0',
              '#5f8a6a', '#a7c7e7', '#5b7fa6', '#c8b6e2', '#ffffff', '#c9c9c9', '#7a6e66', '#2b2420'],
    vars: { bg1: '#5a3a4a', bg2: '#1e1418', accent: '#d4af37', accentInk: '#1e1418', soft: '#f3e5e8' },
    max: 40,
  },
};

// Operator's custom background for a theme: { c1, c2, image } (each optional).
DW.backgroundFor = function (cfg, theme) {
  var all = (cfg && cfg.backgrounds) || {};
  return all[theme] || {};
};
DW.bgImageUrl = function (path) {
  return DW.SUPABASE_URL + '/storage/v1/object/public/doodle-bg/' + path;
};
DW.applyBackground = function (theme, bg) {
  var v = DW.theme(theme).vars, s = document.documentElement.style, b = document.body.style;
  bg = bg || {};
  s.setProperty('--bg1', bg.c1 || v.bg1);
  s.setProperty('--bg2', bg.c2 || v.bg2);
  if (bg.image) {
    b.backgroundImage = 'linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url("' + DW.bgImageUrl(bg.image) + '")';
    b.backgroundSize = 'cover'; b.backgroundPosition = 'center';
  } else {
    b.backgroundImage = ''; b.backgroundSize = ''; b.backgroundPosition = '';
  }
};

DW.theme = function (name) { return DW.THEMES[name] || DW.THEMES.christmas; };
DW.shape = function (id) { var s = SHAPES[id] || SHAPES.star; return { id: id, label: s.label, d: s.d }; };
DW.shapesFor = function (theme) { return DW.theme(theme).shapes.map(DW.shape); };

// Event settings picked by the operator: { theme, title, tagline }.
DW.loadEvent = async function (db) {
  var cfg = { theme: 'christmas', title: null, tagline: null, backgrounds: {} };
  try {
    var res = await db.from(DW.EVENTS_TABLE).select('theme,title,tagline,backgrounds').eq('event', DW.EVENT).maybeSingle();
    if (res.data) cfg = res.data;
  } catch (e) { console.error(e); }
  if (DW.THEME_OVERRIDE && DW.THEMES[DW.THEME_OVERRIDE]) cfg.theme = DW.THEME_OVERRIDE;
  return cfg;
};

DW.applyVars = function (theme, cfg) {
  var v = DW.theme(theme).vars, s = document.documentElement.style;
  DW.applyBackground(theme, DW.backgroundFor(cfg, theme));
  s.setProperty('--accent', v.accent); s.setProperty('--accent-ink', v.accentInk); s.setProperty('--soft', v.soft);
  document.body.dataset.theme = DW.THEMES[theme] ? theme : 'christmas';
};
