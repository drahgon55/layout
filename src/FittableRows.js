/**
* Contains the declaration for the {@link module:layout/FittableRows~FittableRows} kind.
* @module layout/FittableRows
*/

import kind from 'enyo/src/kind.js';

import FittableLayout from './FittableLayout/FittableLayout.js';
var FittableRowsLayout = FittableLayout.Rows;

/**
* {@link module:layout/FittableRows~FittableRows} provides a container in which items are laid out in a
* set	of horizontal rows, with most of the items having natural size, but one
* expanding to fill the remaining space. The one that expands is labeled with
* the attribute `fit: true`.
*
* For more information, see the documentation on
* [Fittables]{@linkplain $dev-guide/building-apps/layout/fittables.html} in the
* Enyo Developer Guide.
*
* @class FittableRows
* @extends module:enyo/Control~Control
* @ui
* @public
*/
export default kind(/** @lends module:layout/FittableRows~FittableRows.prototype */{

	/**
	* @private
	*/
	name: 'enyo.FittableRows',

	/**
	* A {@glossary kind} used to manage the size and placement of child
	* [components]{@link module:enyo/Component~Component}.
	*
	* @type {String}
	* @default ''
	* @private
	*/
	layoutKind: FittableRowsLayout,

	/**
	* By default, items in columns stretch to fit horizontally; set to `true` to
	* avoid this behavior.
	*
	* @type {Boolean}
	* @default false
	* @public
	*/
	noStretch: false
});
