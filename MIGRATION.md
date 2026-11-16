# Layout 2.7.0 — CommonJS to native ES modules

This branch (`esm`, cut from `master`, which is 2.7.0) converts `src/` and
`index.js` from CommonJS to native ES modules, so the library loads in a browser
from `<script type="module">` with no bundler and no build step.

It is the third of three: `drahgon55/enyo` branch `esm` is the framework,
`drahgon55/onyx` branch `esm` is the widget set, and this is the layout library
the widget set needs. Read enyo's `MIGRATION.md` for the recipe and onyx's for
the cross-package conventions; neither is repeated here.

Nothing outside `src/` and `index.js` is touched: `gulpfile.js`, `bower.json`,
`docs/` and the `.css` sources are unchanged.

```
33 files changed, 190 insertions(+), 236 deletions(-)
```

To see it work, serve the directory that holds the checkouts:

```bash
python3 test-layout/serve.py 8000 /path/containing/enyo/and/layout
```

then <http://localhost:8000/layout/test-layout/index.html>. The title reads
`ALL PASS` or `FAIL (n)`.

**Use `serve.py`, not `python3 -m http.server`, whenever you are verifying.**
`http.server` sends no cache headers, and a query string on the page URL does
not bust ES module URLs, so a reload can silently re-run the *old* code and
report a pass for a change that is not on disk. `serve.py` sends `no-store` and
refuses conditional requests.

## What the conversion covers

- All 112 top-level `require()` calls in `src/` and `index.js` are now `import`
  declarations, plus the 20 specifiers inside JSDoc code samples.
- Every `module.exports` assignment is now an `export`.
- Afterwards no `require(` or `module.exports` remains anywhere under `src/` or
  in `index.js`.

## This was the easy one

Layout had none of the three things that made the other two awkward.

**No package side effect to preserve.** `index.js` is a plain version object
with no side effects, and nothing in `src/` requires the package root. There is
no equivalent of onyx's `require('onyx')`, which had to become
`import '../index.js'` because it applies the body class every stylesheet keys
off.

**No `.less`.** Layout ships plain `.css`, already compiled. `css/layout.css` is
the ten per-module stylesheets concatenated, and `tools/build-css.js` regenerates
it with no dependency at all — unlike onyx, which needs `lessc`. A page links it
after enyo's:

```html
<link rel="stylesheet" href="/enyo/css/enyo.css">
<link rel="stylesheet" href="/layout/css/layout.css">
```

**No strict-mode hazards.** No free `global`, no `arguments.callee` or
`Function.prototype.caller`, no `this.inherited(arguments)`, no `with`, no
top-level `this`, and every loop variable is declared — several `for` loops
assign to variables declared earlier in the function, which is fine, but worth
checking rather than assuming, since an implicit global is a `ReferenceError`
under ESM.

## Specifiers

Two kinds, resolved the way onyx's were:

| Was | Now | Why |
| --- | --- | --- |
| `require('./Arranger')` | `import Arranger from './Arranger/Arranger.js'` | ESM has no directory resolution; the file `package.json` `main` named is named outright. |
| `require('layout/Slideable')` | `import Slideable from './Slideable.js'` | Self-referential package specifiers are in-package, so a relative path is exact. |
| `require('enyo/kind')` (40) | `import kind from 'enyo/src/kind.js'` | Cross-package. No relative path is correct without hardcoding where the enyo checkout sits, so these stay bare and a page supplies an import map. |

All 17 distinct enyo modules were resolved against the converted enyo tree and
verified to exist. A page needs:

```html
<script type="importmap">
{ "imports": { "enyo/": "/enyo/", "onyx/": "/onyx/", "layout/": "/layout/" } }
</script>
```

`layout/` is in the map because that is the form the JSDoc examples use; `src/`
itself needs only `enyo/`.

### Layout does not depend on onyx

Worth stating, because the specifier list suggests otherwise. Three
`require('onyx/...')` calls appear in `src/`, and all three are inside JSDoc
code samples — there is no executable dependency, and therefore no cross-package
cycle between onyx and layout. onyx depends on layout; layout does not depend
on onyx.

Two pre-existing doc errors were corrected there, both naming the wrong package:

- `ContextualLayout`'s sample imported `onyx/ContextualPopupDecorator`, which
  does not exist in onyx 2.7. onyx's own `ContextualPopup` documents
  `MenuDecorator` as its decorator, so the sample now uses that.
- The same comment said `ContextualPopup`'s `layoutKind` is
  `onyx/ContextualLayout`. It is `layout/ContextualLayout` — in this package.

## Circular dependencies: there are none

33 nodes, 26 edges, acyclic. Established before any code was changed, by Tarjan
and an independent DFS back-edge check, and confirmed afterwards over the
converted ESM source by `test-layout/check-cycles.mjs`:

```
33 modules, 26 static imports
no circular imports
```

The arrangers looked like the risk — there are nine of them and they all relate
to `Arranger` — but the relation is one-way: every arranger imports `Arranger`
and none imports another. The only module importing a specific arranger is
`Panels`, which imports `CardArranger` as its default.

**Trust the static check, not the browser, for cycles.** Whether a cycle throws
depends on which module you enter the graph from.

