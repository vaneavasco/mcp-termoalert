import NodeCache from "node-cache";

import { config } from "@/config.js";

/**
 * Singleton cache client based on NodeCache.
 * TTL and other options are configurable via application config.
 */
const cache = new NodeCache({
    // Time-to-live in seconds for each cached value
    stdTTL: config.cacheTTL,
    // Automatically delete expired records at this interval (in seconds)
    checkperiod: Math.ceil((config.cacheTTL || 600) * 0.2),
    // Disable cloning for performance; beware of mutating cached objects
    useClones: false,
});

export { cache };
