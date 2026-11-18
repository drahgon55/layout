/**
* A port of upstream's `imageview/samples/ImageViewSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* `ImageView` is a pan-and-zoom surface for a single image: drag it, scroll or
* pinch to zoom, double-tap to zoom in a step. Pinned to it are four
* `ImageViewPin`s, which stay anchored to a point in *image* coordinates (two
* in pixels, two in percentages) while the image moves and scales under them --
* that is the thing to watch here.
*
* Our map pin icon is based in whole or in part on the OpenStructs open source
* information and documentation, largely developed by Structured Dynamics LLC.
* You are free to use this content and system as you wish, so long as any
* derivative works acknowledge these contributions. TechWiki is provided under
* the Creative Commons Attribution License, version 3.0.
* http://techwiki.openstructs.org/index.php/Open_Source_Icons
*
* @module layout/samples/ImageViewSample
*/

import kind from 'enyo/src/kind.js';
import Img from 'enyo/src/Image/Image.js';

import ImageView from 'layout/src/ImageView.js';
import ImageViewPin from 'layout/src/ImageViewPin/ImageViewPin.js';

/**
* @class ImageViewSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.ImageViewSample',
	components: [
		{name: 'sampleImageView', kind: ImageView, src: 'assets/globe.jpg', scale: 'auto', classes: 'enyo-fit', components: [
			{kind: ImageViewPin, highlightAnchorPoint: true, anchor: {top: 79, right: 224}, position: {bottom: 0, left: -16}, components: [
				{kind: Img, src: 'assets/pin.png'}
			]},
			{kind: ImageViewPin, anchor: {top: 280, left: 415}, position: {bottom: 0, right: -16}, components: [
				{kind: Img, src: 'assets/pin.png'}
			]},
			{kind: ImageViewPin, highlightAnchorPoint: true, anchor: {bottom: '20%', left: '400px'}, position: {bottom: 0, left: 0}, components: [
				{style: 'background:rgba(255,255,255,0.8);border:1px solid #888;margin:0px;padding:0px;width:300px', components: [
					{tag: 'h3', content: 'This is a text box'}
				]}
			]},
			{name: 'testPin', kind: ImageViewPin, anchor: {top: '10%', right: '10%'}, position: {top: 0, left: 0}, components: [
				{style: 'border:1px solid yellow;width:10px;background:red;height:10px;'}
			]}
		]}
	]
});
