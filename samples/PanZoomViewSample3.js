/**
* A port of upstream's `imageview/samples/PanZoomViewSample3.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* `PanZoomView` over content whose size is not known up front. `ImagesView`
* puts the same image side by side twice, measures both as they load and
* bubbles `onSetDimensions` so the view learns how big its content turned out
* to be and can scale to fit. "Change image" swaps in the next planet, which
* resets the measurement and makes the view re-fit -- the behaviour worth
* watching, since each planet is a different size.
*
* @module layout/samples/PanZoomViewSample3
*/

import kind from 'enyo/src/kind.js';
import Control from 'enyo/src/Control/Control.js';
import Img from 'enyo/src/Image/Image.js';
import Button from 'enyo/src/Button/Button.js';

import PanZoomView from 'layout/src/PanZoomView.js';

/**
* A pair of images measured as one block.
*
* Upstream declared this as a second global `enyo.kind` with no `kind:`
* property at all, relying on `kind.getDefaultCtor()`. That default is only
* populated once `enyo/src/Control/Control.js` has been evaluated, so in a
* module graph where it has not been yet the kind is silently built on an empty
* prototype and renders nothing, with no error. `kind: Control` says what it
* always meant.
*
* @class ImagesView
* @extends module:enyo/Control~Control
* @private
*/
var ImagesView = kind({
	name: 'ImagesView',
	kind: Control,
	width: 0,
	height: 0,
	published: {
		src: ''
	},
	components: [
		{name: 'image', kind: Img, onload: 'load', ondown: 'down'},
		{name: 'image2', kind: Img, onload: 'load', ondown: 'down'}
	],

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.srcChanged();
		};
	}),

	/**
	* @private
	*/
	srcChanged: function () {
		this.height = this.width = 0;
		this.$.image.setSrc(this.src);
		this.$.image2.setSrc(this.src);
	},

	/**
	* @private
	*/
	load: function (inSender, inEvent) {
		this.width += inEvent.originator.node.clientWidth;
		this.height = Math.max(this.height, inEvent.originator.node.clientHeight);
		this.bubble('onSetDimensions', {width: this.width, height: this.height});
	},

	/**
	* @private
	*/
	down: function (inSender, inEvent) {
		// Fix to prevent image drag in Firefox
		inEvent.preventDefault();
	}
});

/**
* @class PanZoomViewSample3
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.PanZoomViewSample3',
	classes: 'enyo-unselectable',
	style: 'width: 600px; border: 1px solid #ccc; margin: auto;',
	components: [
		{kind: PanZoomView, style: 'width: 100%; height: 400px;', scale: 'fit', components: [
			{name: 'imagesView', kind: ImagesView, src: 'assets/globe.jpg'}
		]},
		{kind: Button, content: 'change image', ontap: 'changeImage'}
	],

	/**
	* @private
	*/
	planets: ['assets/globe.jpg', 'assets/earth.jpg', 'assets/jupiter.jpg', 'assets/mars.jpg', 'assets/mercury.jpg', 'assets/neptune.jpg', 'assets/saturn.jpg', 'assets/uranus.jpg', 'assets/venus.jpg'],

	/**
	* The inner view is reached through the PanZoomView, not off the sample:
	* PanZoomView re-owns the components declared inside it, so they land in
	* *its* `$`, not the sample's. Upstream had this right; both names in its
	* path came from enyo auto-naming a component after its kind, and they are
	* declared explicitly above so the lookup no longer depends on
	* `enyo.PanZoomView` and `ImagesView` keeping those exact kind names.
	*
	* `enyo.indexOf(el, array)` is `array.indexOf(el)`.
	*
	* @private
	*/
	changeImage: function () {
		var imageview = this.$.panZoomView.$.imagesView;
		imageview.setSrc(this.planets[(this.planets.indexOf(imageview.src) + 1) % this.planets.length]);
	}
});
