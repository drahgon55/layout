/**
* A port of upstream's `list/samples/ListBasicSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* `List` at its simplest, and the reason it exists: 20,000 rows, two pages of
* real DOM. `onSetupItem` fires for each row as it comes into view and the
* handler fills the one set of controls in; what you scroll is the same handful
* of nodes being rewritten. Tap a row to select it -- selection is tracked by
* index on the list, not by the node, which is why `setupItem` has to re-apply
* the class every time a row is set up.
*
* @module layout/samples/ListBasicSample
*/

import kind from 'enyo/src/kind.js';

import List from 'layout/src/List/List.js';

import makeName from './NameGenerator.js';

/**
* @class ListBasicSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.ListBasicSample',
	classes: 'list-sample enyo-fit',
	components: [
		{name: 'list', kind: List, count: 20000, multiSelect: false, classes: 'enyo-fit list-sample-list', onSetupItem: 'setupItem', components: [
			{name: 'item', classes: 'list-sample-item enyo-border-box', components: [
				{name: 'index', classes: 'list-sample-index'},
				{name: 'name'}
			]}
		]}
	],

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
		this.$.item.addRemoveClass('list-sample-selected', inSender.isSelected(i));
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
		return true;
	}
});
