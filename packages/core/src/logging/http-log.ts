import { IncomingMessage, ServerResponse } from 'http';
export class HttpLog {
	constructor(
		private readonly req: IncomingMessage,
		private readonly res: ServerResponse
	) {}

	getMethod() {
		return this.req.method;
	}

	getUrl() {
		return this.req.url;
	}

	getStatus() {
		return this.res.statusCode;
	}

	getHttpVersion() {
		return this.req.httpVersion;
	}

	getReferrer() {
		return this.req.headers['referrer'];
	}

	getUserAgent() {
		return this.req.headers['user-agent'];
	}

	getIP() {
		return (
			this.req.headers['cf-connecting-ip'] ||
			this.req.headers['x-forwarded-for'] ||
			this.req.connection?.remoteAddress ||
			(this.req.socket && this.req.socket.remoteAddress)
		);
	}
}
