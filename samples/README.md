# layout samples

Upstream's own samples, ported to ES modules.

Enyo 2.7 deleted the per-library `samples/` folders on the way out of 2.6, so
these come from `enyojs/layout` at tag `2.5.1-release`, the last tag that still
had them. All 23 are here, along with upstream's stylesheets and its `assets/`.

Upstream kept them under per-feature directories — `panels/samples/`,
`list/samples/`, `imageview/samples/` and so on. 2.7 flattened the library into
`src/`, so there is no `panels/` any more and the ports all live here, next to
the repo root, which is where `enyojs/enyo` and `enyojs/onyx` kept theirs.

## Running them

```bash
python3 ../layout/test-layout/serve.py 8000 ~/Documents/ChatGPT
```

then open <http://localhost:8000/layout/samples/index.html>.

The second argument is the directory that *holds* the checkouts, not a
checkout: the pages resolve bare specifiers through an import map, so `enyo`,
`layout` and `onyx` all have to sit side by side under the served root. (Unlike
onyx's samples, none of these needs `enyo-ilib`.)

`serve.py` exists for exactly this. Use it rather than `python3 -m
http.server`: the latter lets the browser cache ES modules, so a reload can
silently re-run stale code.

## How this is laid out, and why it differs from upstream

Upstream gave each sample its own `.html`, which in 2015 cost three or four
`<script>` tags per page. Without a loader each page needs an import map and
about nine stylesheet links, and 23 copies of that is 23 files to edit every
time a path moves. So instead:

| file | what it is |
| --- | --- |
| `index.html` | the menu: every sample, with a line on what it shows |
| `sample.html` | the host page: `sample.html?s=ListBasicSample` renders any one |
| `samples.js` | the manifest both pages read |
| `<Name>Sample.js` | the ported sample, one module each |
| `<Name>Sample.css`, `assets/` | upstream's, unchanged |
| `NameGenerator.js` | upstream's random-name helper, now a module |
| `FlickrFallback.js` | ours; see "The three Flickr samples" below |

Adding a sample is one `.js` file and one line in `samples.js`.

Layout's samples each carried their own stylesheet rather than sharing one, so
`sample.html` links the sheet per sample, named from the manifest: `<name>.css`
by default, another sample's sheet where upstream shared one (the three plain
list samples all linked `ListBasicSample.css`), or none at all for the three
whose upstream `.css` was an empty file. The link is added and awaited *before*
the sample renders — every List and Fittable here measures itself on first
render, and they measure the wrong thing if the stylesheet lands afterwards.

`sample.html` renders the sample into a bare `<body>` with no chrome of its
own, exactly as upstream's pages did, so nothing here can shift a sample's
layout — most of them are `enyo-fit` and own the whole viewport. Use the
browser's Back button to get back to the index. `?s=` is checked against the
manifest rather than being interpolated straight into the import.

`PanelsSample.html` is still here and still works: it is upstream's own
one-sample page, kept because its URL has already been handed out. It is the
only sample with a page of its own.

### Where each one came from

| Sample | Upstream path at `2.5.1-release` |
| --- | --- |
| `PanelsSample` | `panels/samples/PanelsSample.{js,css,html}` |
| `PanelsSlidingSample` | `panels/samples/PanelsSlidingSample.{js,css,html}` |
| `PanelsFlickrSample` | `panels/samples/PanelsFlickrSample.{js,css,html}` |
| `FittableSample` | `fittable/samples/FittableSample.{js,html}` + `fittable/samples/sample.css` |
| `ListBasicSample` | `list/samples/ListBasicSample.{js,css,html}` |
| `ListNoSelectSample` | `list/samples/ListNoSelectSample.{js,html}` |
| `ListOnyxItemSample` | `list/samples/ListOnyxItemSample.{js,html}` |
| `ListContactsSample` | `list/samples/ListContactsSample.{js,css,html}` |
| `ListAroundSample` | `list/samples/ListAroundSample.{js,css,html}` |
| `ListLanguagesSample` | `list/samples/ListLanguagesSample.{js,css,html}` |
| `ListHorizontalFlickrSample` | `list/samples/ListHorizontalFlickrSample.{js,css,html}` |
| `ListPulldownSample` | `list/samples/ListPulldownSample.{js,css,html}` |
| `PersistentSwipeableItemSample` | `list/samples/PersistentSwipeableItemSample.{js,css,html}` |
| `FlyweightRepeaterSample` | `list/samples/FlyweightRepeaterSample.{js,css,html}` |
| `NameGenerator` | `list/samples/NameGenerator.js` |
| `ImageViewSample` | `imageview/samples/ImageViewSample.{js,html}` |
| `ImageCarouselSample` | `imageview/samples/ImageCarouselSample.{js,css,html}` |
| `PanZoomViewSample` | `imageview/samples/PanZoomViewSample.{js,css,html}` |
| `PanZoomViewSample2` | `imageview/samples/PanZoomViewSample2.{js,html}` |
| `PanZoomViewSample3` | `imageview/samples/PanZoomViewSample3.{js,html}` |
| `SlideableSample` | `slideable/samples/SlideableSample.{js,css,html}` |
| `TreeSample` | `tree/samples/TreeSample.{js,html}` |
| `ContextualLayoutSample` | `contextual/samples/ContextualLayoutSample.{js,html}` + `contextual/samples/sample.css` |
| `EasingSample` | `easing/samples/EasingSample.{js,css,html}` |

