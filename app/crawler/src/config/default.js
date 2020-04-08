module.exports = {
	db: {
		clientEmail:
			'firebase-adminsdk-wh38a@vdtn359-news-dev.iam.gserviceaccount.com',
		projectId: 'vdtn359-news-dev',
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	},
	redis: {
		host: 'localhost',
		password: '',
	},
	logging: {
		level: 'debug',
	},
};
