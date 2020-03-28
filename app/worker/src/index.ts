import { processStream } from 'src/process';
import { NEWS_CONSUMER_PREFIX } from '@vdtn359/news-schema';

processStream(`${NEWS_CONSUMER_PREFIX}-1`);
