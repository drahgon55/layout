/**
* A port of upstream's `panels/samples/PanelsFlickrSample.js` (enyojs/layout,
* tag `2.5.1-release`) to ES modules.
*
* A responsive master/detail app in one file, and the best argument for
* `CollapsingArranger`: a list panel and a picture panel. Wide, both show at
* once and tapping a thumbnail just swaps the picture; narrow -- which
* `Panels.isScreenNarrow()` decides -- the list collapses, tapping a thumbnail
* slides the picture panel over it, and `reflow` reveals a Back toolbar to get
* you out. Resize the window across 800px and watch it switch modes.
*
* Upstream's Flickr key is dead, so the fetch comes back empty and
* `searchResults` falls back to local images; see `FlickrFallback.js`.
*
* @module layout/samples/PanelsFlickrSample
*/

import kind from 'enyo/src/kind.js';
import Component from 'enyo/src/Component.js';
import Img from 'enyo/src/Image/Image.js';
import JsonpRequest from 'enyo/src/Jsonp.js';

import FittableRows from 'layout/src/FittableRows.js';
import FittableLayout from 'layout/src/FittableLayout/FittableLayout.js';
import List from 'layout/src/List/List.js';
import Panels from 'layout/src/Panels/Panels.js';
import CollapsingArranger from 'layout/src/CollapsingArranger.js';

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
* @class PanelsFlickrSearch
* @extends module:enyo/Component~Component
* @private
*/
var PanelsFlickrSearch = kind({
	name: 'enyo.sample.PanelsFlickrSearch',
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
	* The thumbnail and full-size URLs were `http://farm...` upstream, which a
	* page served over https would now refuse as mixed content before it ever
	* got as far as the dead key.
	*
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
	* Ours, so a JSONP request that cannot load at all does not leave the
	* sample's spinner up forever.
	*
	* @private
	*/
	processError: function (inSender, inError) {
		this.doResults([]);
	}
});

/**
* @class PanelsFlickrSample
* @extends module:layout/Panels~Panels
* @public
*/
export default kind({
	name: 'enyo.sample.PanelsFlickrSample',
	kind: Panels,
	classes: 'panels-sample-flickr-panels enyo-unselectable enyo-fit',
	arrangerKind: CollapsingArranger,
	components: [
		// `enyo-fit` is ours. An arranger positions its panels absolutely but
		// never gives them a height, so this panel's height was its content's
		// -- which made the `fit: true` on the List below meaningless, left the
		// List unmeasured at its 1,000,000px placeholder height, and so the
		// photo list would not scroll at all. Upstream put `enyo-fit` on the
		// picture panel below for the same reason and missed this one.
		{classes: 'enyo-fit', layoutKind: FittableLayout.Rows, components: [
			{kind: Toolbar, components: [
				{kind: InputDecorator, style: 'width: 90%;', layoutKind: FittableLayout.Columns, components: [
					{name: 'searchInput', fit: true, kind: Input, value: 'Japan', onchange: 'search'},
					{kind: Img, src: 'assets/search-input-search.png', style: 'width: 20px; height: 20px;'}
				]},
				{name: 'searchSpinner', kind: Img, src: 'assets/spinner.gif', showing: false}
			]},
			// Named; upstream relied on enyo auto-naming it `list`.
			{name: 'list', kind: List, fit: true, touch: true, onSetupItem: 'setupItem', components: [
				{name: 'item', style: 'padding: 10px;', classes: 'panels-sample-flickr-item enyo-border-box', ontap: 'itemTap', components: [
					{name: 'thumbnail', kind: Img, classes: 'panels-sample-flickr-thumbnail'},
					{name: 'title', classes: 'panels-sample-flickr-title'}
				]},
				{name: 'more', style: 'background-color: #323232;', components: [
					{kind: Button, content: 'more photos', classes: 'onyx-dark panels-sample-flickr-more-button', ontap: 'more'},
					{name: 'moreSpinner', kind: Img, src: 'assets/spinner.gif', classes: 'panels-sample-flickr-more-spinner'}
				]}
			]}
		]},
		{name: 'pictureView', fit: true, kind: FittableRows, classes: 'enyo-fit panels-sample-flickr-main', components: [
			{name: 'backToolbar', kind: Toolbar, showing: false, components: [
				{kind: Button, content: 'Back', ontap: 'showList'}
			]},
			{fit: true, style: 'position: relative;', components: [
				{name: 'flickrImage', kind: Img, classes: 'enyo-fit panels-sample-flickr-center panels-sample-flickr-image', showing: false, onload: 'imageLoaded', onerror: 'imageLoaded'},
				{name: 'imageSpinner', kind: Img, src: 'assets/spinner-large.gif', classes: 'enyo-fit panels-sample-flickr-center', showing: false}
			]}
		]},
		{name: 'flickrSearch', kind: PanelsFlickrSearch, onResults: 'searchResults'}
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
	* @method
	* @private
	*/
	reflow: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			var backShowing = this.$.backToolbar.showing;
			this.$.backToolbar.setShowing(Panels.isScreenNarrow());
			if (this.$.backToolbar.showing != backShowing) {
				this.$.pictureView.resize();
			}
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
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass('onyx-selected', inSender.isSelected(inEvent.index));
		this.$.thumbnail.setSrc(item.thumbnail);
		this.$.title.setContent(item.title || 'Untitled');
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
	},

	/**
	* @private
	*/
	itemTap: function (inSender, inEvent) {
		if (Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
		this.$.imageSpinner.show();
		var item = this.results[inEvent.index];

		if (item.original == this.$.flickrImage.getSrc()) {
			this.imageLoaded();
		} else {
			this.$.flickrImage.hide();
			this.$.flickrImage.setSrc(item.original);
		}
	},

	/**
	* @private
	*/
	imageLoaded: function () {
		var img = this.$.flickrImage;
		img.removeClass('tall');
		img.removeClass('wide');
		img.show();
		var b = img.getBounds();
		var r = b.height / b.width;
		if (r >= 1.25) {
			img.addClass('tall');
		} else if (r <= 0.8) {
			img.addClass('wide');
		}
		this.$.imageSpinner.hide();
	},

	/**
	* @private
	*/
	showList: function () {
		this.setIndex(0);
	}
});
