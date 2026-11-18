/**
* A port of upstream's `list/samples/ListContactsSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* The big one: a contacts list showing most of what `List` can do at once.
* Rows are a custom item kind with an avatar and a remove button; alphabetical
* dividers are a second flyweight control that `setupItem` turns on and off per
* row via `canGenerate`. Tap rows to select them (multi-select), tap a selected
* row's remove button or **remove selected** to delete, **new contact** inserts
* in sort order and scrolls to it, the search box filters with a 200ms job, and
* **setup** opens a popup whose two sliders set the row count and
* `rowsPerPage` before repopulating.
*
* @module layout/samples/ListContactsSample
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';
import job from 'enyo/src/job.js';
import Img from 'enyo/src/Image/Image.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import List from 'layout/src/List/List.js';

import Button from 'onyx/src/Button/Button.js';
import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import IconButton from 'onyx/src/IconButton.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import MoreToolbar from 'onyx/src/MoreToolbar/MoreToolbar.js';
import Popup from 'onyx/src/Popup/Popup.js';
import Slider from 'onyx/src/Slider/Slider.js';

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
* `ContactItem`, then referred to it by that name from the components block; it
* is a module-local constant now.
*
* @class ContactItem
* @extends module:enyo/Control~Control
* @private
*/
var ContactItem = kind({
	name: 'ContactItem',
	events: {
		onRemove: ''
	},
	published: {
		importance: 0
	},
	components: [
		{name: 'avatar', kind: Img, classes: 'list-sample-contacts-avatar'},
		{components: [
			{name: 'name'},
			{name: 'title', classes: 'list-sample-contacts-description'},
			{content: '(415) 711-1234', classes: 'list-sample-contacts-description'}
		]},
		{name: 'remove', kind: IconButton, classes: 'list-sample-contacts-remove-button', src: 'assets/remove-icon.png', ontap: 'removeTap'}
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
	* Upstream applied `display: 'gne'` when deselecting -- a typo. The browser
	* drops an unparseable value, so the inline `inline-block` from the last
	* selection survived and the remove button stayed visible on rows you had
	* deselected. `none`, which is plainly what was meant and what the
	* stylesheet's own `.list-sample-contacts-remove-button` rule says.
	*
	* @private
	*/
	setSelected: function (inSelected) {
		this.addRemoveClass('list-sample-contacts-item-selected', inSelected);
		this.$.remove.applyStyle('display', inSelected ? 'inline-block' : 'none');
	},

	/**
	* Dead upstream and left dead: nothing calls it, and the `importance`
	* control it writes to was never in the components block.
	*
	* @private
	*/
	renderImportance: function () {
		switch (this.importance) {
		case 0:
			this.$.importance.setContent('not important');
			break;
		case -1:
			this.$.importance.setContent('important');
			break;
		case -2:
			this.$.importance.setContent('very important');
			break;
		default:
			window.alert(this.importance + ' - wowzer');
			break;
		}
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
* @class ListContactsSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.ListContactsSample',
	kind: FittableRows,
	classes: 'list-sample-contacts enyo-fit',
	components: [
		{
			kind: MoreToolbar,
			layoutKind: FittableLayout.Columns,
			style: 'height: 55px;',
			components: [
				{kind: Button, content: 'setup', ontap: 'showSetupPopup'},
				{kind: InputDecorator, components: [
					{name: 'newContactInput', kind: Input, value: 'Frankie Fu'}
				]},
				{kind: Button, content: 'new contact', ontap: 'addItem'},
				{fit: true},
				{kind: InputDecorator, components: [
					{kind: Input, placeholder: 'Search...', style: 'width: 140px;', oninput: 'searchInputChange'},
					{kind: Img, src: 'assets/search-input-search.png', style: 'width: 20px;'}
				]},
				{kind: Button, content: 'remove selected', ontap: 'removeSelected'}
			]
		},
		{
			// Named; upstream relied on enyo auto-naming it `list`.
			name: 'list',
			kind: List,
			classes: 'list-sample-contacts-list enyo-unselectable',
			fit: true,
			multiSelect: true,
			onSetupItem: 'setupItem',
			components: [
				{name: 'divider', classes: 'list-sample-contacts-divider'},
				{name: 'item', kind: ContactItem, classes: 'list-sample-contacts-item enyo-border-box', onRemove: 'removeTap'}
			]
		},
		{
			name: 'popup',
			kind: Popup,
			modal: true,
			centered: true,
			classes: 'list-sample-contacts-popup',
			components: [
				{
					components: [
						{style: 'display:inline-block', components: [
							{content: 'count:', classes: 'list-sample-contacts-label'},
							{name: 'countOutput', style: 'display:inline-block;', content: '200'}
						]},
						{kind: Slider, value: 4, onChanging: 'countSliderChanging', onChange: 'countSliderChanging'}
					]
				},
				{
					components: [
						{content: 'rowsPerPage:', classes: 'list-sample-contacts-label'},
						{name: 'rowsPerPageOutput', style: 'display:inline-block;', content: '50'},
						{kind: Slider, value: 10, onChanging: 'rowsSliderChanging', onChange: 'rowsSliderChanging'}
					]
				},
				{
					components: [
						{content: 'hide divider:', classes: 'list-sample-contacts-label'},
						{name: 'hideDividerCheckbox', kind: Checkbox}
					]
				},
				{
					components: [
						{kind: Button, content: 'populate list', classes: 'list-sample-contacts-populate-button', ontap: 'populateList'}
					]
				}
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
		// if we hit end of for-loop, add to end of list
		if (!di) {
			this.db.push(item);
		}
		this.refreshList();
		this.$.list.scrollToRow(i);
	},

	/**
	* @private
	*/
	removeItem: function (inIndex) {
		this._removeItem(inIndex);
		this.$.list.getSelection().remove(inIndex);
		this.refreshList();
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
	removeSelected: function () {
		// get selected items, sort numerically in decending order
		var selected = utils.keys(this.$.list.getSelection().getSelected());
		selected.sort(function (a, b) { return b - a; });
		// remove items one-by-one, starting with last in the list
		for (var i = 0; i < selected.length; i++) {
			this._removeItem(selected[i]);
		}
		// clear selection, since all selected items are now gone
		this.$.list.getSelection().clear();
		// re-render list in current position
		this.refreshList();
	},

	/**
	* @private
	*/
	populateList: function () {
		this.$.popup.hide();
		this.createDb(~~this.$.countOutput.getContent());
		this.$.list.setCount(this.db.length);
		this.$.list.setRowsPerPage(~~this.$.rowsPerPageOutput.getContent());
		//
		this.hideDivider = this.$.hideDividerCheckbox.getValue();
		//this.$.divider.canGenerate = !this.hideDivider;
		//
		this.$.list.reset();
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
			title: titles[utils.irand(titles.length)],
			importance: 0
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
	},

	/**
	* @private
	*/
	countSliderChanging: function (inSender, inEvent) {
		this.$.countOutput.setContent(Math.round(inSender.getValue()) * 50);
	},

	/**
	* @private
	*/
	rowsSliderChanging: function (inSender, inEvent) {
		this.$.rowsPerPageOutput.setContent(Math.round(inSender.getValue()) * 5);
	}
});
