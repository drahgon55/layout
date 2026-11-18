/**
* A port of upstream's `list/samples/ListLanguagesSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* `List`'s two heaviest features at once: reordering and swiping. Each row
* holds a number, in one of five languages. Press and hold a row to pick it up
* and drag it to a new position (`reorderComponents` is what you are dragging;
* `onReorder` moves the backing data to match). Swipe a row sideways and the
* green panel shows the next or previous language, and on release
* `onSwipeComplete` switches that row into it -- swipe right for the next
* language, left for the previous. The toolbar repopulates the list with as
* many rows as you ask for.
*
* Upstream's pinned-reorder block is still here, still commented out, with its
* 2.2-era note about pinned mode being a work in progress.
*
* @module layout/samples/ListLanguagesSample
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import List from 'layout/src/List/List.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import MoreToolbar from 'onyx/src/MoreToolbar/MoreToolbar.js';

/**
* @class ListLanguagesSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.ListLanguagesSample',
	kind: FittableRows,
	classes: 'list-sample-language enyo-fit',

	/**
	* @private
	*/
	data: [],

	/**
	* @private
	*/
	languages: {
		English: ['One',  'Two',  'Three', 'Four',    'Five',    'Six',   'Seven',  'Eight', 'Nine',  'Ten'],
		Italian: ['Uno',  'Due',  'Tre',   'Quattro', 'Cinque',  'Sei',   'Sette',  'Otto',  'Nove',  'Dieci'],
		Spanish: ['Uno',  'Dos',  'Tres',  'Cuatro',  'Cinco',   'Seis',  'Siete',  'Ocho',  'Nueve', 'Diez'],
		German:  ['Eins', 'Zwei', 'Drei',  'Vier',    'F\xFCnf', 'Sechs', 'Sieben', 'Acht',  'Neun',  'Zehn'],
		French:  ['Un',   'Deux', 'Trois', 'Quatre',  'Cinq',    'Six',   'Sept',   'Huit',  'Neuf',  'Dix']
	},

	components: [
		{kind: MoreToolbar, layoutKind: FittableLayout.Columns, style: 'height: 55px;', components: [
			{content: 'Rows:'},
			{kind: InputDecorator, components: [
				{kind: Input, value: '10', name: 'numRows'}
			]},
			{kind: Button, content: 'Repopulate', ontap: 'populateList'}
		]},
		{
			// Named; upstream relied on enyo auto-naming it `list`.
			name: 'list',
			kind: List,
			classes: 'list-sample-language-list enyo-unselectable',
			fit: true,
			multiSelect: true,
			reorderable: true,
			centerReorderContainer: false,
			enableSwipe: true,
			onSetupItem: 'setupItem',
			onReorder: 'listReorder',
			onSetupReorderComponents: 'setupReorderComponents',
			// onSetupPinnedReorderComponents: 'setupPinnedReorderComponents',
			onSetupSwipeItem: 'setupSwipeItem',
			onSwipeComplete: 'swipeComplete',
			components: [
				{name: 'item', classes: 'list-sample-language-item', components: [
					{name: 'text', classes: 'itemLabel'},
					{name: 'rowNumber', classes: 'rowNumberLabel'},
					{name: 'serial', classes: 'serialLabel'}
				]}
			],
			reorderComponents: [
				{name: 'reorderContent', classes: 'enyo-fit reorderDragger', components: [
					{name: 'reorderTitle', tag: 'h2', allowHtml: true}
				]}
			],
			// For Enyo 2.2, we comment out these components to disable pinned mode which is still
			// considered a work in progress.
			/* pinnedReorderComponents: [
				{name: 'pinnedReorderItem', classes: 'enyo-fit swipeGreen', components: [
					{name: 'pinnedReorderTitle', tag: 'h2', allowHtml: true},
					{name: 'dropButton', kind: Button, ontap: 'dropPinnedRow', content: 'Drop', classes: 'dropButton'},
					{name: 'cancelButton', kind: Button, ontap: 'cancelPinnedMode', content: 'Cancel', classes: 'cancelButton'}
				]}
			], */
			swipeableComponents: [
				{name: 'swipeItem', classes: 'enyo-fit swipeGreen', components: [
					{name: 'swipeTitle', classes: 'swipeTitle'}
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
	listReorder: function (inSender, inEvent) {
		var movedItem = utils.clone(this.data[inEvent.reorderFrom]);
		this.data.splice(inEvent.reorderFrom, 1);
		this.data.splice((inEvent.reorderTo), 0, movedItem);
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var i = inEvent.index;
		if (!this.data[i]) {
			return;
		}
		var currentLanguage = this.data[i].langs[this.data[i].currentIndex];
		var val = this.data[i].val;
		var number = this.languages[currentLanguage][val];
		var serial = this.data[i].serial;
		this.$.rowNumber.setContent('ROW ' + i);
		this.$.text.setContent(number);
		this.$.serial.setContent('#' + serial);
	},

	/**
	* @private
	*/
	setupReorderComponents: function (inSender, inEvent) {
		var i = inEvent.index;
		if (!this.data[i]) {
			return;
		}
		var currentLanguage = this.data[i].langs[this.data[i].currentIndex];
		var val = this.data[i].val;
		var number = this.languages[currentLanguage][val];
		this.$.reorderTitle.setContent(number);
		return true;
	},

	/* setupPinnedReorderComponents: function (inSender, inEvent) {
		var i = inEvent.index;
		if (!this.data[i]) {
			return;
		}
		var currentLanguage = this.data[i].langs[this.data[i].currentIndex];
		var val = this.data[i].val;
		var number = this.languages[currentLanguage][val];
		this.$.pinnedReorderTitle.setContent(number);
	}, */

	//* Called when the 'Drop' button is pressed on the pinned placeholder row
	/* dropPinnedRow: function (inSender, inEvent) {
		this.$.list.dropPinnedRow(inEvent);
	}, */

	//* Called when the 'Cancel' button is pressed on the pinned placeholder row
	/* cancelPinnedMode: function (inSender, inEvent) {
		this.$.list.cancelPinnedMode(inEvent);
	}, */

	/**
	* @private
	*/
	setupSwipeItem: function (inSender, inEvent) {
		var i = inEvent.index;
		if (!this.data[i]) {
			return;
		}
		var newLang = (inEvent.xDirection == 1)
			? this.getNextLang(i)
			: this.getPrevLang(i);
		this.$.swipeTitle.setContent(this.data[i].langs[newLang]);
		return true;
	},

	/**
	* @private
	*/
	swipeComplete: function (inSender, inEvent) {
		var i = inEvent.index;
		this.data[i].currentIndex = (inEvent.xDirection == 1)
			? this.getNextLang(i)
			: this.getPrevLang(i);
		this.$.list.renderRow(i);
	},

	/**
	* @private
	*/
	getNextLang: function (index) {
		var currentLang = this.data[index].currentIndex;
		return (currentLang + 1) % this.data[index].langs.length;
	},

	/**
	* @private
	*/
	getPrevLang: function (index) {
		var currentLang = this.data[index].currentIndex;
		return (currentLang - 1 + this.data[index].langs.length) % this.data[index].langs.length;
	},

	/**
	* @private
	*/
	populateList: function () {
		this.createRandomData();
		this.$.list.setCount(this.data.length);
		this.$.list.reset();
	},

	/**
	* @private
	*/
	createRandomData: function () {
		var languages = this.getLanguages();
		var langs;
		var dataCount = parseInt(this.$.numRows.getValue(), 10);
		this.data = [];
		var sortFunc = function () { return 0.5 - Math.random(); };
		for (var i = 0; i < dataCount; i++) {
			langs = utils.clone(languages);
			langs.sort(sortFunc);
			this.data.push({
				langs: langs,
				val: i % 10,
				currentIndex: 0,
				serial: i
			});
		}
		this.data.sort(function () { return 0.5 - Math.random(); });
	},

	/**
	* @private
	*/
	getLanguages: function () {
		return utils.keys(this.languages);
	}
});
