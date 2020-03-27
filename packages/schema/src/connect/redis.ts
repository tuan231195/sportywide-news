import Redis from 'ioredis';

export function connectRedis(connectOptions: Redis.RedisOptions) {
	return new Redis(connectOptions);
}
