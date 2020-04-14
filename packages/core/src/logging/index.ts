import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';
import { proxy } from '@vdtn359/news-utils';

const { timestamp, errors, label, printf, splat, metadata } = winston.format;

const print = printf((info) => {
	return normalLog(info);
});

function normalLog(info) {
	const log = `[${info.label}] ${info.timestamp} (${info.level}): ${info.message}`;
	const metadata = formatMetadata(info.metadata);

	return metadata ? `${log}\n${metadata}` : log;
}

function formatMetadata(metadata) {
	if (metadata == undefined) {
		return '';
	}
	if (metadata.jse_info) {
		metadata = metadata.jse_info;
	}
	if (metadata.stack) {
		return metadata.stack;
	}
	metadata =
		metadata && typeof metadata === 'object'
			? JSON.stringify(metadata, undefined, 4)
			: metadata;

	if (metadata === '{}') {
		metadata = '';
	}
	return metadata;
}
export function createLogger(
	category: string,
	level: string,
	{ logzToken }: { logzToken?: string } = {}
) {
	const logger = winston.createLogger({
		level,
		format: winston.format.combine(
			errors({ stack: true }),
			label({ label: category }),
			splat(),
			metadata({
				fillExcept: ['message', 'level', 'timestamp', 'label'],
			}),
			timestamp(),
			print
		),
		transports: [new winston.transports.Console()],
	});

	if (logzToken) {
		logger.add(
			new LogzioWinstonTransport({
				token: logzToken,
				level,
				host: 'listener.logz.io',
				name: 'winston_logzio',
			})
		);
	}
	const logWrapper = new LogWrapper(logger);
	return proxy.wrap(logWrapper, logger);
}

class LogWrapper {
	constructor(private readonly logger: winston.Logger) {}

	log(level: string, message: string, meta: any, ...args) {
		if (typeof meta === 'string' || Array.isArray(meta)) {
			meta = {
				meta,
			};
		}
		this.logger.log(level, message, meta, ...args);
	}

	trace(message: string, meta: any, ...args) {
		this.log('trace', message, meta, ...args);
	}

	debug(message: string, meta: any, ...args) {
		this.log('debug', message, meta, ...args);
	}

	info(message: string, meta: any, ...args) {
		this.log('info', message, meta, ...args);
	}

	warn(message: string, meta: any, ...args) {
		this.log('warn', message, meta, ...args);
	}
}
