/**
* A port of upstream's `contextual/samples/ContextualLayoutSample.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* `ContextualLayout` is a layout strategy for popups: given where its activator
* sits on screen, it decides which side of the activator the popup opens on and
* adds the class names (`above`/`below`/`left`/`right`/`high`/`low`/`corner`)
* that let the stylesheet point the popup's nub the right way. The sample is
* eight activators scattered into the corners, edges and middle of the viewport
* so you can watch the decision change: tap the top-left icon and the popup
* drops down-right with its nub up; tap the bottom-right one and it opens
* up-left.
*
* The popup kind that uses the layout is defined here, not in the library --
* upstream's point being that `ContextualLayout` is a strategy you bring your
* own popup and your own nub CSS to. It was a second global `enyo.kind` in the
* same file; it is a module-local constant now.
*
* @module layout/samples/ContextualLayoutSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';
import Popup from 'enyo/src/Popup/Popup.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableColumns from 'layout/src/FittableColumns.js';
import ContextualLayout from 'layout/src/ContextualLayout/ContextualLayout.js';

import IconButton from 'onyx/src/IconButton.js';
import MenuDecorator from 'onyx/src/MenuDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

/**
* An example of a popup that uses the `ContextualLayout` layout strategy.
*
* @class ContextualPopup
* @extends module:enyo/Popup~Popup
* @private
*/
var ContextualPopup = kind({
	name: 'sample.ContextualPopup',
	kind: Popup,
	layoutKind: ContextualLayout,
	classes: 'sample-contextual-popup',
	handlers: {
		onRequestShowMenu: 'requestShow'
	},
	floating: true,
	//layout parameters
	vertFlushMargin: 60, //vertical flush layout margin
	horizFlushMargin: 50, //horizontal flush layout margin
	widePopup: 200, //popups wider than this value are considered wide (for layout purposes)
	longPopup: 200, //popups longer than this value are considered long (for layout purposes)
	horizBuffer: 16, //do not allow horizontal flush popups past spec'd amount of buffer space on left/right screen edge

	/**
	* @private
	*/
	requestShow: function (inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		return true;
	},

	/**
	* @private
	*/
	getPageOffset: function (inNode) {
		// getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
		var r = inNode.getBoundingClientRect();

		var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
		var pageXOffset = (window.pageXOffset === undefined) ? document.documentElement.scrollLeft : window.pageXOffset;
		var rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
		var rWidth = (r.width === undefined) ? (r.right - r.left) : r.width;

		return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth};
	}
});

