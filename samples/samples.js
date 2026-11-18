/**
* The list of samples, shared by `index.html` (which renders it as the menu)
* and `sample.html` (which uses it to validate `?s=` before importing, and to
* find the sample's stylesheet).
*
* Keeping it in one module is the reason a sample can be added by dropping in
* one `.js` file and one line here, instead of hand-writing another page.
*
* `css` names the stylesheet `sample.html` should link, when it is not
* `<name>.css`: `false` for the two samples that need none, or another
* sample's sheet where upstream shared one.
*
* @module layout/samples/samples
*/

export default [
	// panels
	{name: 'PanelsSample', label: 'Panels', blurb: 'All nine arrangers on the same seven panels, switched from a picker.'},
	{name: 'PanelsSlidingSample', label: 'Panels Sliding', blurb: 'CollapsingArranger over two 1000-row lists and a fitting body panel.'},
	{name: 'PanelsFlickrSample', label: 'Panels Flickr', blurb: 'A responsive master/detail app: list and picture, collapsing on a narrow screen.'},

	// fittable
	{name: 'FittableSample', label: 'Fittable', blurb: 'FittableRows and FittableColumns nested, plus FittableHeaderLayout.'},

	// list
	{name: 'ListBasicSample', label: 'List Basic', blurb: '20,000 rows through two pages of DOM, with selection.'},
	{name: 'ListNoSelectSample', label: 'List No Select', blurb: 'The same list with noSelect, so rows do not respond to a tap.', css: 'ListBasicSample.css'},
	{name: 'ListOnyxItemSample', label: 'List Onyx Item', blurb: 'Flyweight rows built from onyx.Item, with tapHighlight.', css: 'ListBasicSample.css'},
	{name: 'ListContactsSample', label: 'List Contacts', blurb: 'Dividers, multi-select, add, remove, filter, and a setup popup.'},
	{name: 'ListAroundSample', label: 'List Around', blurb: 'AroundList: a toolbar inside the list scroller, so it scrolls with the rows.'},
	{name: 'ListLanguagesSample', label: 'List Languages', blurb: 'Drag rows to reorder them; swipe a row to change its language.'},
	{name: 'ListHorizontalFlickrSample', label: 'List Horizontal', blurb: 'List with orient: h — the same machinery scrolling sideways, paged by a more button.'},
	{name: 'ListPulldownSample', label: 'List Pulldown', blurb: 'PulldownList: drag past the top and release to refresh.'},
	{name: 'PersistentSwipeableItemSample', label: 'Persistent Swipeable', blurb: 'A swipeable panel that stays open one way and springs back the other.'},
	{name: 'FlyweightRepeaterSample', label: 'Flyweight Repeater', blurb: 'The machinery under List, on its own: one row control rendered 26 times.'},

	// imageview
	{name: 'ImageViewSample', label: 'Image View', blurb: 'Pan and zoom one image, with four pins anchored to points in it.', css: false},
	{name: 'ImageCarouselSample', label: 'Image Carousel', blurb: 'Eight planets, each pan-and-zoomable, loaded only as you reach them.'},
	{name: 'PanZoomViewSample', label: 'Pan Zoom View', blurb: 'Pan and zoom arbitrary content, with buttons for every scale mode.'},
	{name: 'PanZoomViewSample2', label: 'Pan Zoom Text', blurb: 'The same over text twice the width of its view, with a scroll thumb.', css: false},
	{name: 'PanZoomViewSample3', label: 'Pan Zoom Sized', blurb: 'Content that measures itself as it loads and makes the view re-fit.', css: false},

	// the rest
	{name: 'SlideableSample', label: 'Slideable', blurb: 'Four drag-and-settle panels, one per edge, each reading out its own value.'},
	{name: 'TreeSample', label: 'Tree', blurb: 'Nested Nodes you expand, collapse and select.', css: false},
	{name: 'ContextualLayoutSample', label: 'Contextual Layout', blurb: 'Popups that pick their own side of the activator, and point a nub at it.'},
	{name: 'EasingSample', label: 'Easing', blurb: 'Every easing function layout adds to enyo, run on a falling ball.'}
];
