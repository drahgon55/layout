/**
* A port of upstream's `list/samples/ListAroundSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* `AroundList` is `List` with `aboveComponents` and `belowComponents`: controls
* that live *inside* the list's own scroller, above and below the flyweight
* rows. So the search toolbar here scrolls away with the contacts instead of
* staying pinned -- that is the whole difference from `ListContactsSample`, and
* the thing to watch. Everything else is the same contacts list: multi-select,
* per-row remove buttons, alphabetical dividers, and a filter box on a 200ms
* job.
*
* @module layout/samples/ListAroundSample
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';
import job from 'enyo/src/job.js';
import Img from 'enyo/src/Image/Image.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import AroundList from 'layout/src/AroundList.js';

import Button from 'onyx/src/Button/Button.js';
import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import IconButton from 'onyx/src/IconButton.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Popup from 'onyx/src/Popup/Popup.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

import makeName from './NameGenerator.js';

var avatars = [
	'angel.png',
	'astrologer.png',
	'athlete.png',
	'baby.png',
	'clown.png',
	'devil.png',
	'doctor.png',
	'dude.png',
	'dude2.png',
	'dude3.png',
	'dude4.png',
	'dude5.png',
	'dude6.png'
];

var titles = [
	'Regional Data Producer',
	'Internal Markets Administrator',
	'Central Solutions Producer',
	'Dynamic Program Executive',
	'Direct Configuration Executive',
	'International Marketing Assistant',
	'District Research Consultant',
	'Lead Intranet Coordinator',
	'Central Accountability Director',
	'Product Web Assistant'
];

/**
* It's convenient to create a kind for the item we'll render in the contacts
* list. Upstream declared it as a second global `enyo.kind` named
* `AroundListContactItem` and referred to it by that name; it is a module-local
* constant now.
*
* @class AroundListContactItem
* @extends module:enyo/Control~Control
* @private
*/
var AroundListContactItem = kind({
	name: 'AroundListContactItem',
	events: {
		onRemove: ''
	},
	components: [
		{name: 'avatar', kind: Img, classes: 'list-sample-around-avatar'},
		{components: [
			{name: 'name', classes: 'list-sample-around-name'},
			{name: 'title', classes: 'list-sample-around-description'},
			{content: '(415) 711-1234', classes: 'list-sample-around-description'}
		]},
		{name: 'remove', kind: IconButton, classes: 'list-sample-around-remove-button', src: 'assets/remove-icon.png', ontap: 'removeTap'}
	],

	/**
	* @private
	*/
	setContact: function (inContact) {
		this.$.name.setContent(inContact.name);
		this.$.avatar.setSrc(inContact.avatar);
		this.$.title.setContent(inContact.title);
	},

	/**
	* @private
	*/
	setSelected: function (inSelected) {
		this.addRemoveClass('list-sample-around-item-selected', inSelected);
		this.$.remove.applyStyle('display', inSelected ? 'inline-block' : 'none');
	},

	/**
	* @private
	*/
	removeTap: function (inSender, inEvent) {
		this.doRemove({index: inEvent.index});
		return true;
	}
});

