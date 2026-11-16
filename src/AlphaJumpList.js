/**
* Contains the declaration for the {@link module:layout/AlphaJumpList~AlphaJumpList} kind.
* @module layout/AlphaJumpList
*/

import kind from 'enyo/src/kind.js';

import AlphaJumper from './AlphaJumper/AlphaJumper.js';
import List from './List/List.js';

/**
* {@link module:layout/AlphaJumpList~AlphaJumpList} is a
* {@link module:layout/List~List} that features an alphabetical panel from which
* a selection may be made. Actions are performed based on the item that is
* selected.
*
* ```javascript
* 	import kind from 'enyo/src/kind.js';
* 	import AlphaJumpList from 'layout/src/AlphaJumpList.js';
* 	import Item from 'onyx/src/Item/Item.js';
*
* 	{kind: AlphaJumpList, onSetupItem: 'setupItem',
* 		onAlphaJump: 'alphaJump',
* 		components: [
* 			{name: 'divider'},
* 			{kind: Item}
* 		]
* 	}
* ```
*
* @ui
* @class AlphaJumpList
* @extends module:layout/List~List
* @public
*/
export default kind(
	/** @lends module:layout/AlphaJumpList~AlphaJumpList.prototype */ {

	/**
	* @private
	*/
	name: 'enyo.AlphaJumpList',

	/**
	* @private
	*/
	kind: List,

	/**
	* @private
	*/
	scrollTools: [
		{name: 'jumper', kind: AlphaJumper}
	],

	/**
	* @method
	* @private
	*/
	initComponents: function () {
		this.createChrome(this.scrollTools);
		List.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @method
	* @private
	*/
	rendered: function () {
		List.prototype.rendered.apply(this, arguments);
		this.centerJumper();
	},

	/**
	* @method
	* @private
	*/
	handleResize: function () {
		List.prototype.handleResize.apply(this, arguments);
		this.centerJumper();
	},

	/**
	* Vertically centers the {@link module:layout/AlphaJumper~AlphaJumper} control within the scroller.
	*
	* @private
	*/
	centerJumper: function () {
		var b = this.getBounds(), sb = this.$.jumper.getBounds();
		this.$.jumper.applyStyle('top', ((b.height - sb.height) / 2) + 'px');
	}
});
