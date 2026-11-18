/**
* A port of upstream's `list/samples/ListHorizontalFlickrSample.js`
* (enyojs/layout, tag `2.5.1-release`) to ES modules.
*
* `List` with `orient: 'h'`: the same flyweight machinery turned sideways, so
* rows are columns and you scroll left and right. Thumbnails fill it, and the
* last row is a **more** button -- `setupItem` switches that control on only
* for the row with nothing after it (`canGenerate`), which is the trick worth
* reading. Tapping it fetches the next page and appends.
*
* Upstream's Flickr key is dead, so the fetch comes back empty and
* `searchResults` falls back to local images; see `FlickrFallback.js`.
*
* @module layout/samples/ListHorizontalFlickrSample
*/

import kind from 'enyo/src/kind.js';
import Component from 'enyo/src/Component.js';
import Img from 'enyo/src/Image/Image.js';
import JsonpRequest from 'enyo/src/Jsonp.js';

import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import List from 'layout/src/List/List.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

import fallbackPhotos from './FlickrFallback.js';

/**
* A simple component to do a Flickr search. Upstream declared it as a second
* global `enyo.kind` and referred to it by name from the components block; it
* is a module-local constant now.
*
* @class ListHorizontalFlickrSearch
* @extends module:enyo/Component~Component
* @private
*/
var ListHorizontalFlickrSearch = kind({
	name: 'enyo.sample.ListHorizontalFlickrSearch',
	kind: Component,
	published: {
		searchText: ''
	},
	events: {
		onResults: ''
	},
	url: 'https://api.flickr.com/services/rest/',
	pageSize: 200,
	api_key: '2a21b46e58d207e4888e1ece0cb149a5',

	/**
	* @private
	*/
	search: function (inSearchText, inPage) {
		this.searchText = inSearchText || this.searchText;
		var i = (inPage || 0) * this.pageSize;
		var params = {
			method: 'flickr.photos.search',
			format: 'json',
			api_key: this.api_key,
			per_page: this.pageSize,
			page: i,
			text: this.searchText
		};
		return new JsonpRequest({url: this.url, callbackName: 'jsoncallback'})
			.response(this, 'processResponse')
			.error(this, 'processError')
			.go(params);
	},

	/**
	* @private
	*/
	processResponse: function (inSender, inResponse) {
		var photos = inResponse.photos ? inResponse.photos.photo || [] : [];
		for (var i = 0, p; (p = photos[i]); i++) {
			var urlprefix = 'https://farm' + p.farm + '.static.flickr.com/' + p.server + '/' + p.id + '_' + p.secret;
			p.thumbnail = urlprefix + '_s.jpg';
			p.original = urlprefix + '.jpg';
		}
		this.doResults(photos);
		return photos;
	},

	/**
	* Ours. A dead key answers with a `stat: fail` body rather than an HTTP
	* error, so `processResponse` normally handles it, but a JSONP request that
	* cannot load at all would otherwise leave the sample's spinner up forever.
	*
	* @private
	*/
	processError: function (inSender, inError) {
		this.doResults([]);
	}
});

/**
* @class ListHorizontalFlickrSample
* @extends module:enyo/Control~Control
* @public
*/
export default kind({
	name: 'enyo.sample.ListHorizontalFlickrSample',
	classes: 'enyo-unselectable enyo-fit list-sample-flickr',
	components: [
		// `enyo-fit` is ours. This block had no height of its own, so the
		// `fit: true` on the List below had nothing to divide and the list came
		// out as a thin strip the height of one thumbnail. Filling the sample,
		// which is itself `enyo-fit`, gives the List the viewport to fill.
		{classes: 'enyo-fit', layoutKind: FittableLayout.Rows, components: [
			{kind: Toolbar, components: [
				{kind: InputDecorator, style: 'width: 90%;', layoutKind: FittableLayout.Columns, components: [
					{name: 'searchInput', fit: true, kind: Input, value: 'Japan', onchange: 'search'},
					{kind: Img, src: 'assets/search-input-search.png', style: 'width: 20px; height: 20px;'}
				]},
				{name: 'searchSpinner', kind: Img, src: 'assets/spinner.gif', showing: false}
			]},
			// Named; upstream relied on enyo auto-naming it `list`.
			//
			// Upstream also put `ontap: 'itemTap'` on the row below and had a
			// `showList` method calling `this.setIndex(0)`. Neither belongs to
			// this sample: `itemTap` is not defined here (an unresolved
			// handler name just bubbles on, so it was inert), and `setIndex`
			// is a Panels method, not a Control one -- both are leftovers from
			// PanelsFlickrSample, which this was copied from. Dropped.
			{name: 'list', kind: List, orient: 'h', fit: true, onSetupItem: 'setupItem', components: [
				{name: 'item', style: 'padding: 10px;', classes: 'list-sample-flickr-item enyo-border-box', components: [
					{name: 'thumbnail', kind: Img, classes: 'list-sample-flickr-thumbnail'}
				]},
				{name: 'more', style: 'padding: 10px;position:absolute', classes: 'list-sample-flickr-more enyo-border-box', components: [
					{kind: Button, content: 'more',  ontap: 'more'},
					{name: 'moreSpinner', kind: Img, src: 'assets/spinner.gif', classes: 'list-sample-flickr-more-spinner'}
				]}
			]}
		]},
		{kind: ListHorizontalFlickrSearch, name: 'flickrSearch', onResults: 'searchResults'}
	],

	/**
	* @method
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.search();
		};
	}),

	/**
	* @private
	*/
	search: function () {
		this.searchText = this.$.searchInput.getValue();
		this.page = 0;
		this.results = [];
		this.$.searchSpinner.show();
		this.$.flickrSearch.search(this.searchText);
	},

	/**
	* The `inResults.length` guard is ours: with upstream's expired key every
	* page comes back empty, so the local stand-in is used instead. See
	* `FlickrFallback.js`.
	*
	* @private
	*/
	searchResults: function (inSender, inResults) {
		this.$.searchSpinner.hide();
		this.$.moreSpinner.hide();
		if (!inResults.length) {
			inResults = fallbackPhotos(40, this.page);
		}
		this.results = this.results.concat(inResults);
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
		return true;
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass('onyx-selected', inSender.isSelected(inEvent.index));
		this.$.thumbnail.setSrc(item.thumbnail);
		this.$.more.canGenerate = !this.results[i + 1];
		return true;
	},

	/**
	* @private
	*/
	more: function () {
		this.page++;
		this.$.moreSpinner.show();
		this.$.flickrSearch.search(this.searchText, this.page);
	}
});
