/**
 * Client-side filtering for /database/.
 *
 * Served from public/ as a real file rather than an Astro <script>, because
 * Astro inlines small scripts into the HTML and the site's CSP is
 * `script-src 'self'` — an inlined block gets blocked outright.
 */
(function () {
  var q = document.getElementById("q");
  var maker = document.getElementById("maker");
  var sort = document.getElementById("sort");
  var list = document.getElementById("list");
  var count = document.getElementById("count");
  var empty = document.getElementById("empty");
  var reset = document.getElementById("reset");
  if (!q || !maker || !sort || !list || !count || !empty) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll("[data-row]"));
  var total = rows.length;

  function grams(el) {
    var g = parseFloat(el.dataset.grams || "");
    return isFinite(g) ? g : -1;
  }
  function when(el) {
    return Date.parse(el.dataset.date || "") || 0;
  }
  function name(el) {
    var t = el.querySelector(".row__title");
    return t ? t.textContent.trim() : "";
  }

  var comparators = {
    newest: function (a, b) { return when(b) - when(a); },
    oldest: function (a, b) { return when(a) - when(b); },
    heaviest: function (a, b) { return grams(b) - grams(a); },
    lightest: function (a, b) {
      // Entries with no stated weight have no place in a lightest-first list.
      var ga = grams(a), gb = grams(b);
      if (ga < 0) return 1;
      if (gb < 0) return -1;
      return ga - gb;
    },
    az: function (a, b) { return name(a).localeCompare(name(b)); }
  };

  function apply() {
    var term = q.value.trim().toLowerCase();
    var m = maker.value;
    var shown = 0;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var hit =
        (!term || (row.dataset.search || "").indexOf(term) !== -1) &&
        (!m || row.dataset.maker === m);
      row.hidden = !hit;
      if (hit) shown++;
    }

    var ordered = rows.slice().sort(comparators[sort.value] || comparators.newest);
    for (var j = 0; j < ordered.length; j++) list.appendChild(ordered[j]);

    count.textContent = shown + " of " + total + " entries";
    empty.hidden = shown > 0;

    var params = new URLSearchParams();
    if (term) params.set("q", q.value.trim());
    if (m) params.set("maker", m);
    var qs = params.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  var initial = new URLSearchParams(location.search);
  q.value = initial.get("q") || "";
  var presetMaker = initial.get("maker");
  if (presetMaker) {
    for (var k = 0; k < maker.options.length; k++) {
      if (maker.options[k].value === presetMaker) {
        maker.value = presetMaker;
        break;
      }
    }
  }

  q.addEventListener("input", apply);
  maker.addEventListener("change", apply);
  sort.addEventListener("change", apply);
  if (reset) {
    reset.addEventListener("click", function () {
      q.value = "";
      maker.value = "";
      apply();
      q.focus();
    });
  }

  apply();
})();
