# layout samples

Ports of upstream's own samples to ES modules.

Enyo 2.7 deleted the per-library `samples/` folders on the way out of 2.6, so
these come from `enyojs/layout` at tag `2.5.1-release`, where layout still
carried them under per-feature directories (`panels/samples/`, `list/samples/`
and so on). 2.7 flattened the library into `src/`, so there is no `panels/`
any more and the ports live here instead, next to the repo root — which is
where `enyojs/enyo` and `enyojs/onyx` kept theirs.

| Sample | Upstream path at `2.5.1-release` |
| --- | --- |
| `PanelsSample` | `panels/samples/PanelsSample.{js,css,html}` |

## Running them

No bundler and no build step. The bare `enyo/...` and `onyx/...` specifiers are
resolved by an import map in each sample's `.html`, and that map wants the
`enyo`, `layout` and `onyx` checkouts side by side under one origin. So serve
their common parent, not this checkout:

```bash
python3 test-layout/serve.py 8000 ~/Documents/ChatGPT
```

then open <http://localhost:8000/layout/samples/PanelsSample.html>.

`serve.py` (see its header) exists for exactly this: a plain
`python3 -m http.server` lets the browser cache ES modules, and a query string
on the page URL does not bust them, so a reload can silently re-run stale code.

## What the port changed

The 2.5 originals are global-style enyo: `enyo.kind({...})`, with every kind
referred to by string name (`kind: "onyx.Button"`, `arrangerKind:
"GridArranger"`). There is no global registry for those strings to resolve
against here, so each one became an `import` and a direct constructor
reference. That is the bulk of the diff. Event handler names stay strings
(`ontap: 'nextPanel'`) — those are looked up on the owner at dispatch time and
still work unchanged.

Three further changes in `PanelsSample`, each noted in a comment where it sits:

- **`this.setIndex(1)` → `sp.setIndex(1)`.** On a narrow screen the original
  called `setIndex` on the sample itself, which is a `FittableRows` and has no
  such method; it threw. The index belongs to the panels.
- **The picker carries its arranger entry.** The original recovered which
  arranger had been picked from `event.originator.indexInContainer() - 1`, an
  offset that depends on how much chrome `onyx.Menu` puts in front of its
  items. Each menu item now carries its entry directly.
- **`colHeight`/`colWidth` on the `GridArranger` subkind are numbers**, not the
  strings `'150'`. `GridArranger` documents them as Number and does arithmetic
  with them.

The go-to-index box also coerces its value and ignores an empty box, which
otherwise reached `setIndex` as `NaN`.

## What was verified, and one thing to know

Checked in a browser against this repo's `esm` branch, with the `esm` branches
of `drahgon55/enyo` and `drahgon55/onyx` alongside: the page loads with no
console errors, and every one of the nine arrangers in the picker — Card,
CardSlideIn, Carousel, Collapsing, LeftRight, TopBottom, Spiral, Grid,
DockRight — measurably rearranges the panels. Previous, Next, the go-to-index
box (both the Go button and Return), Add and Delete all work, as does dragging
between panels. Nothing had to be worked around: no arranger is broken under
2.7.

One hazard, which is in **enyo**, not here, and worth knowing before you blame
a sample: `Control.renderInto()` calls `dom.updateScaleFactor()` as its last
step, which sets `dom._bodyScaleFactorX/Y` from the body's measured size over
the window size. `gesture/util.makeEvent()` then multiplies every `down`/
`move`/`up` event's `clientX/Y` by those factors. On one cold first load — the
very first page open in a fresh browser, with the whole module graph and the
stylesheets being fetched at once — the body measured 0 and both factors stuck
at 0, so every pointer coordinate became 0, `gesture.drag` never saw any
movement, and **dragging between panels silently did nothing** for the life of
the page. Nothing recomputes the factors afterwards; only `renderInto` ever
calls `updateScaleFactor`. It did not recur on any reload or in a fresh tab,
so it is a race rather than a certainty. If you hit it, `dom.updateScaleFactor()`
from the console restores dragging immediately — which is also how to confirm
that is what you are looking at. This is not specific to the sample: anything
that renders into `document.body` and relies on drag is exposed, Treegos
included.
