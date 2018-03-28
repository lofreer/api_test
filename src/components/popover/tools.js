import ReactDOM from 'react-dom'
import { isDescendant } from 'utils/dom'

const div = document.createElement('div')
div.style.display = 'none'
document.body.appendChild(div)

const arrow = document.createElement('div')
arrow.className = 'popover-arrow'
div.appendChild(arrow)

const inner = document.createElement('div')
inner.className = 'popover-content'
div.appendChild(inner)

let _tm = null

div.addEventListener('mouseenter', () => {
    if (!_tm) return
    clearTimeout(_tm)
    document.addEventListener('click', clickaway)
})

function clickaway(e) {
    if (isDescendant(div, e.target)) return
    hide(0)
    document.removeEventListener('click', clickaway)
}

function clickaway2(e) {
    hide(0)
    document.removeEventListener('click', clickaway2)
}

export function show(props) {
    const { style, content, className, hide } = props

    div.style.cssText = 'display: none'
    Object.keys(style).forEach(k => {
        div.style[k] = style[k]
    })
    setTimeout(() => {
        div.style.display = 'block'
        div.className = `popover-module ${className}`
    })

    ReactDOM.render(content, inner)

    document.addEventListener('click', hide ? clickaway2 : clickaway)
}

export function hide(delay) {
    delay = typeof delay === 'number' ? delay : 400
    _tm = setTimeout(() => {
        div.style.display = 'none'
        div.className = ''
    }, delay)
}