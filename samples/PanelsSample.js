/**
* A port of upstream's `panels/samples/PanelsSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* A toolbar with an arranger picker over seven coloured panels, plus
* Previous/Next, a go-to-index box, and Add/Delete. Switching the picker swaps
* the Panels' `arrangerKind`, which is the quickest way to see what each
* arranger actually does.
*
* The 2.5 original was global-style enyo: `enyo.kind({...})` with every kind
* named by string (`kind: 'onyx.Button'`, `arrangerKind: 'GridArranger'`). In
* the ES-module world there is no global registry for those strings to resolve
* against, so each one is an import and a direct constructor reference here.
* Event handler names stay strings -- those are looked up on the owner at
* dispatch time and still work exactly as before.
*
* @module layout/samples/PanelsSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableColumns from 'layout/src/FittableColumns.js';
import Panels from 'layout/src/Panels/Panels.js';
import CardArranger from 'layout/src/CardArranger.js';
import CardSlideInArranger from 'layout/src/CardSlideInArranger.js';
import CarouselArranger from 'layout/src/CarouselArranger.js';
import CollapsingArranger from 'layout/src/CollapsingArranger.js';
import DockRightArranger from 'layout/src/DockRightArranger.js';
import GridArranger from 'layout/src/GridArranger.js';
import LeftRightArranger from 'layout/src/LeftRightArranger.js';
import SpiralArranger from 'layout/src/SpiralArranger.js';
import TopBottomArranger from 'layout/src/TopBottomArranger.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Menu from 'onyx/src/Menu/Menu.js';
import MenuDecorator from 'onyx/src/MenuDecorator.js';

/**
* GridArranger sizes every panel to its own `colWidth`/`colHeight`, so the
* sample subclasses it to get cells that match the 150px boxes
* `.panels-sample-grid` asks for. Upstream wrote these as the strings `'150'`;
* the documented type is Number and GridArranger does arithmetic with them, so
* they are numbers here.
*
* @class MyGridArranger
* @extends module:layout/GridArranger~GridArranger
* @private
*/
var MyGridArranger = kind({
	name: 'enyo.sample.MyGridArranger',
	kind: GridArranger,
	colHeight: 150,
	colWidth: 150
});

