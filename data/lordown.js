const commentForm = document.getElementById('commentForm')
const msg = document.getElementById('msg')

const createButton = (label, options={}) => {
    const btn = document.createElement('button')
    const classes = options.classes || []

    for (let className of classes) {
	btn.classList.add(className)
    }

    btn.textContent = label
    btn.setAttribute('type', 'button')

    if (options.id) {
	btn.id = options.id
    }

    return btn
}

const setup = (commentForm) => {
    const formActions = commentForm.querySelector('.form-actions')

    const  convertBtn = createButton('Convert', {
	id: 'convert',
	classes: ['btn', 'btn-default']
    })
    convertBtn.addEventListener('click', () => {
	self.port.emit('convert', msg.value)
    })

    formActions.insertBefore(convertBtn, formActions.firstChild)
}

self.port.on('converted', (lorcode) => {
    msg.value = lorcode
})

self.port.on('conversion-error', (error) => {
    const { message, stderr } = error
    console.error('Lordown conversion error:', message,
		  '                  stderr:', stderr)
})

if (commentForm) {
    setup(commentForm)
}
