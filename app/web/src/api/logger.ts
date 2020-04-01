import util from 'util';
export function logger(request) {
	return async (req: Request, res: Response) => {
		try {
			await request(req, res);
		} catch (err) {
			if (err.name === 'ResponseError') {
				return handleElasticSearchError(err, res);
			}
			throw err;
		}
	};
}

function handleElasticSearchError(err, res) {
	console.log(
		'Elastic search error',
		util.inspect(err.meta, {
			depth: null,
		})
	);
	res.status(500).send('Internal server error');
}
