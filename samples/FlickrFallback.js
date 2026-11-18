/**
* Stand-in photo data for the three samples that fetched theirs from Flickr.
*
* `PanelsFlickrSample`, `ListHorizontalFlickrSample` and `ListPulldownSample`
* all call `flickr.photos.search` with the API key upstream committed in 2015.
* That key no longer exists -- the service answers every request with
*
*     {"stat":"fail","code":100,"message":"Invalid API Key (Key not found)"}
*
* so `response.photos` is undefined, the samples set their list count to 0, and
* all three render their chrome over an empty list. Nothing in them is
* exercisable and nothing says why.
*
* Rather than drop the samples or leave them blank, each one keeps its original
* request exactly as it was and falls back to this when the request comes back
* with no photos. The rows are built from the planet images already in
* `assets/`, so the lists fill, paging works, and the widget each sample exists
* to demonstrate can actually be used. Put a working key back in the sample and
* the real path takes over again -- the fallback only fires on an empty result.
*
* @module layout/samples/FlickrFallback
*/

var planets = [
	'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'
];

/**
* Builds a page of photo records shaped exactly like the ones the samples'
* `processResponse` produces from a Flickr reply: `title`, `thumbnail` and
* `original`.
*
* @param {Number} count - How many records to return.
* @param {Number} [page] - Which page this is, so titles keep counting up
*	across repeated "more" taps instead of restarting at 1.
* @returns {Array} The records.
* @public
*/
export default function fallbackPhotos (count, page) {
	var offset = (page || 0) * count;
	var r = [];
	for (var i = 0; i < count; i++) {
		var name = planets[(offset + i) % planets.length];
		r.push({
			title: 'No Flickr key — ' + name + ' #' + (offset + i + 1),
			thumbnail: 'assets/' + name + '.jpg',
			original: 'assets/' + name + '.jpg'
		});
	}
	return r;
}
