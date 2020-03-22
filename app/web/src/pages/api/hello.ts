import { NextApiRequest, NextApiResponse } from 'next';
import { str } from '@vdtn359/news-utils';
import _ from 'lodash';

export default function request(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json(_.words(str.getHello()));
}
