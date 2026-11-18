/**
* A port of upstream's `tree/samples/TreeSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* A file tree built from nested `Node`s: tap a folder to expand or collapse it
* (the handler swaps its icon to match), tap a leaf to select it, and the
* `Selection` component paints the selected caption blue and clears the one
* before it.
*
* @module layout/samples/TreeSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';
import Selection from 'enyo/src/Selection.js';

import FittableRows from 'layout/src/FittableRows.js';
import Node from 'layout/src/Node/Node.js';

/**
* @class TreeSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.TreeSample',
	classes: 'enyo-unselectable enyo-fit',
	kind: FittableRows,
	fit: true,
	components: [
		{kind: Selection, onSelect: 'select', onDeselect: 'deselect'},
		{kind: Scroller, fit: true, components: [
			{kind: Node, icon: 'assets/folder-open.png', content: 'Tree', expandable: true, expanded: true, onExpand: 'nodeExpand', onNodeTap: 'nodeTap', components: [
				{icon: 'assets/file.png', content: 'Alpha'},
				{icon: 'assets/folder-open.png', content: 'Bravo', expandable: true, expanded: true, components: [
					{icon: 'assets/file.png', content: 'Bravo-Alpha'},
					{icon: 'assets/file.png', content: 'Bravo-Bravo'},
					{icon: 'assets/file.png', content: 'Bravo-Charlie'}
				]},
				{icon: 'assets/folder.png', content: 'Charlie', expandable: true, components: [
					{icon: 'assets/file.png', content: 'Charlie-Alpha'},
					{icon: 'assets/file.png', content: 'Charlie-Bravo'},
					{icon: 'assets/file.png', content: 'Charlie-Charlie'}
				]},
				{icon: 'assets/folder-open.png', content: 'Delta', expandable: true, expanded: true, components: [
					{icon: 'assets/file.png', content: 'Delta-Alpha'},
					{icon: 'assets/file.png', content: 'Delta-Bravo'},
					{icon: 'assets/file.png', content: 'Delta-Charlie'}
				]},
				{icon: 'assets/file.png', content: 'Epsilon'}
			]}
		]}
	],

	/**
	* @private
	*/
	nodeExpand: function (inSender, inEvent) {
		inSender.setIcon('assets/' + (inSender.expanded ? 'folder-open.png' : 'folder.png'));
	},

	/**
	* @private
	*/
	nodeTap: function (inSender, inEvent) {
		var node = inEvent.originator;
		this.$.selection.select(node.id, node);
	},

	/**
	* @private
	*/
	select: function (inSender, inEvent) {
		inEvent.data.$.caption.applyStyle('background-color', 'lightblue');
	},

	/**
	* @private
	*/
	deselect: function (inSender, inEvent) {
		inEvent.data.$.caption.applyStyle('background-color', null);
	}
});
