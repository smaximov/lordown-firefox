/* eslint-env node */
const { data } = require('sdk/self')
const { PageMod } = require('sdk/page-mod')
const { exec } = require('sdk/system/child_process')
const { emit } = require('sdk/event/core')
const { env } = require('sdk/system/environment')
const { prefs } = require('sdk/simple-prefs')

PageMod({
    include: "*.linux.org.ru",
    contentScriptFile: data.url('lordown.js'),
    onAttach: (worker) => {
	worker.port.on('convert', (markdown) => {
	    const lordown = new Lordown()

	    lordown.convert(markdown, (err, lorcode, stderr) => {
		if (err) {
		    return worker.port.emit('conversion-error', {
			message: err.message, stderr: stderr
		    })
		}

		worker.port.emit('converted', lorcode)
	    })
	})
    }
})

function Lordown() {
    const options = {
	env: {
	    LC_ALL: 'ru_RU.UTF-8',
	    LANG: 'ru_RU.UTF-8',
	    PATH: env.PATH
	}
    }

    this.lordown = () =>
	prefs.lordownPath || 'lordown'

    this.convert = (input, done) => {
	const lordown = exec(this.lordown(), options, done)

	emit(lordown.stdin, 'data', input)
	emit(lordown.stdin, 'end')
    }
}
