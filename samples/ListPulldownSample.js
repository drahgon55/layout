/**
* A port of upstream's `list/samples/ListPulldownSample.js` (enyojs/layout, tag
* `2.5.1-release`) to ES modules.
*
* `PulldownList` is `List` with pull-to-refresh. Drag the list down past its
* top and a `Puller` appears below the toolbar reading "Pull down to refresh";
* keep going and it flips to "Release to refresh"; let go and `onPullRelease`
* fires, the puller says "Refreshing...", and when the sample calls
* `completePull()` -- here after a deliberate one-second delay, so the loading
* state is visible -- the list closes back up and re-renders.
*
* Upstream's Flickr key is dead, so the fetch comes back empty and
* `processSearchResults` falls back to local images; see `FlickrFallback.js`.
*
* @module layout/samples/ListPulldownSample
*/

import kind from 'enyo/src/kind.js';
import Img from 'enyo/src/Image/Image.js';
import Ajax from 'enyo/src/Ajax.js';
import JsonpRequest from 'enyo/src/Jsonp.js';

import FittableRows from 'layout/src/FittableRows.js';
import PulldownList from 'layout/src/PulldownList/PulldownList.js';

import Button from 'onyx/src/Button/Button.js';
import Input from 'onyx/src/Input/Input.js';
import InputDecorator from 'onyx/src/InputDecorator.js';
import Toolbar from 'onyx/src/Toolbar/Toolbar.js';

import fallbackPhotos from './FlickrFallback.js';

/**
* @class ListPulldownSample
* @extends module:layout/FittableRows~FittableRows
* @public
*/
export default kind({
	name: 'enyo.sample.ListPulldownSample',
	classes: 'enyo-unselectable enyo-fit onyx',
	kind: FittableRows,
	components: [
		{kind: Toolbar, components: [
			{kind: InputDecorator, components: [
				{name: 'searchInput', kind: Input, value: 'nature', placeholder: 'Enter seach term'},
				{kind: Img, src: 'assets/search-input-search.png', style: 'width: 20px;'}
			]},
			{kind: Button, content: 'search', ontap: 'search'}
		]},
		{name: 'list', kind: PulldownList, classes: 'list-sample-pulldown-list', fit: true, onSetupItem: 'setupItem', onPullRelease: 'pullRelease', onPullComplete: 'pullComplete', components: [
			{style: 'padding: 10px; height:70px', classes: 'list-sample-pulldown-item enyo-border-box', components: [
				{name: 'icon', kind: Img, style: 'float: left; width: 48px; height: 48px; padding: 0 10px 10px 0;'},
				{name: 'name', tag: 'span', style: 'font-weight: bold;'}
			]}
		]}
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
	pullRelease: function () {
		this.pulled = true;
		// add 1 second delay so we can see the loading message
		setTimeout(this.bindSafely(function () {
			this.search();
		}), 1000);
	},

	/**
	* @private
	*/
	pullComplete: function () {
		this.pulled = false;
		this.$.list.reset();
	},

	/**
	* @private
	*/
	search: function () {
		// Capture searchText and strip any whitespace
		var searchText = this.$.searchInput.getValue().replace(/^\s+|\s+$/g, '');
		if (searchText === '') {
			// For whitespace searches, set new content value in order to display placeholder
			this.$.searchInput.setValue(searchText);
			return;
		}
		this.searchFlickr(searchText);
	},

	/**
	* @private
	*/
	searchFlickr: function (inSearchText) {
		var params = {
			method: 'flickr.photos.search',
			format: 'json',
			api_key: '2a21b46e58d207e4888e1ece0cb149a5',
			per_page: 50,
			page: 0,
			text: inSearchText,
			sort: 'date-posted-desc',
			extras: 'url_m'
		}, url = 'https://api.flickr.com/services/rest/';
		if (window.location.protocol === 'ms-appx:') {
			params.nojsoncallback = 1;
			// Use ajax for platforms with no jsonp support (Windows 8)
			new Ajax({url: url, handleAs: 'text'})
				.response(this, 'processAjaxSearchResults')
				.error(this, 'processSearchError')
				.go(params);
		} else {
			new JsonpRequest({url: url, callbackName: 'jsoncallback'})
				.response(this, 'processSearchResults')
				.error(this, 'processSearchError')
				.go(params);
		}
	},

	/**
	* @private
	*/
	processAjaxSearchResults: function (inRequest, inResponse) {
		inResponse = JSON.parse(inResponse);
		this.processSearchResults(inRequest, inResponse);
	},

	/**
	* The `photos` guard is ours. Upstream read `inResponse.photos.photo`
	* straight out, which with the expired key is a TypeError on
	* `undefined.photo` -- the request that runs on load, from `rendered`. The
	* local stand-in fills in when the service returns nothing; see
	* `FlickrFallback.js`.
	*
	* @private
	*/
	processSearchResults: function (inRequest, inResponse) {
		var photos = (inResponse && inResponse.photos && inResponse.photos.photo) || [];
		this.results = photos.length ? photos : this.fallbackResults();
		this.$.list.setCount(this.results.length);
		if (this.pulled) {
			this.$.list.completePull();
		} else {
			this.$.list.reset();
		}
	},

	/**
	* Ours, so a request that cannot load at all does not leave the list stuck
	* in its refreshing state.
	*
	* @private
	*/
	processSearchError: function (inRequest, inError) {
		this.processSearchResults(inRequest, null);
	},

	/**
	* Shaped like a Flickr photo as `setupItem` wants it: `url_m` and `title`.
	* A fresh set each time, so a pull-to-refresh visibly changes the list.
	*
	* @private
	*/
	fallbackResults: function () {
		this.fallbackPage = (this.fallbackPage || 0) + 1;
		return fallbackPhotos(50, this.fallbackPage).map(function (p) {
			return {title: p.title, url_m: p.thumbnail};
		});
	},

	/**
	* @private
	*/
	setupItem: function (inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		if (!item.url_m) {
			return true;
		}
		this.$.icon.setSrc(item.url_m);
		this.$.name.setContent(item.title);
		return true;
	}
});
