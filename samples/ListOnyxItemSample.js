/**
* A port of upstream's `list/samples/ListOnyxItemSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* The same 20,000-row `List`, but each row is an `onyx.Item` with
* `tapHighlight: true`, so you get onyx's press feedback on a flyweight row.
* Every even row carries the selected class unconditionally -- that is
* upstream's doing, and it is there to show the highlight and the selection
* colour interacting (`ListBasicSample.css` has an `.onyx-highlight` rule for
* exactly that).
*
* It borrows `ListBasicSample.css`, which is how upstream had it.
*
* @module layout/samples/ListOnyxItemSample
*/

import kind from 'enyo/src/kind.js';

import List from 'layout/src/List/List.js';

import Item from 'onyx/src/Item/Item.js';

import makeName from './NameGenerator.js';

/**
* @class ListOnyxItemSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.ListOnyxItemSample',
	classes: 'list-sample enyo-fit',
	components: [{
		name: 'list',
		kind: List,
		count: 20000,
		multiSelect: false,
		classes: 'enyo-fit list-sample-list',
		onSetupItem: 'setupItem',
		components: [{
			name: 'item',
			kind: Item,
			tapHighlight: true,
			classes: 'list-sample-item enyo-border-box',
			components: [{
				name: 'index',
				classes: 'list-sample-index'
			}, {
				name: 'name'
			}]
		}]
	}],

	/**
	* @private
	*/
	names: [],

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		// make some mock data if we have none for this row
		if (!this.names[i]) {
			this.names[i] = makeName(5, 10, '', '');
		}
		var n = this.names[i];
		var ni = ('00000000' + i).slice(-7);
		// apply selection style if inSender (the list) indicates that this row is selected.
		this.$.item.addRemoveClass('list-sample-selected', (i % 2 === 0));
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
	}
});
