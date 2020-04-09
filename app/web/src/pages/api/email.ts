/*  eslint-disable @typescript-eslint/camelcase */
import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { config } from 'src/setup';
import isEmail from 'validator/es/lib/isEmail';
import createError from 'http-errors';
import nextConnect from '@vdtn359/next-connect';
import { errorLogger } from 'src/api/logging';

const handler = nextConnect({ onError: errorLogger });

handler.post(request);

export default handler;

sgMail.setApiKey(config.email.apiKey);

async function request(req: NextApiRequest, res: NextApiResponse) {
	validate(req.body);
	const msg = {
		to: config.email.adminEmail,
		from: config.email.supportEmail,
		subject: req.body.subject,
		text: getSupportEmail(req.body),
	};
	await sgMail.send(msg);
	res.status(200).send({
		status: 'Success',
	});
}

function validate(body) {
	if (!body.subject?.trim()) {
		throw new createError.BadRequest('Subject is required');
	}

	if (!body.text?.trim()) {
		throw new createError.BadRequest('Body is required');
	}

	if (!body.name?.trim()) {
		throw new createError.BadRequest('Name is required');
	}

	if (!body.email || !isEmail(body.email)) {
		throw new createError.BadRequest('Email is required');
	}
}

function getSupportEmail(body) {
	return `From: ${body.name}
Email: ${body.email}
Message: ${body.text}`;
}