Assets from all five upstream `assets/` directories are merged into one
`samples/assets/`. The two files that appeared in more than one of them
(`spinner.gif`, `search-input-search.png`) were byte-identical.

**Not ported:** `fittable/samples/FittableAppLayout{1,2,3,4}.js`,
`FittableDescription.js` and `FittableTests.js`. They sit in the same folder
but are not samples — they are a documentation page and a manual test
harness, and none of them is a `*Sample`. They are still in upstream's history
if they turn out to be wanted.

## What the port changed

The 2.5 originals are global-style enyo: `enyo.kind({...})` with every kind
named by string (`kind: 'onyx.Button'`, `arrangerKind: 'CollapsingArranger'`,
`layoutKind: 'FittableColumnsLayout'`). Nothing resolves those strings here, so
each became an import and a direct constructor reference. That is the bulk of
the diff, and it is mechanical. Handler names stay strings (`ontap: 'nextPanel'`)
— those are looked up on the owner at dispatch time and still work unchanged.
`enyo.foo` helpers became their modules: `enyo.cap`/`irand`/`keys`/`clone` →
`enyo/src/utils.js`, `enyo.job` → `enyo/src/job.js`, `enyo.JsonpRequest` →
`enyo/src/Jsonp.js`, `enyo.easing` → `layout/src/easing.js`.

Beyond that, each sample's own file carries a comment where anything changed.
The ones worth knowing about:

### Bugs in the samples, fixed

- **`SlideableSample` found no Slideables.** Its `create()` walks `this.$`
  collecting controls with `this.$[c].kind === 'Slideable'`. `kind` holds the
  constructor now, not a name, so that test can never pass: `populate()` ran
  over an empty array and the four panels came up blank, with no error. It
  tests `kindName === 'enyo.Slideable'` instead. Kept as an exact-name test
  rather than an `instanceof`, so it still means "the four plain Slideables"
  and not "anything deriving from Slideable".

- **`PanZoomViewSample3`'s `ImagesView` had no base kind.** Declared with
  `enyo.kind({...})` and no `kind:` property, which makes enyo fall back to
  `kind.getDefaultCtor()` — a value only set once `enyo/src/Control/Control.js`
  has been *evaluated*. Reach that kind before anything has pulled Control in
  and it is silently built on an empty prototype: no error, nothing in the DOM.
  It declares `kind: Control`. (Same shape as the two onyx kinds the onyx port
  hit.)

- **`PanZoomViewSample.handleResize` used a bare `this.inherited(arguments)`.**
  Wrapped in `kind.inherit` now, which is the documented 2.7 form and does not
  depend on reaching `arguments.callee` — forbidden in a module.

- **`ListContactsSample`'s remove button never went away.** `ContactItem.setSelected`
  applied `display: 'gne'` when deselecting — a typo. The browser drops an
  unparseable value, so the `inline-block` from the last selection survived and
  deselected rows kept showing their remove button. `none`, which is what the
  stylesheet's own rule says.

- **`ListPulldownSample` threw on load.** `processSearchResults` read
  `inResponse.photos.photo` straight out; against today's Flickr (see below)
  `photos` is `undefined`, so the request fired from `rendered()` ended in a
  TypeError. It is guarded.

