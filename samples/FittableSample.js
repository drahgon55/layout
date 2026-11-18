/**
* A port of upstream's `fittable/samples/FittableSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* The whole point of Fittable in one page: a `FittableRows` whose bordered
* boxes take their natural height except for the one marked `fit: true`, which
* swallows whatever is left; inside it a `FittableColumns` doing the same
* horizontally. The top row uses `FittableHeaderLayout`, which fits the title
* between the buttons. Resize the window and watch which boxes move and which
* stretch.
*
* @module layout/samples/FittableSample
*/

import kind from 'enyo/src/kind.js';
import Button from 'enyo/src/Button/Button.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableColumns from 'layout/src/FittableColumns.js';
import FittableHeaderLayout from 'layout/src/FittableHeaderLayout.js';

/**
* @class FittableSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.FittableSample',
	kind: FittableRows,
	classes: 'fittable-sample-box enyo-fit',
	components: [
		{layoutKind: FittableHeaderLayout, components: [
			{kind: Button, content: 'Back'},
			{content: 'Fittable Sample', fit: true, style: 'text-align:center'},
			{kind: Button, content: 'Action 1'},
			{kind: Button, content: 'Action 2'}
		]},
		{content: 'Foo<br>Foo', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mtb'},
		{content: 'Foo<br>Foo', allowHtml: true, classes: 'fittable-sample-box fittable-sample-mtb'},
		{kind: FittableColumns, fit: true, classes: 'fittable-sample-box fittable-sample-mtb fittable-sample-o', components: [
			{content: 'Foo', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'Foo', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: 'Fits!', fit: true, classes: 'fittable-sample-box fittable-sample-mlr fittable-sample-o'},
			{content: 'Foo', classes: 'fittable-sample-box fittable-sample-mlr'}
		]},
		{kind: FittableColumns, content: 'Bat', classes: 'fittable-sample-box fittable-sample-mtb enyo-center', components: [
			{content: 'Centered', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: '1', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: '2', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: '3', classes: 'fittable-sample-box fittable-sample-mlr'},
			{content: '4', classes: 'fittable-sample-box fittable-sample-mlr'}
		]}
	]
});
