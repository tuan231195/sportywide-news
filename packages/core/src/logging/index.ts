import winston from 'winston';

const { timestamp, errors, label, printf, splat } = winston.format;

const print = printf((info) => {
	const log = `[${info.label}] ${info.timestamp} (${info.level}): ${info.message}`;
	return info.stack ? `${log}\n${info.stack}` : log;
});

export function createLogger(category: string, level: string) {
	return winston.createLogger({
		level,
		format: winston.format.combine(
			splat(),
			label({ label: category }),
			errors({ stack: true }), // <-- use errors format
			timestamp(),
			print
		),
		transports: [new winston.transports.Console()],
	});
}
