/**
* A port of upstream's `easing/samples/EasingSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* A ball on a 200px track and a scrolling popup menu of every easing function
* layout adds to enyo's. Pick one and the ball drops with that curve.
*
* @module layout/samples/EasingSample
*/

import kind from 'enyo/src/kind.js';
import Animator from 'enyo/src/Animator.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';
import TouchScrollStrategy from 'enyo/src/TouchScrollStrategy.js';

import easing from 'layout/src/easing.js';

import Menu from 'onyx/src/Menu/Menu.js';
import MenuItem from 'onyx/src/MenuItem.js';
import MenuDecorator from 'onyx/src/MenuDecorator.js';

/**
* @class EasingSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.EasingSample',
	classes: 'onyx enyo-unselectable easing-sample',
	components: [
		{kind: Animator, name: 'animator', onStep: 'animatorStep', onEnd: 'animatorComplete', easingFunction: easing.linear},
		{name: 'container', classes: 'easing-sample-ball-container', components: [
			{name: 'box', classes: 'easing-sample-ball'}
		]},
		{classes: 'easing-sample-control-container', style: 'display:inline-block;', components: [
			{content: 'Easing Type', classes: 'easing-sample-divider'},
			{kind: MenuDecorator, onSelect: 'itemSelected', components: [
				{name: 'menuButton', content: 'Scrolling Popup menu'},
				{kind: Menu, components: [
					// `strategyKind` was the string 'TouchScrollStrategy'
					// upstream. Scroller hands it straight to `kind:`, which
					// wants a constructor here.
					{name: 'menuScroller', kind: Scroller, defaultKind: MenuItem, vertical: 'auto', classes: 'enyo-unselectable', maxHeight: '200px', strategyKind: TouchScrollStrategy}
				]}
			]}
		]}
	],

	/**
	* @private
	*/
	duration: 1000,

	/**
	* @private
	*/
	itemSelected: function (inSender, inEvent) {
		var item = inEvent.selected.content;
		this.$.menuButton.setContent(item);
		this.$.animator.setEasingFunction(easing[item]);
		this.play();
	},

	/**
	* @private
	*/
	play: function () {
		this.$.animator.play({
			startValue: 0,
			endValue: 150,
			node: this.$.box.hasNode(),
			duration: this.duration
		});
	},

	/**
	* @private
	*/
	animatorStep: function (inSender) {
		this.$.box.applyStyle('top', inSender.value + 'px');
		return true;
	},

	/**
	* Upstream also re-enabled `this.$.btnAnimate` here, a control this sample
	* has never had -- there is no Animate button, only the menu. Under the old
	* global build that was a TypeError on every animation that finished; it
	* just happened in a handler nobody was watching. Dropped.
	*
	* @private
	*/
	animatorComplete: function (inSender) {
		this.$.menuButton.setDisabled(false);
		return true;
	},

	/**
	* @method
	* @private
	*/
	create: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.buildMenu();
		};
	}),

	/**
	* One menu item per easing function. `layout/src/easing.js` mixes layout's
	* curves into enyo's `animation.easing`, so this picks up both, exactly as
	* `enyo.easing` did in 2.5.
	*
	* @private
	*/
	buildMenu: function () {
		var i = 0;
		for (var k in easing) {
			this.$.menuScroller.createComponent({content: k});
			if (i === 0) {
				this.$.menuButton.setContent(k);
			}
			i++;
		}
	}
});
