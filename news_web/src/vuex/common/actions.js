import dataCenter from '@/store/index.js';

const setNavInfo = function({commit, state}, {navInfo}) {
    /*commit({
        type: 'SETCHANNELINFO',
        payload: {channels: navInfo.channelList}
    });*/
    commit({
        type: 'SETADSINFO',
        payload: {adConfig: navInfo.adList}
    });
};

const setXiGuangNavInfo = ({commit, dispatch, state}, params) => {
	return new Promise((resolve, reject) => {
        dataCenter.xiGuangNavInfo(params).then((data) => {
        	commit({
        		type: 'SETXIGUANGCHANNELS',
        		payload: {channels: data}
        	});

        }, (status) => {
            reject(status);
        });
    });
}

export default {setNavInfo, setXiGuangNavInfo};