- **`PanelsFlickrSample`'s photo list would not scroll, and
  `ListHorizontalFlickrSample` was a one-thumbnail-high strip.** Both put a
  `FittableRowsLayout` block with a `fit: true` List inside it somewhere with no
  height — in the Panels case an arranger panel, which arrangers position
  absolutely but never give a height to. The List therefore stayed at its
  1,000,000px unmeasured placeholder and had nothing to scroll. Both blocks get
  `classes: 'enyo-fit'`, which is exactly what upstream put on
  `PanelsFlickrSample`'s *other* panel for the same reason.

- **`EasingSample` threw at the end of every animation.** `animatorComplete`
  re-enabled `this.$.btnAnimate`, a control this sample has never had — there
  is no Animate button, only the menu. Dropped.

- **`PanZoomViewSample3`'s "change image" reached the wrong `$`.** Upstream's
  `this.$.panZoomView.$.imagesView` is right — PanZoomView re-owns the
  components declared inside it — and that is what it does. Both names in the
  path came from enyo auto-naming a component after its kind, so both are
  declared explicitly here and the lookup no longer depends on
  `enyo.PanZoomView` and `ImagesView` keeping those kind names. Several other
  samples relied on the same auto-naming for `this.$.list` and
  `this.$.panels`; those are named explicitly too.

### Changes that are not bug fixes

- **`ListAroundSample` has a `setup` button it did not have.** The sample
  carries a popup with a row count, a `rowsPerPage` box and a hide-divider
  checkbox, and upstream left nothing on the page that could open it — so
  `populateList` only ever ran once, from `rendered`, with the defaults. Its
  sibling `ListContactsSample` has exactly this button for exactly this popup,
  so the sample looks like it lost one.

- **`ListHorizontalFlickrSample` lost two dead members.** `ontap: 'itemTap'` on
  its rows pointed at a method this sample does not define (an unresolved
  handler name just bubbles on, so it was inert), and `showList` called
  `this.setIndex(0)`, a Panels method on a Control. Both are leftovers from
  `PanelsFlickrSample`, which it was copied from.

- **Flickr thumbnail URLs are `https://farm…`, not `http://`**, so they are not
  blocked as mixed content on an https page.

- **Dead code left dead**, with a comment saying so: `ListAroundSample.addItem`
  (reads a `newContactInput` this sample has no box for) and
  `ContactItem.renderImportance` (writes to an `importance` control that was
  never in the components block). Nothing calls either.

## The three Flickr samples

`PanelsFlickrSample`, `ListHorizontalFlickrSample` and `ListPulldownSample`
fetched their rows from `flickr.photos.search`, using the API key upstream
committed in 2015. That key is gone — every request now answers

```
{"stat":"fail","code":100,"message":"Invalid API Key (Key not found)"}
```

so `response.photos` is `undefined`, the samples set their list count to 0, and
all three render their chrome over an empty list with nothing to say why.

Each keeps its original request exactly as it was, and falls back to
`FlickrFallback.js` — records shaped like Flickr's, built from the planet
images already in `assets/` — when the request comes back with no photos. So
the lists fill, paging works, pull-to-refresh visibly changes the rows, and the
widget each sample exists to demonstrate can actually be used. Rows are
labelled `No Flickr key — …` so nobody mistakes them for live data. Put a
working key back in the sample and the real path takes over again: the fallback
only fires on an empty result.

Each also gained an `.error()` handler on its request, so a request that cannot
load at all does not leave the sample's spinner up or the list stuck
refreshing.

## Nothing needed fixing in `src/`

Unlike the onyx port, this one turned up no bugs in the library itself. Every
problem was in a sample. `layout/src/` is untouched by this work.

## Verified

All 23 samples and `index.html` were loaded one at a time in a fresh browser
tab with the cumulative console open: **no console output of any kind**, not
one warning or failed request, across the whole set. Each one was then
exercised by hand, not just looked at:

