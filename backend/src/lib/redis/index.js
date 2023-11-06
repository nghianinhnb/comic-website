import RedisClient from "ioredis";


export function Redis() {
    if (typeof Redis.instance === 'object') return Redis.instance

    this.isConnected = false
    this.prefix = process.env.HOSTNAME

    // ------------ INIT ----------------
    console.log('Connecting to redis...')
    this.client = new RedisClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    })


    this.client.on('connect', () => {
        console.log('Connected to redis.')
        this.isConnected = true
    })

    this.client.on('error', err => console.error(err))

    this.client.on('reconnecting', (ms) => {
        console.error(`Reconnecting to redis in ${ms}ms.`)
    })

    this.client.on('close', () => {
        console.error('Connection to redis has closed.')
        this.isConnected = false
    })

    this.client.on('end', () => {
        console.error('Connection to redis has closed and no more reconnects will be done.')
    })

    this.getRedisClientOptions = (connectionName, options) => {
        return {
            connectionName: [ 'eInvoice', connectionName ].join(''),
            connectTimeout: 20000,
            password: process.env.REDIS_PASSWORD,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            showFriendlyErrorStack: true,
            ...options
        }
    }
    // -----------------------------------


    // -------------- Redis Function ------------
    this.getValue = (key) => {
        return this.client.get(this.prefix + key)
    }

    this.setValue = async (key, value, expirationMilliseconds) => {
        const result = expirationMilliseconds !== undefined
            ? await this.client.set(this.prefix + key, value, 'PX', expirationMilliseconds)
            : await this.client.set(this.prefix + key, value)

        if (result !== 'OK') throw new Error('Redis set result is not OK.')
    }

    this.increment = (key) => {
        return this.client.incr(this.prefix + key)
    }

    this.exists = (key) => {
        return this.client.exists(this.prefix + key)
    }

    this.setExpiration = (key, s) => {  // seconds
        return this.client.expire(this.prefix + key, s)
    }

    this.deleteKey = (key) => {
        return this.client.del(this.prefix + key)
    }

    this.getObject = async (key) => {
        const value = await this.getValue(key)
        if (!value) return null

        return JSON.parse(value)
    }

    this.setObject = async (key, value, expirationMilliseconds) => {
        return this.setValue(key, JSON.stringify(value), expirationMilliseconds)
    }
    
    this.getFromSet = (key) => {
        return this.client.smembers(this.prefix + key)
    }

    this.addToSet = (key, value) => {
        return this.client.sadd(this.prefix + key, value)
    }

    this.deleteFromSet = (key, value) => {
        return this.client.srem(this.prefix + key, value)
    }

    this.call = (...args) => this.client.call(...args)
    // ------------------------------------------

    Redis.instance = this
}
