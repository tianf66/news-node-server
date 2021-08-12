import dataCenter from '@/store/index.js';

function filterAd(ads = [], adsId) {
	let filtered = ads.filter((p) => p.adsId === adsId)[0];
	return filtered;
}

const setAds = function({commit, state}, {aid, adsId}) {
	let filteredAd = filterAd(state.ads, adsId);
	if(!filteredAd) {
		dataCenter.getAds(aid).then((data) => {
			data.type && commit({
				type: 'SETADS',
				payload: {
					adsId,
					data
				}
			});
		});
	}
};

export default {
	setAds
};