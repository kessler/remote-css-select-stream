var expect = require('chai').expect
var rcss = require('./index.js')
var through2 = require('through2')

describe('remote-css-select-stream', function () {

	it('emit a stream of elements', function (done) {
		this.timeout(10000)
		var results = []

		rcss({ 
			url: 'https://github.com/kessler/remote-css-select-stream', 
			selector: 'a.js-directory-link',
			filter: '.+\\.js'
		})
		.pipe(through2(function (c, e, cb) {
			results.push(c.toString())
			setTimeout(cb, 500)
		}))

		setTimeout(function () {
			expect(results).to.have.length(3)
			expect(results).to.deep.equal([ 'index.js', 'package.json', 'test.js' ])
			done()
		}, 5000)
	})
})