/**
* @class ListAroundSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.ListAroundSample',
	kind: FittableRows,
	classes: 'enyo-fit enyo-unselectable',
	components: [
		{name: 'list', kind: AroundList, classes: 'list-sample-around', fit: true, multiSelect: true, onSetupItem: 'setupItem', aboveComponents: [
			{kind: Toolbar, layoutKind: FittableLayout.Columns, components: [
				// `setup` is ours. The popup below has a count box, a
				// rowsPerPage box and a hide-divider checkbox, and upstream
				// left nothing on the page that could open it -- its sibling
				// ListContactsSample has exactly this button for exactly this
				// popup, so this sample looks like it lost one. Without it
				// `populateList` only ever runs once, from `rendered`, with
				// the popup's defaults.
				{kind: Button, content: 'setup', ontap: 'showSetupPopup'},
				{kind: InputDecorator, fit: true, noStretch: true, layoutKind: FittableLayout.Columns, components: [
					{kind: Input, placeholder: 'Search...', fit: true, oninput: 'searchInputChange'},
					{kind: Img, src: 'assets/search-input-search.png', style: 'height: 20px; width: 20px;'}
				]}
			]}
		], components: [
			{name: 'divider', classes: 'list-sample-around-divider'},
			{name: 'item', kind: AroundListContactItem, classes: 'list-sample-around-item enyo-border-box', onRemove: 'removeTap'}
		]},
		{name: 'popup', kind: Popup, modal: true, centered: true, classes: 'list-sample-around-popup', components: [
			{components: [
				{content: 'count:', classes: 'list-sample-around-label'},
				{kind: InputDecorator, components: [
					{name: 'countInput', kind: Input, style: 'width: 80px', value: 100}
				]}
			]},
			{components: [
				{content: 'rowsPerPage:', classes: 'list-sample-around-label'},
				{kind: InputDecorator, components: [
					{name: 'rowsPerPageInput', kind: Input, style: 'width: 80px', value: 50}
				]}
			]},
			{components: [
				{content: 'hide divider:', classes: 'list-sample-around-label'},
				{name: 'hideDividerCheckbox', kind: Checkbox}
			]},
			{components: [
				{kind: Button, content: 'populate list', classes: 'list-sample-around-populate-button', ontap: 'populateList'}
			]}
		]}
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
	setupItem: function (inSender, inEvent) {
		var i = inEvent.index;
		var data = this.filter ? this.filtered : this.db;
		var item = data[i];
		// content
		this.$.item.setContact(item);
		// selection
		this.$.item.setSelected(inSender.isSelected(i));
		// divider
		if (!this.hideDivider) {
			var d = item.name[0];
			var prev = data[i - 1];
			var showd = d != (prev && prev.name[0]);
			this.$.divider.setContent(d);
			this.$.divider.canGenerate = showd;
			this.$.item.applyStyle('border-top', showd ? 'none' : null);
		}
		return true;
	},

	/**
	* @private
	*/
	refreshList: function () {
		if (this.filter) {
			this.filtered = this.generateFilteredData(this.filter);
			this.$.list.setCount(this.filtered.length);
		} else {
			this.$.list.setCount(this.db.length);
		}
		this.$.list.refresh();
	},

	/**
	* Dead upstream and left dead: `newContactInput` is a control of
	* `ListContactsSample`, which this sample was copied from, and nothing on
	* this page has a new-contact box or calls this.
	*
	* @private
	*/
	addItem: function () {
		var item = this.generateItem(utils.cap(this.$.newContactInput.getValue()));
		var i = 0;
		for (var di; (di = this.db[i]); i++) {
			if (di.name > item.name) {
				this.db.splice(i, 0, item);
				break;
			}
		}
		this.refreshList();
		this.$.list.scrollToRow(i);
	},

	/**
	* @private
	*/
	removeItem: function (inIndex) {
		this._removeItem(inIndex);
		this.refreshList();
		this.$.list.getSelection().deselect(inIndex);
	},

	/**
	* @private
	*/
	_removeItem: function (inIndex) {
		var i = this.filter ? this.filtered[inIndex].dbIndex : inIndex;
		this.db.splice(i, 1);
	},

	/**
	* @private
	*/
	removeTap: function (inSender, inEvent) {
		this.removeItem(inEvent.index);
		return true;
	},

	/**
	* @private
	*/
	populateList: function () {
		this.$.popup.hide();
		this.createDb(this.$.countInput.getValue());
		this.$.list.setCount(this.db.length);
		this.$.list.setRowsPerPage(this.$.rowsPerPageInput.getValue());
		//
		this.hideDivider = this.$.hideDividerCheckbox.getValue();
		this.$.divider.canGenerate = !this.hideDivider;
		//
		this.$.list.reset();
		this.$.list.scrollToContentStart();
	},

	/**
	* @private
	*/
	createDb: function (inCount) {
		this.db = [];
		for (var i = 0; i < inCount; i++) {
			this.db.push(this.generateItem(makeName(4, 6) + ' ' + makeName(5, 10)));
		}
		this.sortDb();
	},

	/**
	* @private
	*/
	generateItem: function (inName) {
		return {
			name: inName,
			avatar: 'assets/avatars/' + avatars[utils.irand(avatars.length)],
			title: titles[utils.irand(titles.length)]
		};
	},

	/**
	* @private
	*/
	sortDb: function () {
		this.db.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			}
			else if (a.name > b.name) {
				return 1;
			}
			else {
				return 0;
			}
		});
	},

	/**
	* @private
	*/
	showSetupPopup: function () {
		this.$.popup.show();
	},

	/**
	* @private
	*/
	searchInputChange: function (inSender) {
		job(this.id + ':search', this.bindSafely('filterList', inSender.getValue()), 200);
		return true;
	},

	/**
	* @private
	*/
	filterList: function (inFilter) {
		if (inFilter != this.filter) {
			this.filter = inFilter;
			this.filtered = this.generateFilteredData(inFilter);
			this.$.list.setCount(this.filtered.length);
			this.$.list.reset();
		}
	},

	/**
	* @private
	*/
	generateFilteredData: function (inFilter) {
		var re = new RegExp('^' + inFilter, 'i');
		var r = [];
		for (var i = 0, d; (d = this.db[i]); i++) {
			if (d.name.match(re)) {
				d.dbIndex = i;
				r.push(d);
			}
		}
		return r;
	}
});
