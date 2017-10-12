#! /usr/bin/env node

let tri = require('tripartite')
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs')


let dataFile = argv['d']
let template = argv['t']

if(!dataFile || !template) {
	console.log('Use like: apply-template-to-date -d <data-file.json> -t <template-name> [-l <templates-root-location>]')
	return
}

if(template.endsWith('.tri')) {
	template = template.substring(0, template.length - 4)
}

if(!dataFile.startsWith('/')) {
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

fs.readFile(dataFile, function(err, buffer) {
	if(err) {
		console.log(err)
		process.exit()
	}
	let data = JSON.parse(buffer.toString())
	var startTemplate = tri.pt("__::" + template + "__")

	startTemplate.write(data, process.stdout, function() {
		
	})
})
