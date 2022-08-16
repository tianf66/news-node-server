//初始广告index和投放频率index
let popmIndex = 0, showIndex = 0, showPopSlot;

export default {

	SETADS(state, {payload: {adsId, data}}) {
		// Vue.set(obj, 'newProp', 123)
		// state.ads = {...state.ads, [adsId]: data}

		data.adsId = adsId;
		let adsItem = state.ads.filter((ads) => ads.adsId === adsId);
		if(adsItem.length === 0) {
			state.ads.push(data);
		}

	},
	SETPOPINDEX(state, {LOGGERINDEX}) {
		let popAds = {};
		let adsConfig = window.navInfo.ad;
		let popAdsSlot = adsConfig.pop.value ? adsConfig.pop.value.split(',') : null;//广告id;
		let popm = adsConfig.pop.max ? adsConfig.pop.max.split(',') : null; //广告投放频率;
		let pops = adsConfig.pop.interval; //广告投放间隔;
		if(popAdsSlot && LOGGERINDEX % pops == 0) {
			showPopSlot = true;
			showIndex ++;
			if(showIndex > popm[popmIndex]) {
				showIndex = 1;
				if(popm[popmIndex] != '-1') popmIndex ++;
			}
			popAds = {
				slot: popAdsSlot[popmIndex],
				showPopSlot: popAdsSlot[popmIndex] ? showPopSlot : false
			};
			return state.popAds = popAds;
		}
		// console.log(LOGGERINDEX, pops, popm, popmIndex, showIndex, popm[popmIndex], popAds);
	},
	SETPOPADS(state, {showPopSlot}) {
		state.popAds.showPopSlot = showPopSlot;
	},
	SETADHEIGHT(state, {styleHeight}) {
		state.styleHeight = styleHeight;
	}
};
