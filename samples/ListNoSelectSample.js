/**
* A port of upstream's `list/samples/ListNoSelectSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* `ListBasicSample` with `noSelect: true`. Same 20,000 rows, same flyweight
* scrolling, but tapping a row does nothing and `setupItem` has no selection
* class to re-apply. Worth comparing side by side with the Basic one.
*
* It borrows `ListBasicSample.css`, which is how upstream had it -- its own
* `.html` linked that sheet rather than carrying a copy.
*
* @module layout/samples/ListNoSelectSample
*/

import kind from 'enyo/src/kind.js';

import List from 'layout/src/List/List.js';

import makeName from './NameGenerator.js';

/**
* @class ListNoSelectSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.ListNoSelectSample',
	classes: 'list-sample enyo-fit',
	components: [
		{name: 'list', kind: List, count: 20000, noSelect: true, multiSelect: false, classes: 'enyo-fit list-sample-list',
			onSetupItem: 'setupItem', components: [
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
		this.$.name.setContent(n);
		this.$.index.setContent(ni);
		return true;
	}
});