/**
* @class ContextualLayoutSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'layout.sample.ContextualLayoutSample',
	kind: FittableRows,
	classes: 'enyo enyo-fit',
	components: [
		{kind: Toolbar, name: 'topToolbar', classes: 'onyx-menu-toolbar', style: 'background-color:lightgray', components: [
			{kind: FittableColumns, style: 'width:100%;', components: [
				{kind: MenuDecorator, components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{kind: ContextualPopup,
						components: [
							{content: 'testing 1'},
							{content: 'testing 2'}
						]
					}
				]},
				{kind: MenuDecorator, fit: true, style: 'position:absolute;right:0;', components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{kind: ContextualPopup,
						components: [
							{content: 'testing 1'},
							{content: 'testing 2'},
							{content: 'testing 3'},
							{content: 'testing 4'},
							{content: 'testing 5'},
							{content: 'testing 6'}
						]
					}
				]}
			]}
		]},
		{kind: Scroller, fit: true, thumb: false, components: [
			{name: 'buttonContainer', kind: FittableRows, classes: 'onyx-contextualpopup-button-container enyo-fit', components: [
				//Top row of buttons
				{components: [
					{kind: MenuDecorator, style: 'display:inline-block', components: [
						{content: 'Average'},
						{kind: ContextualPopup,
							components: [
								{content: 'Item 1'},
								{content: 'Item 2'},
								{content: 'Item 3'},
								{content: 'Item 4'},
								{content: 'Item 5'}
							]
						}
					]},

					{kind: MenuDecorator, style: 'display:inline-block;float:right', components: [
						{content: 'Small'},
						{kind: ContextualPopup}
					]}
				]},
				//Center row of buttons
				{fit: true, style: 'padding-top:15%;padding-bottom:15%;', components: [
					{kind: MenuDecorator, style: 'display:inline-block;', components: [
						{content: 'Wide'},
						{kind: ContextualPopup,
							style: 'width:300px',
							components: [
								{kind: Scroller, style: 'min-width:150px;', horizontal: 'auto', touch: true, thumb: false, components: [
									{content: 'testing 1'},
									{content: 'testing 2'}
								]}
							]
						}
					]},
					{kind: MenuDecorator, style: 'display:inline-block;float:right', components: [
						{content: 'Long'},
						{kind: ContextualPopup,
							components: [
								{content: 'testing 1'},
								{content: 'testing 2'},
								{content: 'testing 3'},
								{content: 'testing 4'},
								{content: 'testing 5'},
								{content: 'testing 6'},
								{content: 'testing 7'},
								{content: 'testing 9'},
								{content: 'testing 10'},
								{content: 'testing 11'},
								{content: 'testing 12'},
								{content: 'testing 13'},
								{content: 'testing 14'},
								{content: 'testing 15'},
								{content: 'testing 16'},
								{content: 'testing 17'},
								{content: 'testing 18'},
								{content: 'testing 19'},
								{content: 'testing 20'},
								{content: 'testing 21'},
								{content: 'testing 22'},
								{content: 'testing 23'},
								{content: 'testing 24'},
								{content: 'testing 25'},
								{content: 'testing 26'},
								{content: 'testing 27'},
								{content: 'testing 28'},
								{content: 'testing 29'},
								{content: 'testing 30'}
							]
						}
					]}
				]},
				//Bottom row of buttons
				{components: [
					{kind: MenuDecorator, style: 'display:inline-block;', components: [
						{content: 'Press Me'},
						{kind: ContextualPopup,
							style: 'width:200px',
							components: [
								{content: 'testing 1'},
								{content: 'testing 2'},
								{content: 'testing 3'},
								{content: 'testing 4'},
								{content: 'testing 5'},
								{content: 'testing 6'},
								{content: 'testing 7'},
								{content: 'testing 9'},
								{content: 'testing 10'}
							]
						}
					]},
					{kind: MenuDecorator, style: 'display:inline-block;float:right', components: [
						{content: 'Try Me'},
						{kind: ContextualPopup,
							style: 'width:250px',
							components: [
								{content: 'Item 1'},
								{content: 'Item 2'},
								{content: 'Item 3'},
								{content: 'Item 4'},
								{content: 'Item 5'}
							]
						}
					]}
				]}
			]}
		]},
		{kind: Toolbar, name: 'bottomToolbar', classes: 'onyx-menu-toolbar', style: 'background-color:lightgray', components: [
			{kind: FittableColumns, style: 'width:100%;', components: [
				{kind: MenuDecorator, components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{kind: ContextualPopup,
						components: [
							{content: 'testing 1'},
							{content: 'testing 2'},
							{content: 'testing 3'},
							{content: 'testing 4'},
							{content: 'testing 5'},
							{content: 'testing 6'}
						]
					}
				]},
				{kind: MenuDecorator, fit: true, style: 'position:absolute;right:0;', components: [
					{kind: IconButton, src: 'assets/menu-icon-bookmark.png'},
					{kind: ContextualPopup, name: 'facebook',
						components: [
							{content: 'testing 1'},
							{content: 'testing 2'},
							{content: 'testing 3'},
							{content: 'testing 4'},
							{content: 'testing 5'},
							{content: 'testing 6'}
						]
					}
				]}
			]}
		]}
	]
});