## Export shapes

Simpler than enyo, close to onyx:

1. **Single value** (26 files). `module.exports = kind({...})` became
   `export default kind({...})` in place.
2. **Locally bound** (5 files: `easing`, `FlyweightRepeater`, `Panels`,
   `Arranger`, `Node`). `var X = module.exports = ...` keeps the local binding
   and gets `export default X;` appended.
3. **A value with kinds hung off it** (2 files, converted by hand).
   `FittableLayout` exports its kind plus `.Columns` and `.Rows`;
   `PulldownList` exports its kind plus `.Puller`. Both keep the property form,
   because that is the surface consumers use — **onyx reads
   `FittableLayout.Columns` and `.Rows` directly**, so dropping them would break
   `MoreToolbar`, `TabBar` and `TabPanels` without any import failing.

`index.js` keeps its default object and gains a named `version` export, matching
enyo and onyx.

## What this unblocks in onyx

Five onyx modules were converted but unloadable, because they import this
package:

| onyx module | needs |
| --- | --- |
| `src/TabPanels.js` | `layout/FittableLayout`, `layout/Panels` |
| `src/TabBar/TabBar.js` | `layout/FittableColumns` |
| `src/MoreToolbar/MoreToolbar.js` | `layout/FittableLayout` |
| `src/FlyweightPicker.js` | `layout/FlyweightRepeater` |
| `src/DatePicker/DatePicker.js` | via `FlyweightPicker` |

Those four specifiers in onyx are now rewritten to the files they name
(`layout/src/Panels/Panels.js` and so on), and onyx's harness renders
`TabPanels`, `MoreToolbar` and `DatePicker` for real, switching panels through
`layout/Panels`. onyx is now 42 of 44 modules loadable; only the two under
`src/i18n/` remain, blocked on `enyo-ilib`.

## Verification

Static:

- All 33 files parse as ES modules (`node --check` on each, renamed `.mjs`).
- All 112 import specifiers resolve to a file that exists.
- No `require(` or `module.exports` anywhere in `src/` or `index.js`.
- No cycles (Tarjan plus an independent DFS back-edge check).

In a browser (Chrome, served by `test-layout/serve.py`, console clean):

- `test-layout/index.html` — **22 checks, all passing.** Layout is measured,
  not merely asserted: `FittableRows` and `FittableColumns` are checked by
  confirming the `fit` child actually absorbs the leftover pixels
  (37 + 83 + 100 = 220, and a fixed 110px column leaving 308 of 420). `Panels`
  is driven through `next()`, `previous()` and `setIndex()` with its transition
  events counted, the active panel checked against the inactive ones, and the
  `arrangerKind` swapped to `CarouselArranger` mid-flight. `FlyweightRepeater`
  is checked to call `onSetupItem` once per row and render all four.
  `FittableLayout.Columns` and `.Rows` get their own checks, since hanging them
  off the default export was a hand conversion.
- `test-layout/all-modules.html` — 32/32 modules load **cold**, each in its own
  document, so a cycle cannot be masked by a warm module registry.

### The checks were shown to fail

A check that has never gone red has not been shown to test anything:

| Break | Result |
| --- | --- |
| Drop `FittableLayout.Columns` | `FAIL (2)` — the export check *and* the column measurement |
| `Arranger` ↔ `CardArranger` cycle | `check-cycles.mjs` exits 1; all-modules `FAIL (12)` |
| Empty `css/layout.css` | `FAIL (3)` — positioning and both fittable measurements |
| Remove `Panels`' `export default` | `FAIL (load)` — the watchdog names the module and the missing export |
| Drop `FittableLayout.Columns`, checked from **onyx** | onyx `FAIL (1)` — MoreToolbar's layout |

The first and third each took down a behavioural check as well as the obvious
one, which is the point: a structural assertion alone is a weaker signal than a
measurement that depends on the thing working.

The last one matters most here. A break in this package surfaces in onyx's
harness, so the two are genuinely wired together rather than merely both green.

### Two lessons carried over from onyx

**Ask of every check: what here is already guaranteed by the page running at
all?** Three checks in onyx's harness turned out unfalsifiable — an assertion
whose outcome the test setup itself supplied. Part of why they survived review
is that each one *passed*, and a passing check gets read less carefully than a
failing one.

**Assert the observed effect, not the absence of an exception.** A silently
skipped step raises nothing; only comparing an expected value catches it.

One assertion here was corrected for exactly that reason. `TabPanels` was
initially asserted to "start on panel 0"; it starts on the *last* panel, because
each tab activates as it is added and the last one wins. That is enyo `Group`
behaviour and predates this conversion, so the check now asserts the invariant
that actually matters — that the panel index and the `TabBar` selection agree —
rather than a default that happened to be wrong.

## Still outstanding

**`enyo-ilib` is not converted**, so onyx's two `src/i18n/` modules remain
unloadable. That is the last gap across the three packages.

**`.jshintrc` and the gulp lint task are stale**, as in enyo and onyx: jshint
cannot parse `import`/`export`.

**`package.json` has no `"type": "module"`**, deliberately, for the same reason
as the other two.
