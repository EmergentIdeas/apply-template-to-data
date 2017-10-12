#! /usr/bin/env node

let tri = require('tripartite')
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs')


let dataFile = argv['d']
let template = argv['t']

if(!dataFile || !template) {
	console.log('Use like: apply-template-to-date -d <data-file.json or JSON object> -t <template-name> [-l <templates-root-location>]')
	return
}

if(template.endsWith('.tri')) {
	template = template.substring(0, template.length - 4)
}

if(!dataFile.startsWith('/') && !dataFile.startsWith('{')) {
	dataFile = './' + dataFile
}

let templateLocation = argv['l']

if(!templateLocation) {
	templateLocation = '.'
}

tri.loaders.push(function(name, callback) {
	fs.readFile(templateLocation + '/' + name + '.tri', function(err, buffer) {
		if(!err) {
			callback(buffer.toString())
		}
		else {
			callback('')
		}
	})
})

if(dataFile.startsWith('{')) {
	// assume it's JSON data
	let data = JSON.parse(dataFile)
	var startTemplate = tri.pt("__::" + template + "__")

	startTemplate.write(data, process.stdout, function() {})
}
else {
	fs.readFile(dataFile, function(err, buffer) {
		if(err) {
			console.log(err)
			throw err;
		}
		let data = JSON.parse(buffer.toString())
		var startTemplate = tri.pt("__::" + template + "__")

		startTemplate.write(data, process.stdout, function() {})
	})
}

