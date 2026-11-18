/**
* A port of upstream's `list/samples/FlyweightRepeaterSample.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* `FlyweightRepeater` is the machinery underneath `List`, on its own: one set
* of controls, rendered `count` times, with `onSetupItem` filling it in for
* each row. Unlike `List` it renders every row at once and does no scrolling of
* its own, so it is wrapped in a plain `Scroller` here. Tap a name and the bar
* at the top says which row you hit -- the `onSelect` event carries the index
* and the repeater, and the repeater repaints the selected row blue.
*
* @module layout/samples/FlyweightRepeaterSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';

import FittableRows from 'layout/src/FittableRows.js';
import FlyweightRepeater from 'layout/src/FlyweightRepeater.js';

import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

/**
* @class FlyweightRepeaterSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.FlyweightRepeaterSample',
	kind: FittableRows,
	classes: 'flyweight-repeater-sample enyo-fit onyx',
	components: [
		{kind: Toolbar, components: [
			{content: 'FlyweightRepeater Result'}
		]},
		{name: 'result', style: 'padding:12px; font-size: 20px;', content: 'Nothing selected yet.'},
		{kind: Scroller, fit: true, components: [
			{name: 'repeater', kind: FlyweightRepeater, classes: 'flyweight-repeater-sample-list', count: 26, onSetupItem: 'setupItem', components: [
				{name: 'item', classes: 'flyweight-repeater-sample-item'}
			]}
		]}
	],

	/**
	* @private
	*/
	handlers: {
		onSelect: 'itemSelected'
	},

	/**
	* @private
	*/
	people: [
		{name: 'Andrew'},
		{name: 'Betty'},
		{name: 'Christopher'},
		{name: 'Donna'},
		{name: 'Ephraim'},
		{name: 'Frankie'},
		{name: 'Gerald'},
		{name: 'Heather'},
		{name: 'Ingred'},
		{name: 'Jack'},
		{name: 'Kevin'},
		{name: 'Lucy'},
		{name: 'Matthew'},
		{name: 'Noreen'},
		{name: 'Oscar'},
		{name: 'Pedro'},
		{name: 'Quentin'},
		{name: 'Ralph'},
		{name: 'Steven'},
		{name: 'Tracy'},
		{name: 'Uma'},
		{name: 'Victor'},
		{name: 'Wendy'},
		{name: 'Xin'},
		{name: 'Yulia'},
		{name: 'Zoltan'}
	],

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var index = inEvent.index;
		this.$.item.setContent((index + 1) + '. ' + this.people[index].name);
		this.$.item.applyStyle('background', (inEvent.selected ? 'dodgerblue' : 'lightgray'));
		/* stop propogation */
		return true;
	},

	/**
	* @private
	*/
	itemSelected: function (inSender, inEvent) {
		var index = inEvent.index;
		var count = inEvent.flyweight.count;
		if (index >= 0 && index < count) {
			this.$.result.setContent(' [' + (index + 1) + '. ' + this.people[index].name + '] is selected');
		}
		return true;
	}
});
