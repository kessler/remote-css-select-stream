var expect = require('chai').expect
var rcss = require('./index.js')
var through2 = require('through2')
var request = require('hyperquest')
var simplyWait = require('simply-wait')
var cp = require('child_process')
var path = require('path')

var REPO = 'https://github.com/kessler/remote-css-select-stream'
var SELECTOR = 'a.js-directory-link'

describe('remote-css-select-stream', function() {

	it('emit a stream of elements', function(done) {
		this.timeout(10000)
		var results = []

		rcss({
				url: REPO,
				selector: SELECTOR,
				filter: '^.+\\.js$'
			})
			.on('end', function() {
				expect(results).to.have.length(2)
				expect(results).to.deep.equal(['index.js', 'test.js'])
				done()
			})
			.pipe(through2(function(c, e, cb) {
				results.push(c.toString())
				cb()
			}))

	})

	it('reuse a single request object for several streams', function(done) {
		this.timeout(10000)
		var results = []

		var req = request(REPO)

		var s1 = rcss({
			request: req,
			selector: SELECTOR,
			filter: '^.+\\.js$'
		})

		var s2 = rcss({
			request: req,
			selector: SELECTOR,
			filter: '^.+\\.md$'
		})

		function onEnd() {
			expect(results).to.deep.eql([ 'README.md', 'index.js', 'test.js' ])
			done()
		}

		function collector(c, e, cb) {
			results.push(c.toString())
			cb()
		}

		var wait = simplyWait(onEnd)

		s1.on('end', wait()).pipe(through2(collector))
		s2.on('end', wait()).pipe(through2(collector))
	})

	it('has a cli', function (done) {
		this.timeout(10000)
		var script = path.resolve(__dirname, 'index.js')
		var command = ['node', script, '--url=' + REPO, ' --selector=' + 'a.js-directory-link', '--filter=^.+\\.js$'].join(' ')
		cp.exec(command, function (err, stdout, stderr) {
			if (err) return done(err)

			var results = stdout.split('\n')

			expect(results).to.deep.eql(['index.js', 'test.js', ''])
			done()
		})
	})
})
