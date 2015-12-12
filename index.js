#!/usr/bin/env node

var request = require('hyperquest')
var through2 = require('through2')
var trumpet = require('trumpet')

var debug = require('debug')('remote-css-select-stream')

module.exports = function (opts) {
	var tr = trumpet()

	var url = opts.url
	var req = opts.request

	if (!url && !req) {
		throw new Error('missing url or request object')
	}

	if (url && typeof url !== 'string') {
		throw new Error('invalid url')
	}

	// TODO check maybe its a stream
	if (req && typeof req !== 'object') {
		throw new Error('invalid request object')
	}

	var selector = opts.selector || 'html'
	var filter = opts.filter

	var resultStream

	if (filter) {
		debug('using filter stream')
		filter = new RegExp(filter)
		resultStream = through2(fliterStream)
	} else {
		debug('using simple stream')
		resultStream = through2(simpleStream)
	}

	resultStream.setMaxListeners(0)

	tr.selectAll(selector, function (el) {
		debug('selectAll')

		var rs = el.createReadStream()

		rs.on('end', function () {
			rs.unpipe(resultStream)
		})

		rs.pipe(resultStream, { end: false })
	})

	tr.on('end', function () {
		debug('tr end')
		resultStream.end()
	})

	req = req || request(url)
	req.pipe(tr)

	tr.resume()

	function fliterStream (chunk, enc, cb) {
		enc = enc === 'buffer' ? undefined : enc
		var entry = chunk.toString(enc)
		
		if (filter.test(entry)) {
			return cb(null, entry)
		}

		cb()
	}

	function simpleStream (chunk, enc, cb) {
		enc = enc === 'buffer' ? undefined : enc
		cb(null, chunk.toString(enc))
	}

	return resultStream
}

if (require.main === module) {
	var argv = require('minimist')(process.argv.slice(2))

	var printStream = through2(function (chunk, enc, cb) {
		console.log(chunk.toString(enc === 'buffer' ? undefined : enc))
		cb()
	})

	try {
		module.exports(argv).pipe(printStream)
	} catch (e) {
		console.error(e)
		console.error('usage: rcss --url=required --selector=optional,css select query --filter=optional,regexp')
	}
}