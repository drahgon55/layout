/**
* A port of upstream's `imageview/samples/ImageCarouselSample.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* The eight planets in an `ImageCarousel`: a `Panels` of `ImageView`s that
* creates and loads each image only when you reach it. Swipe or drag sideways,
* use the arrow buttons, or type an index in the box; each image is itself
* pan-and-zoomable. The box follows the carousel, because the sample listens
* for `onTransitionFinish`.
*
* @module layout/samples/ImageCarouselSample
*/

import kind from 'enyo/src/kind.js';

import FittableRows from 'layout/src/FittableRows.js';
import ImageCarousel from 'layout/src/ImageCarousel.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

/**
* @class ImageCarouselSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.ImageCarouselSample',
	kind: FittableRows,
	classes: 'enyo-fit',
	components: [
		{kind: Toolbar, style: 'text-align:center;', components: [
			{kind: Button, content: '&larr;', allowHtml: true, ontap: 'previous'},
			{kind: Button, content: '&rarr;', allowHtml: true, ontap: 'next'},
			{kind: InputDecorator, classes: 'imagecarousel-sample-input', components: [
				{name: 'carouselIndexInput', kind: Input, value: '0', onchange: 'updateIndex'}
			]}
		]},
		{name: 'carousel', kind: ImageCarousel, fit: true, onload: 'load', onZoom: 'zoom', onerror: 'error', onTransitionStart: 'transitionStart', onTransitionFinish: 'transitionFinish'}
	],

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.urls = [
				'assets/mercury.jpg',
				'assets/venus.jpg',
				'assets/earth.jpg',
				'assets/mars.jpg',
				'assets/jupiter.jpg',
				'assets/saturn.jpg',
				'assets/uranus.jpg',
				'assets/neptune.jpg'
			];
			// although we're specifying all the image urls now, the images themselves
			// only get created/loaded as needed
			this.$.carousel.setImages(this.urls);
		};
	}),

	/**
	* @private
	*/
	load: function (inSender, inEvent) {
		//this.log('image loaded: ' + inEvent.originator.src);
	},

	/**
	* @private
	*/
	zoom: function (inSender, inEvent) {
		//this.log('image zoomed: ' + inEvent.scale + ' scale on ' + inEvent.originator.src);
	},

	/**
	* @private
	*/
	error: function (inSender, inEvent) {
		//this.log('image error: ' + inEvent.originator.src);
	},

	/**
	* @private
	*/
	transitionStart: function (inSender, inEvent) {
		//this.log('image now transitioning from: ' + this.$.carousel.getImageByIndex(inEvent.fromIndex).src
		//		+ ' to ' + this.$.carousel.getImageByIndex(inEvent.toIndex).src);
	},

	/**
	* @private
	*/
	transitionFinish: function (inSender, inEvent) {
		//this.log('image transitioned to: ' + this.$.carousel.getActiveImage().src);
		if (this.$.carouselIndexInput) {
			this.$.carouselIndexInput.setValue(inEvent.toIndex);
		}
	},

	/**
	* @private
	*/
	previous: function (inSender, inEvent) {
		this.$.carousel.previous();
	},

	/**
	* @private
	*/
	next: function (inSender, inEvent) {
		this.$.carousel.next();
	},

	/**
	* @private
	*/
	getRandomIndex: function () {
		var i = Math.floor(Math.random() * this.$.carousel.images.length);
		while (i == this.$.carousel.index) { //make sure it isn't the active index
			i = Math.floor(Math.random() * this.$.carousel.images.length);
		}
		return i;
	},

	/**
	* @private
	*/
	updateIndex: function (inSender, inEvent) {
		var index = this.trimWhitespace(this.$.carouselIndexInput.getValue());
		if (index === '' || isNaN(index)) {
			//this.log('Numbers only please.');
			return;
		}
		this.$.carousel.setIndex(parseInt(index, 10));
	},

	/**
	* @private
	*/
	trimWhitespace: function (inString) {
		return inString.replace(/^\s+|\s+$/g, '');
	}
});
