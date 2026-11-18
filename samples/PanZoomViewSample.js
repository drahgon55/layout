/**
* A port of upstream's `imageview/samples/PanZoomViewSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* `PanZoomView` wraps arbitrary content -- here a 600x600 grid of coloured
* boxes -- in a surface you can drag, scroll-wheel, pinch and double-tap to
* zoom. The seven buttons set `scale` to each of its accepted values: `auto`,
* `width`, `height`, `fit`, and plain multipliers. `handleResize` reapplies the
* last one so a window resize does not throw the view off.
*
* @module layout/samples/PanZoomViewSample
*/

import kind from 'enyo/src/kind.js';

import FittableColumns from 'layout/src/FittableColumns.js';
import PanZoomView from 'layout/src/PanZoomView.js';

import Button from 'onyx/src/Button/Button.js';
import Groupbox from 'onyx/src/Groupbox/Groupbox.js';
import GroupboxHeader from 'onyx/src/GroupboxHeader/GroupboxHeader.js';

/**
* @class PanZoomViewSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.PanZoomViewSample',
	components: [
		{kind: PanZoomView, contentWidth: 600, contentHeight: 600, classes: 'panzoomview-demo', onZoom: 'zoom', components: [
			{kind: FittableColumns, components: [
				{content: 'Hello World', style: 'background: orange; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: blue; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: cyan; width: 200px; height: 200px;'}
			]},
			{kind: FittableColumns, components: [
				{content: 'Hello World', style: 'background: lightblue; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: yellow; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: red; width: 200px; height: 200px;'}
			]},
			{kind: FittableColumns, components: [
				{content: 'Hello World', style: 'background: brown; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: green; width: 200px; height: 200px;'},
				{content: 'Hello World', style: 'background: pink; width: 200px; height: 200px;'}
			]}
		]},

		{kind: Groupbox, style: 'padding-top:10px; width:60%; margin:auto;', components: [
			{kind: GroupboxHeader, content: 'panZoomView Scale'},
			{style: 'text-align:center;', components: [
				{kind: Button, content: 'auto',   ontap: 'autoScale',   classes: 'panzoomview-demoButton'},
				{kind: Button, content: 'width',  ontap: 'widthScale',  classes: 'panzoomview-demoButton'},
				{kind: Button, content: 'height', ontap: 'heightScale', classes: 'panzoomview-demoButton'},
				{kind: Button, content: 'fit',    ontap: 'fitScale',    classes: 'panzoomview-demoButton'},
				{kind: Button, content: '0.5', ontap: 'halfScale', classes: 'panzoomview-demoButton'},
				{kind: Button, content: '1.0', ontap: 'normalScale', classes: 'panzoomview-demoButton'},
				{kind: Button, content: '2.0', ontap: 'doubleScale', classes: 'panzoomview-demoButton'}
			]}
		]}
	],

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.scale = 'auto';
		};
	}),

	/**
	* Upstream wrote this as a plain function calling `this.inherited(arguments)`.
	* It is wrapped now: `kind.inherit` is the documented 2.7 form, and
	* `arguments.callee` -- which the bare call used to reach for -- is
	* forbidden in a module.
	*
	* @method
	* @private
	*/
	handleResize: kind.inherit(function (sup) {
		return function (inSender, inEvent) {
			sup.apply(this, arguments);
			this.$.panZoomView.setScale(this.scale);
		};
	}),

	/**
	* @private
	*/
	zoom: function (inSender, inEvent) {
		//this.log('zoomed to ' + inEvent.scale);
	},

	/**
	* @private
	*/
	autoScale: function (inSender, inEvent) {
		this.scale = 'auto';
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	widthScale: function (inSender, inEvent) {
		this.scale = 'width';
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	heightScale: function (inSender, inEvent) {
		this.scale = 'height';
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	fitScale: function (inSender, inEvent) {
		this.scale = 'fit';
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	halfScale: function (inSender, inEvent) {
		this.scale = 0.5;
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	normalScale: function (inSender, inEvent) {
		this.scale = 1.0;
		this.$.panZoomView.setScale(this.scale);
	},

	/**
	* @private
	*/
	doubleScale: function (inSender, inEvent) {
		this.scale = 2.0;
		this.$.panZoomView.setScale(this.scale);
	}
});
