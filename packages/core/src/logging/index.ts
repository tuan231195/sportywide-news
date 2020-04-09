import winston from 'winston';
import LogzioWinstonTransport from 'winston-logzio';
import { HttpLog } from 'src/logging/http-log';

const { timestamp, errors, label, printf, splat, metadata } = winston.format;

const print = printf((info) => {
	if (info.metadata?.req && info.metadata?.res) {
		return httpLog(info, new HttpLog(info.metadata.req, info.metadata.res));
	} else {
		return normalLog(info);
	}
});

function httpLog(info, httpLog: HttpLog) {
	const log = `[${info.label}] ${info.timestamp} (${info.level}): ${info.message}`;
	return `${log}\nIP: ${httpLog.getIP()}\nMethod: ${httpLog.getMethod()}\nUrl: ${httpLog.getUrl()}\nHTTP/${httpLog.getHttpVersion()}\nStatus: ${httpLog.getStatus()}\nReferrer: ${httpLog.getReferrer()}\nUser-Agent: ${httpLog.getUserAgent()}\n`;
}

function normalLog(info) {
	const log = `[${info.label}] ${info.timestamp} (${info.level}): ${info.message}`;
	const metadata = formatMetadata(info.metadata);

	return metadata ? `${log}\n${metadata}` : log;
}

function formatMetadata(metadata) {
	if (metadata == undefined) {
		return '';
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

	return logger;
}

export { HttpLog };
