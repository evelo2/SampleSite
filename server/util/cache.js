const Log = require('./logUtil');

class Cache {
    constructor(cacheData, log) {
        this.log = log || new Log('Cache');
        this.cacheData = cacheData || {};
        this.useCaching = true;
    }

    /**
     * Usage:
     * const cache = require('./cache').init();
     * @param {Object} cacheData - Optional if you want to share a cache object.  
     * @param {Log} log - Optional if sharing Log  
     */
    static init(cacheData, log) {
        return new Cache(cacheData, log);
    }

    useCaching() {
        this.useCaching = true;
        this.log.debug('caching enabled.');
    }

    disableCaching() {
        this.useCaching = false;
        this.log.debug('caching disabled.');
    }

    getCacheStats() {
        const curKeys = Object.keys(this.cacheData);
        return {
            enabled: this.useCaching,
            size: curKeys.length,
            keys: curKeys
        };
    }

    displayCacheStats() {
        const stats = this.getCacheStats();
        return [
            'Cache Stats',
            `Caching engine enabled: ${stats.enabled}`,
            `Cache Size: ${stats.size}`  
        ].concat(stats.keys);
    }

    /**
     * Provides ExpressJS compliant middleware for caching. 
     * Usage:
     * const cache = require('./cache').init();
     * app.use(cache.getMiddleware());
     * 
     * NOTE: This will cache everything dynamic. 
     * To avoid caching certain roots.
     * When processing your request. 
     * 
     * req.useCaching = false;
     *  
     */
    getMiddleware() {
        return (req, res, next) => {
            if (this.useCaching === false) {
                next();
                return;
            }
            // this.log.debug(`${req.url} - ${req.method}`);
            if (req.method !== 'GET') {
                this.log.debug(`Request - ${req.url} is not of type GET`);
                next();
                return;
            }

            const key = encodeURI(req.url);
            if (this.cacheData[key]) {
                this.log.debug(`Servering ${key} from cache.`);
                res.send(this.cacheData[key]);
            } else {
                req.useCaching = true; // Set this to false in the route to disable cache.
                this.log.debug(`Not found in cache: ${key}`);
                res.sendResponse = res.send;
                res.send = (body) => {
                    if (req.useCaching === true) {
                        this.cacheData[key] = body;
                    }
                    res.sendResponse(body);
                };
                next();
            }
        };
    }

    /**
     * Insert this middleware to prevent a route from being cached. 
     */
    static getNoCacheMiddleware() {
        return (req, res, next) => {
            req.useCaching = false;
            next();
        };
    }

    clearCache() {
        Object.keys(this.cacheData)
        .forEach(key => delete this.cacheData[key]);
        this.log.debug(`Cache cleared - current size ${this.getSize()}`);
    }

    removeFromCache(key) {
        if (this.cacheData.hasOwnProperty(key)) {
            delete this.cacheData[key];            
        }
    }

    getSize() {
        return Object.keys(this.cacheData).length;
    }
}

module.exports = Cache;
