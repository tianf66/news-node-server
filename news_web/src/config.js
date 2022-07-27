let config = {
    urls: {
        ads: '',
    	channleList: '/static/data/list.json',
    	detail: '/static/data/detail.json',
        config: '/static/data/getDistributor.json',
    	relateNews: '/static/data/detailRelate.json',
        isAdForbidden: '',
    }
};

let proxyConfig = {
    urls: {
        ads: '',
        channleList: '/static/data/list.json',
    	detail: '/static/data/detail.json',
        config: '/static/data/getDistributor.json',
    	relateNews: '/static/data/detailRelate.json',
        isAdForbidden: '',
    }
};

let urls;
if(process.env.NODE_ENV == 'development') {
    urls =  proxyConfig;
} else {
    urls =  config;
}
export default urls;
