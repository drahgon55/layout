/**
* A port of upstream's `panels/samples/PanelsSlidingSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* `CollapsingArranger` as an app would actually use it: two 320px `List`
* columns and a `fit: true` body. The lists collapse under each other as the
* window narrows, and you drag the body panel sideways to uncover them -- which
* is the arranger's point, and why both columns are real 1000-row Lists rather
* than placeholders (you can scroll a column while it is partly covered).
*
* The **Realtime** checkbox flips the Panels' `realtimeFit`: off, the fitting
* panel is resized once the drag settles; on, it is resized on every frame of
* the drag.
*
* @module layout/samples/PanelsSlidingSample
*/

import kind from 'enyo/src/kind.js';
import Scroller from 'enyo/src/Scroller/Scroller.js';

import FittableRows from 'layout/src/FittableRows.js';
import List from 'layout/src/List/List.js';
import Panels from 'layout/src/Panels/Panels.js';
import CollapsingArranger from 'layout/src/CollapsingArranger.js';

import Checkbox from 'onyx/src/Checkbox/Checkbox.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

/**
* @class PanelsSlidingSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.PanelsSlidingSample',
	kind: FittableRows,
	classes: 'onyx enyo-fit',
	components: [
		{kind: Toolbar, components: [
			{content: 'Realtime'},
			{kind: Checkbox, onchange: 'checkboxChange'}
		]},
		// Named; upstream relied on enyo auto-naming it `panels` from
		// `enyo.Panels`, which is what `checkboxChange` below wants.
		{name: 'panels', kind: Panels, fit: true, classes: 'panels-sample-sliding-panels', arrangerKind: CollapsingArranger, wrap: false, components: [
			{name: 'left', components: [
				{kind: List, classes: 'enyo-fit', touch: true, count: 1000, onSetupItem: 'setupItem', item: 'item1', components: [
					{name: 'item1', classes: 'panels-sample-sliding-item'}
				]}
			]},
			{name: 'middle', components: [
				{kind: List, classes: 'enyo-fit', touch: true, count: 1000, onSetupItem: 'setupItem', item: 'item2', components: [
					{name: 'item2', classes: 'panels-sample-sliding-item'}
				]}
			]},
			{name: 'body', fit: true, components: [
				{kind: Scroller, classes: 'enyo-fit', touch: true, components: [
					{classes: 'panels-sample-sliding-content', content: 'Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin\' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin\'. Ain\'t shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin\' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin\' cipherin\' maw, wash. Round-up barefoot jest bible rottgut sittin\' trailer shed jezebel. Crop old over poker drinkin\' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin\' snakeoil creosote, old a inbred pudneer, slap dirty cain\'t. Hairy, smokin\', nothin\' highway hootch pigs drinkin\', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin\' had jumpin\' got redblooded gimmie truck shootin\' askin\' hootch. No fat ails fire soap cabin jail, reckon if trespassin\' fixin\' rustle jest liniment. Ya huntin\' catfish shot good bankrupt. Fishin\' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin\' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin\'. Ain\'t shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin\' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin\' cipherin\' maw, wash. Round-up barefoot jest bible rottgut sittin\' trailer shed jezebel. Crop old over poker drinkin\' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin\' snakeoil creosote, old a inbred pudneer, slap dirty cain\'t. Hairy, smokin\', nothin\' highway hootch pigs drinkin\', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin\' had jumpin\' got redblooded gimmie truck shootin\' askin\' hootch. No fat ails fire soap cabin jail, reckon if trespassin\' fixin\' rustle jest liniment. Ya huntin\' catfish shot good bankrupt. Fishin\' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin\' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin\'. Ain\'t shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin\' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin\' cipherin\' maw, wash. Round-up barefoot jest bible rottgut sittin\' trailer shed jezebel. Crop old over poker drinkin\' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin\' snakeoil creosote, old a inbred pudneer, slap dirty cain\'t. Hairy, smokin\', nothin\' highway hootch pigs drinkin\', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin\' had jumpin\' got redblooded gimmie truck shootin\' askin\' hootch. No fat ails fire soap cabin jail, reckon if trespassin\' fixin\' rustle jest liniment. Ya huntin\' catfish shot good bankrupt. Fishin\' sherrif has, fat cooked shed old. Broke, down dumb hospitality firewood chitlins. Has mud tired uncle everlastin\' cold, out. Hauled thar, up thar tar heffer quarrel farmer fish water is. Simple gritts dogs soap give kickin\'. Ain\'t shiney water range, preacher java rent thar go. Skinned wirey tin farm, trespassin\' it, rodeo. Said roped caught creosote go simple. Buffalo butt, jig fried commencin\' cipherin\' maw, wash. Round-up barefoot jest bible rottgut sittin\' trailer shed jezebel. Crop old over poker drinkin\' dirt where tools skinned, city-slickers tools liniment mush tarnation. Truck lyin\' snakeoil creosote, old a inbred pudneer, slap dirty cain\'t. Hairy, smokin\', nothin\' highway hootch pigs drinkin\', barefoot bootleg hoosegow mule. Tax-collectors uncle wuz, maw watchin\' had jumpin\' got redblooded gimmie truck shootin\' askin\' hootch. No fat ails fire soap cabin jail, reckon if trespassin\' fixin\' rustle jest liniment. Ya huntin\' catfish shot good bankrupt. Fishin\' sherrif has, fat cooked shed old.'}
				]}
			]}
		]}
	],

	/**
	* Both lists share this handler; each carries the name of its own row
	* control in `item`, so one handler can fill either.
	*
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		this.$[inSender.item].setContent('This is row number: ' + inEvent.index);
		return true;
	},

	/**
	* @private
	*/
	checkboxChange: function (inSender) {
		this.log();
		this.$.panels.realtimeFit = inSender.getValue();
		return true;
	}
});