| Sample | What was exercised |
| --- | --- |
| `PanelsSample` | picker switches the arranger (checked Spiral), Add appends and jumps to the new panel |
| `PanelsSlidingSample` | dragged the body panel across both collapse steps and back, scrolled a half-covered column list, toggled Realtime and dragged again |
| `PanelsFlickrSample` | tapped thumbnails to swap the picture, scrolled the list, **more photos** paged 40 → 80; at 375px it goes narrow, a tap slides to the picture and **Back** slides home |
| `FittableSample` | resized the window from 1024 to 420 wide: the header title keeps fitting between the buttons, the `Fits!` box keeps taking the slack, the bottom row stays centered |
| `ListBasicSample` | scrolled to row 200+, tapped to select, scrolled away and back — selection survives |
| `ListNoSelectSample` | tapped rows (nothing selects, as intended), scrolled |
| `ListOnyxItemSample` | scrolled; the alternating onyx-highlight rows render through paging |
| `ListContactsSample` | selected and deselected (remove button appears and *goes away*), removed a row, **new contact** inserted in sort order and scrolled to it, filtered to 1 of 4050 and back, **setup** popup both sliders and the checkbox, **populate list** at 4050 rows / 250 per page / dividers hidden, **remove selected** took 2 |
| `ListAroundSample` | the toolbar scrolls with the rows (the whole point), **setup** → 500 rows with dividers hidden, selected and removed a contact, filtered to 4 |
| `ListLanguagesSample` | swiped a row (Italian → English, data updated), press-held and dragged a row to reorder (backing array reordered), **Repopulate** at 25 rows |
| `ListHorizontalFlickrSample` | scrolled sideways through 40 thumbnails, **more** paged to 80, selection highlight |
| `ListPulldownSample` | pulled past the top → "Loading..." → list replaced a second later; **search** refetched and reset to the top |
| `PersistentSwipeableItemSample` | swiped right-to-left (red, persists) and left-to-right on another row (green, springs back, and the first closed) |
| `FlyweightRepeaterSample` | tapped a name, the row turned blue and the bar read it back |
| `ImageViewSample` | double-tapped to zoom to 2.25, panned; the pins stay anchored to their points on the image |
| `ImageCarouselSample` | next twice (lazily loading earth.jpg), previous, typed an index, the box follows the carousel |
| `PanZoomViewSample` | all seven scale buttons, dragged to pan |
| `PanZoomViewSample2` | opened at scale-to-width, double-tapped to 1.5, panned to the far edge, scroll thumb shows |
| `PanZoomViewSample3` | **change image** twice: 2560×1024 → 2048×768 → 2180×900, and the view re-fits to each |
| `SlideableSample` | dragged all four to their limits (−90, 90, 90, −90), overdragged one past `max` and watched it settle back, readouts update live from `onChange` |
| `TreeSample` | collapsed and expanded the root, expanded Charlie (icon swaps to the open folder), selection moves between nodes |
| `ContextualLayoutSample` | top-left activator opens down-right with the nub up, bottom-right opens up-left with the nub down, right-edge opens to the left with the nub pointing right |
| `EasingSample` | scrolled the popup menu through all 35 functions, picked one, the button relabels and the ball drops with that curve |

`PanelsSample.html`, the standalone page, was loaded separately and still
works.

### One thing to know, and it is in enyo

Not a fault in any sample. `Control.renderInto()` calls
`dom.updateScaleFactor()` as its last step, which sets
`dom._bodyScaleFactorX/Y` from the body's measured size over the window size.
`gesture/util.makeEvent()` then multiplies every `down`/`move`/`up` event's
`clientX/Y` by those factors. On one cold first load — the very first page open
in a fresh browser, with the whole module graph and the stylesheets being
fetched at once — the body measured 0 and both factors stuck at 0, so every
pointer coordinate became 0 and **all dragging silently stopped working** for
the life of the page. Nothing recomputes the factors afterwards; only
`renderInto` ever calls `updateScaleFactor`. It is a race rather than a
certainty and it did not recur on any reload during this work.

Half the samples here are dragging samples, so if one of them seems dead to the
mouse, check this before blaming the sample: `dom.updateScaleFactor()` from the
console both confirms it and fixes it. There is a full write-up in the shared
side-session notes.

Chrome also logs `Unable to preventDefault inside passive event listener` while
you drag or wheel-scroll in several of these. That is enyo's own scroll and
gesture handling (and, in `PanZoomViewSample3`, upstream's deliberate
`preventDefault` in `ondown` to stop Firefox dragging the image). It is
library-wide, nothing misbehaves because of it, and it never appears on load —
only once you start interacting.
