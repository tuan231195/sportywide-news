import { getCleanedHTML } from 'src/news/utils';

describe('#getCleanedHtml', () => {
	it('should strip style and css', () => {
		expect(
			getCleanedHTML(
				'<div class="test" style="align-content: center">Hello</div>'
			)
		).toEqual('<div>Hello</div>');
	});

	it('should strip data attributes', () => {
		expect(getCleanedHTML('<div data-test="test">Hello</div>')).toEqual(
			'<div>Hello</div>'
		);
	});
});
