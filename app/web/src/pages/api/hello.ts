import { NextApiRequest, NextApiResponse } from 'next';
import { str } from '@vdtn359/news-utils';
import { words } from 'lodash';

export default function request(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json(words(str.getHello()));
}
