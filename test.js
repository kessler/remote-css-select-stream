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
		.on('end', function () {
			expect(results).to.have.length(2)
			expect(results).to.deep.equal([ 'index.js', 'package.json' ])
			done()
		})
		.pipe(through2(function (c, e, cb) {
			results.push(c.toString())
			cb()
		}))
	})
})