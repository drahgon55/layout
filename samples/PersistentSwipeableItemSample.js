/**
* A port of upstream's `list/samples/PersistentSwipeableItemSample.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* Three rows, and the point is `List`'s swipeable layer. Swipe a row and the
* `swipeableComponents` block slides in over it; `onSetupSwipeItem` looks at
* `xDirection` and decides what it says and what colour it is. Swipe
* right-to-left and it sets `persistSwipeableItem`, so the panel stays open
* until you dismiss it; swipe left-to-right and it springs back on release.
*
* @module layout/samples/PersistentSwipeableItemSample
*/

import kind from 'enyo/src/kind.js';

import FittableRows from 'layout/src/FittableRows.js';
import List from 'layout/src/List/List.js';

/**
* @class PersistentSwipeableItemSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.PersistentSwipeableItemSample',
	kind: FittableRows,
	classes: 'list-sample-persistent-swipeable-item enyo-fit',

	/**
	* @private
	*/
	data: ['Cat', 'Dog', 'Hippopotamus'],

	components: [
		{
			// Named. Upstream relied on enyo auto-naming it `list` from
			// `enyo.List`, which is what every `this.$.list` below wants.
			name: 'list',
			kind: List,
			classes: 'list-sample-persistent-swipeable-item-list enyo-unselectable',
			fit: true,
			multiSelect: true,
			reorderable: false,
			enableSwipe: true,
			centerReorderContainer: false,
			onSetupItem: 'setupItem',
			onSetupSwipeItem: 'setupSwipeItem',
			onSwipeComplete: 'swipeComplete',
			components: [
				{name: 'item', classes: 'list-sample-persistent-swipeable-item-item', components: [
					{name: 'text', classes: 'itemLabel', allowHtml: true}
				]}
			],
			swipeableComponents: [
				{name: 'swipeItem', classes: 'enyo-fit swipeGreen', components: [
					{name: 'swipeTitle', classes: 'swipeTitle', content: 'This is a test'}
				]}
			]
		}
	],

	/**
	* @method
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.populateList();
		};
	}),

	/**
	* @private
	*/
	populateList: function () {
		this.$.list.setCount(this.data.length);
		this.$.list.reset();
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		if (!this.data[inEvent.index]) {
			return;
		}

		this.$.text.setContent(this.data[inEvent.index]);
		return true;
	},

	/**
	* @private
	*/
	setupSwipeItem: function (inSender, inEvent) {
		if (!this.data[inEvent.index]) {
			return true;
		}

		if (inEvent.xDirection === -1) {
			// Persist swipeable item if swiped from right to left
			this.$.list.setPersistSwipeableItem(true);
			this.$.swipeTitle.setContent('This is a persistent item');
			this.$.swipeItem.removeClass('swipeGreen');
			this.$.swipeItem.addClass('swipeRed');
		} else {
			// Don't persist swipeable item if swiped from left to right
			this.$.list.setPersistSwipeableItem(false);
			this.$.swipeTitle.setContent('This is not a persistent item');
			this.$.swipeItem.removeClass('swipeRed');
			this.$.swipeItem.addClass('swipeGreen');
		}
		return true;
	},

	/**
	* @private
	*/
	swipeComplete: function (inSender, inEvent) {
	}
});
