#!/usr/bin/env node

var request = require('hyperquest')
var through2 = require('through2')
var tr = require('trumpet')()
var debug = require('debug')('remote-css-select-stream')

module.exports = function (opts) {
	var url = opts.url
	if (!url) {
		throw new Error('missing url')
	}

	var selector = opts.selector || 'html'
	var filter = opts.filter

	debug(opts)

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

	tr.selectAll(selector, function (results) {
		debug('selectAll')

		var rs = results.createReadStream()
		
		rs.on('end', function () {
			rs.unpipe(resultStream)
		})

		rs.pipe(resultStream, { end: false })
	})

	request(url).pipe(tr).on('end', function () {
		resultStream.emit('end')
	})

	function fliterStream (chunk, enc, cb) {
		enc = enc === 'buffer' ? undefined : enc
		var entry = chunk.toString(enc)
		
		if (!filter.test(entry)) {
			entry = undefined
		}

		cb(null, entry)
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