/**
* @class PanelsSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.PanelsSample',
	kind: FittableRows,
	classes: 'enyo-fit',
	components: [
		{kind: FittableColumns, noStretch: true, classes: 'onyx-toolbar onyx-toolbar-inline', components: [
			{kind: Scroller, thumb: false, fit: true, touch: true, vertical: 'hidden', style: 'margin: 0;', components: [
				{classes: 'onyx-toolbar-inline', style: 'white-space: nowrap;', components: [
					{kind: MenuDecorator, components: [
						// The activator doubles as the readout: `create` below
						// labels it with the arranger in force, and
						// `arrangerSelected` relabels it on every pick.
						// Upstream left it reading 'Arranger' forever, so the
						// only way to tell which one you had was to try it.
						{name: 'arrangerButton', content: 'Arranger'},
						{name: 'arrangerPicker', kind: Menu, maxHeight: 360, floating: true, onSelect: 'arrangerSelected'}
					]},
					{kind: Button, content: 'Previous', ontap: 'prevPanel'},
					{kind: Button, content: 'Next', ontap: 'nextPanel'},
					{kind: InputDecorator, style: 'width: 60px;', components: [
						// Named explicitly. Enyo would auto-name it `input` from
						// its kindName, which is what the original relied on,
						// but `this.$.input` below should not depend on that.
						{name: 'input', kind: Input, value: 0, onchange: 'gotoPanel'}
					]},
					{kind: Button, content: 'Go', ontap: 'gotoPanel'},
					{kind: Button, content: 'Add', ontap: 'addPanel'},
					{kind: Button, content: 'Delete', ontap: 'deletePanel'}
				]}
			]}
		]},
		{kind: Panels, name: 'samplePanels', fit: true, realtimeFit: true, classes: 'panels-sample-panels enyo-border-box', components: [
			{content: 0, style: 'background:red;'},
			{content: 1, style: 'background:orange;'},
			{content: 2, style: 'background:yellow;'},
			{content: 3, style: 'background:green;'},
			{content: 4, style: 'background:blue;'},
			{content: 5, style: 'background:indigo;'},
			{content: 6, style: 'background:violet;'}
		]}
	],

	/**
	* One entry per picker item: the arranger constructor to install, and the
	* class the panels need for it (most arrangers only make sense if the panels
	* have a size they can divide the space by).
	*
	* @private
	*/
	panelArrangers: [
		{name: 'CardArranger', arrangerKind: CardArranger},
		{name: 'CardSlideInArranger', arrangerKind: CardSlideInArranger},
		{name: 'CarouselArranger', arrangerKind: CarouselArranger, classes: 'panels-sample-wide'},
		{name: 'CollapsingArranger', arrangerKind: CollapsingArranger, classes: 'panels-sample-collapsible'},
		{name: 'LeftRightArranger', arrangerKind: LeftRightArranger},
		{name: 'TopBottomArranger', arrangerKind: TopBottomArranger, classes: 'panels-sample-topbottom'},
		{name: 'SpiralArranger', arrangerKind: SpiralArranger, classes: 'panels-sample-spiral'},
		{name: 'GridArranger', arrangerKind: MyGridArranger, classes: 'panels-sample-grid'},
		{name: 'DockRightArranger', arrangerKind: DockRightArranger, classes: 'panels-sample-collapsible'}
	],

	/**
	* @private
	*/
	bgcolors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],

	/**
	* @private
	*/
	panelCount: 0,

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			for (var i = 0; i < this.panelArrangers.length; i++) {
				// The entry rides along on the menu item. The original worked
				// back to it from `indexInContainer() - 1`, which depends on how
				// much chrome onyx.Menu puts in front of its items; carrying the
				// entry is the same lookup without that assumption.
				this.$.arrangerPicker.createComponent({
					content: this.panelArrangers[i].name,
					arranger: this.panelArrangers[i]
				});
			}
			this.panelCount = this.$.samplePanels.getPanels().length;
			this.showCurrentArranger();
		};
	}),

	/**
	* Labels the picker with the arranger the panels are actually using. Read
	* from the panels rather than assumed, so it cannot drift from whatever
	* Panels defaults `arrangerKind` to.
	*
	* @private
	*/
	showCurrentArranger: function () {
		var kind = this.$.samplePanels.arrangerKind;
		for (var i = 0; i < this.panelArrangers.length; i++) {
			if (this.panelArrangers[i].arrangerKind === kind) {
				this.$.arrangerButton.setContent(this.panelArrangers[i].name);
				return;
			}
		}
	},

	/**
	* @private
	*/
	arrangerSelected: function (sender, event) {
		var sp = this.$.samplePanels;
		var p = event.originator.arranger;
		if (!p) return;
		if (this.currentClass) {
			sp.removeClass(this.currentClass);
			this.currentClass = null;
		}
		if (p.classes) {
			sp.addClass(p.classes);
			this.currentClass = p.classes;
		}
		sp.setArrangerKind(p.arrangerKind);
		this.$.arrangerButton.setContent(p.name);
		if (Panels.isScreenNarrow()) {
			// The original called `this.setIndex(1)`, which does not exist on
			// this kind -- the index belongs to the panels.
			sp.setIndex(1);
		}
		this.$.input.setValue(sp.index);
	},

	// panels

	/**
	* @private
	*/
	prevPanel: function () {
		this.$.samplePanels.previous();
		this.$.input.setValue(this.$.samplePanels.index);
	},

	/**
	* @private
	*/
	nextPanel: function () {
		this.$.samplePanels.next();
		this.$.input.setValue(this.$.samplePanels.index);
	},

	/**
	* @private
	*/
	gotoPanel: function () {
		// Panels.clamp() does the range checking; an empty or junk box would
		// otherwise reach it as NaN and leave the index NaN.
		var i = parseInt(this.$.input.getValue(), 10);
		this.$.samplePanels.setIndex(isNaN(i) ? 0 : i);
	},

	/**
	* @private
	*/
	addPanel: function () {
		var sp = this.$.samplePanels;
		var i = this.panelCount++;
		var p = sp.createComponent({
			style: 'background:' + this.bgcolors[i % this.bgcolors.length],
			content: i
		});
		p.render();
		sp.reflow();
		sp.setIndex(i);
		this.$.input.setValue(sp.index);
	},

	/**
	* @private
	*/
	deletePanel: function () {
		var sp = this.$.samplePanels;
		var p = sp.getActive();
		if (p) {
			p.destroy();
			sp.reflow();
			this.$.input.setValue(sp.index);
		}
	}
});
