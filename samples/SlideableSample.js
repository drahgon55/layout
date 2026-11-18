/**
* A port of upstream's `slideable/samples/SlideableSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* Four `Slideable`s, one per edge, each pinned with `enyo-fit` and given an
* axis, a unit and a min/max range: the top and bottom ones slide vertically in
* percent between 0 and ±90, the left and right ones horizontally. Drag any
* panel by its visible strip and its readout updates live from `onChange`, so
* you can watch `value` move between `min` and `max` -- which is the whole
* point, since `Slideable` is the drag-and-settle primitive the Panels
* arrangers are built on.
*
* @module layout/samples/SlideableSample
*/

import kind from 'enyo/src/kind.js';
import utils from 'enyo/src/utils.js';
import Control from 'enyo/src/Control/Control.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import Slideable from 'layout/src/Slideable.js';

/**
* The readout block dropped into each Slideable.
*
* @class SlideableInfo
* @extends module:enyo/Control~Control
* @private
*/
var SlideableInfo = kind({
	name: 'enyo.sample.SlideableInfo',
	kind: Control,
	published: {
		info: null
	},
	components: [
		{kind: FittableRows, classes: 'slideableinfo-sample', components: [
			{name: 'name'},
			{name: 'axis'},
			{name: 'unit'},
			{name: 'min'},
			{name: 'max'},
			{name: 'value'}
		]}
	],
	handlers: {
		onUpdateInfo: 'updateInfo'
	},

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.infoChanged();
		};
	}),

	/**
	* @private
	*/
	infoChanged: function () {
		for (var p in this.info) {
			if (this.$[p]) {
				this.$[p].setContent(utils.cap(p) + ': ' + this.info[p]);
			}
		}
	},

	/**
	* @private
	*/
	updateInfo: function (inSender, inEvent) {
		this.setInfo(inEvent);
		return true;
	}
});

/**
* @class SlideableSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.SlideableSample',
	classes: 'enyo-unselectable enyo-fit',
	style: 'overflow: hidden; background-color: #000;',
	components: [
		{name: 'top', kind: Slideable, axis: 'v', unit: '%', min: -90, max: 0, classes: 'enyo-fit slideable-sample top', onChange: 'updateInfo'},
		{name: 'right', kind: Slideable, axis: 'h', unit: '%', min: 0, max: 90, classes: 'enyo-fit slideable-sample right', onChange: 'updateInfo'},
		{name: 'bottom', kind: Slideable, axis: 'v', unit: '%', min: 0, max: 90, classes: 'enyo-fit slideable-sample bottom', onChange: 'updateInfo'},
		{name: 'left', kind: Slideable, axis: 'h', unit: '%', min: -90, max: 0, classes: 'enyo-fit slideable-sample left', onChange: 'updateInfo'}
	],

	/**
	* @private
	*/
	handlers: {
		ondragstart: 'suppressPanelDrag'
	},

	/**
	* Upstream found its Slideables with `this.$[c].kind === 'Slideable'`. In
	* 2.7 `kind` holds the constructor, not a name, so that test can never
	* pass and `populate()` ran over an empty array -- no readouts, no error.
	* `kindName` is the name, and it stays an exact-name comparison rather than
	* an `instanceof`: this is meant to find the four plain Slideables, not
	* anything deriving from Slideable.
	*
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			var slideables = [];

			for (var c in this.$) {
				if (this.$[c].kindName === 'enyo.Slideable') {
					slideables.push(this.$[c]);
				}
			}
			this.populate(slideables);
		};
	}),

	/**
	* @private
	*/
	populate: function (inSlideables) {
		var slideable;
		for (var i = 0; i < inSlideables.length; i++) {
			slideable = inSlideables[i];
			slideable.createComponents([
				{style: slideable.axis === 'h' ? 'height: 38%;' : ''}, // cheating here for the horizontal Slideables to make everything nice and (almost) centered vertically
				{
					kind: SlideableInfo,
					layoutKind: (slideable.axis === 'v') ? FittableLayout.Columns : FittableLayout.Rows,
					classes: 'enyo-center', // cheating here for the vertical Slideables to make everything nice and centered horizontally (no effect on horizontal Slideables)
					info: {
						name: slideable.name,
						axis: slideable.axis,
						unit: slideable.unit,
						min: slideable.min,
						max: slideable.max,
						value: slideable.value
					}
				}
			]);
		}
	},

	/**
	* @private
	*/
	updateInfo: function (inSender) {
		inSender.waterfallDown('onUpdateInfo', {
			name: inSender.name,
			axis: inSender.axis,
			unit: inSender.unit,
			min: inSender.min,
			max: inSender.max,
			value: Math.round(inSender.value)
		});
		return true;
	},

	/**
	* Keeps the view panel from moving in the Sampler app while dragging the
	* Slideable.
	*
	* @private
	*/
	suppressPanelDrag: function () {
		return true;
	}
});
