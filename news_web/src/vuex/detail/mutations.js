import utils from '@/utils/';
export default {

    SETDETAIL(state, {detail}) {
    	state.detailObj = detail;
    },
    CLEARDETAIL(state) {
    	state.detailObj = {};
    },
    SETDETAILPRS(state, {detailPrs}) {
        state.detailPrs = detailPrs;
    },
    SETNEWSRELATE(state, {lists}) {
    	lists.forEach((item) => {

            if(!item.adslot_id) {
                state.newsRelateList.push(item);
            }
    	});
    },
    CLEARNEWSLATE(state) {
    	state.newsRelateList = [];
    }
};