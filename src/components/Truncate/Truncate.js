import PropTypes from 'prop-types'
import { Component, createRef } from 'react'
import xss from 'xss'

const isServer = () => typeof window === 'undefined'

class Truncate extends Component {
    static propTypes = {
        ellipsis: PropTypes.string,
        debounce: PropTypes.number,
        responsive: PropTypes.bool,
        lines: PropTypes.number,
        portrait: PropTypes.number,
        breakWord: PropTypes.bool,
    }

    static defaultProps = {
        ellipsis: '…',
        debounce: 100,
        responsive: true,
        lines: 2,
        portrait: null,
        breakWord: true,
    }

    paragraph = createRef()

    render() {
        // pass any additional props to the paragraph element
        const passedProps = { ...this.props }
        for (const key of Object.keys(Truncate.propTypes)) {
            delete passedProps[key]
        }

        if (this.props.children) {
            console.error(
                "Truncate: We can't handle react children at the moment.\nYou're %crequired%c to pass dangerouslySetInnerHTML to set contents. Sorry!",
                'font-style:italic',
                'font-style:normal'
            )
            return null
        }
        const { dangerouslySetInnerHTML } = this.props
        const { __html } = dangerouslySetInnerHTML
        const html = { __html: xss(__html) }

        return (
            <span
                ref={this.paragraph}
                {...passedProps}
                dangerouslySetInnerHTML={html}
            />
        )
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.dangerouslySetInnerHTML !==
            this.props.dangerouslySetInnerHTML
        ) {
            this.cached = this.paragraph.current.innerHTML
            this.add()
        }
    }

    componentDidMount() {
        if (!isServer()) {
            this.lines = {
                props: this.props,
                get current() {
                    if (
                        this.props.portrait &&
                        window.innerHeight > window.innerWidth
                    ) {
                        return this.props.portrait
                    }
                    return this.props.lines
                },
            }

            if (this.props.responsive) {
                this.cached = this.paragraph.current.innerHTML
                let debounce
                const listener = function () {
                    clearTimeout(debounce)
                    debounce = setTimeout(
                        function () {
                            this.add()
                        }.bind(this),
                        this.props.debounce
                    )
                }
                this._listener = listener.bind(this)

                window.addEventListener('resize', this._listener, false)
            }

            this.add()
        }
    }

    componentWillUnmount() {
        if (this.props.responsive && this._listener) {
            window.removeEventListener('resize', this._listener, false)
        }
    }

    cached = null

    createProp(element) {
        this.prop = {
            get height() {
                const viewportOffset = element.getBoundingClientRect()

                return parseInt(viewportOffset.bottom - viewportOffset.top, 10)
            },
            get lineheight() {
                let lineh =
                    getComputedStyle(element).getPropertyValue('line-height')
                if (String('normal|initial|inherit').indexOf(lineh) > -1) {
                    //very specific case
                    lineh =
                        parseInt(
                            getComputedStyle(element).getPropertyValue(
                                'font-size'
                            ),
                            10
                        ) + 2
                }
                return parseInt(lineh, 10)
            },
        }
    }

    add() {
        if (this.props.responsive) {
            if (this.paragraph.current.innerHTML !== this.cached) {
                this.paragraph.current.innerHTML = this.cached
            }
        }

        this.createProp(this.paragraph.current)

        if (this.isNotCorrect()) {
            if (
                this.paragraph.current.childNodes.length &&
                this.paragraph.current.childNodes.length > 1
            ) {
                this.handleChilds(this.paragraph.current)
            } else if (
                this.paragraph.current.childNodes.length &&
                this.paragraph.current.childNodes.length === 1 &&
                this.paragraph.current.childNodes[0].nodeType === 3
            ) {
                this.simpleText(this.paragraph.current)
            }
        }
    }

    breakWord(str, str2, fix) {
        const words = str.split(' ')
        words.pop()
        if (fix) {
            words.pop()
        }
        if (!str2) {
            if (words[words.length - 1]) {
                words[words.length - 1] = words[words.length - 1]
                    .replace(/(,$)/g, '')
                    .replace(/(\.$)/g, '')
            }
            words.push(this.conf.ellipsis)
            return words.join(' ')
        } else {
            if (words[words.length - 1]) {
                words[words.length - 1] = words[words.length - 1]
                    .replace(/(,$)/g, '')
                    .replace(/(\.$)/g, '')
                words.push(this.conf.ellipsis)
                return [words.join(' '), str2]
            } else if (!words[words.length - 1] && str2) {
                const st =
                    ' ' +
                    str2.trim().replace(/(,$)/g, '').replace(/(\.$)/g, '') +
                    ' '
                words.push(this.conf.ellipsis)
                return [words.join(' '), st]
            }
        }
    }

    simpleText(element) {
        let childText = element.childNodes[0].nodeValue
        while (this.prop.height > this.prop.lineheight * this.lines.current) {
            element.childNodes[0].nodeValue = childText.slice(0, -1)
            childText = element.childNodes[0].nodeValue
        }
        if (this.props.breakWord) {
            element.childNodes[0].nodeValue =
                childText.slice(0, -this.props.ellipsis.length) +
                this.props.ellipsis
            if (this.isNotCorrect()) {
                //edge case
                element.childNodes[0].nodeValue =
                    ' ' +
                    element.childNodes[0].nodeValue
                        .slice(0, -(this.props.ellipsis.length + 1))
                        .trim()
                        .slice(0, -this.props.ellipsis.length) +
                    this.props.ellipsis
            }
        } else {
            element.childNodes[0].nodeValue = this.breakWord(
                element.childNodes[0].nodeValue
            )
            if (this.isNotCorrect()) {
                //edge case
                element.childNodes[0].nodeValue = this.breakWord(
                    element.childNodes[0].nodeValue,
                    null,
                    true
                )
            }
        }
    }

    isNotCorrect() {
        return this.prop.height > this.prop.lineheight * this.lines.current
    }

    processBreak(dOne, dTwo, fix) {
        const r = this.breakWord(
            dOne.innerHTML || dOne.nodeValue,
            dTwo.innerHTML || dTwo.nodeValue,
            fix
        )
        if (dOne.innerHTML) {
            dOne.innerHTML = r[0]
        } else {
            dOne.nodeValue = r[0]
        }
        if (dTwo.innerHTML) {
            dTwo.innerHTML = r[1]
        } else {
            dTwo.nodeValue = r[1]
        }
    }

    handleChilds(e) {
        const domChilds = e.childNodes
        let childText

        for (let i = domChilds.length - 1; i >= 0; i--) {
            let displayOrigin
            if (domChilds[i].nodeType === 3) {
                displayOrigin = domChilds[i].nodeValue
                domChilds[i].nodeValue = ''
            } else if (domChilds[i].nodeType === 1) {
                displayOrigin = getComputedStyle(domChilds[i]).getPropertyValue(
                    'display'
                )
                domChilds[i].style.display = 'none'
            }

            if (this.prop.height <= this.prop.lineheight * this.lines.current) {
                if (domChilds[i].nodeType === 3) {
                    domChilds[i].nodeValue = displayOrigin
                    childText = domChilds[i].nodeValue
                    while (
                        this.prop.height >
                        this.prop.lineheight * this.lines.current
                    ) {
                        domChilds[i].nodeValue = childText.slice(0, -1)
                        childText = domChilds[i].nodeValue
                    }

                    if (this.props.breakWord) {
                        domChilds[i].nodeValue =
                            childText.slice(0, -this.props.ellipsis.length) +
                            this.props.ellipsis
                        if (this.isNotCorrect()) {
                            //edge case
                            domChilds[i].nodeValue =
                                ' ' +
                                domChilds[i].nodeValue
                                    .slice(0, -this.props.ellipsis.length)
                                    .trim()
                                    .slice(0, -this.props.ellipsis.length)
                            if (domChilds[i].nodeValue.length > 1) {
                                domChilds[i].nodeValue =
                                    domChilds[i].nodeValue.slice(
                                        0,
                                        -this.props.ellipsis.length
                                    ) + this.props.ellipsis
                            } else {
                                continue
                            }
                        }
                    } else {
                        if (
                            !domChilds[i].innerHTML &&
                            !domChilds[i].nodeValue
                        ) {
                            continue
                        }
                        this.processBreak(domChilds[i], domChilds[i - 1])
                        if (this.isNotCorrect()) {
                            //edge case
                            this.processBreak(
                                domChilds[i],
                                domChilds[i - 1],
                                true
                            )
                            if (this.isNotCorrect()) {
                                e.removeChild(domChilds[i])
                                continue
                            }
                        }
                    }
                } else {
                    domChilds[i].style.display = displayOrigin
                    childText = domChilds[i].innerHTML
                    while (
                        this.prop.height >
                        this.prop.lineheight * this.lines.current
                    ) {
                        domChilds[i].innerText = childText.slice(0, -1)
                        childText = domChilds[i].innerText
                    }
                    if (this.props.breakWord) {
                        domChilds[i].innerHTML =
                            childText.slice(0, -this.props.ellipsis.length) +
                            this.props.ellipsis
                        if (this.isNotCorrect()) {
                            //edge case
                            domChilds[i].innerHTML =
                                ' ' +
                                domChilds[i].innerHTML
                                    .slice(0, -this.props.ellipsis.length)
                                    .trim()
                                    .slice(0, -this.props.ellipsis.length)
                            if (domChilds[i].innerHTML.length > 1) {
                                domChilds[i].innerHTML =
                                    domChilds[i].innerHTML.slice(
                                        0,
                                        -this.props.ellipsis.length
                                    ) + this.props.ellipsis
                            } else {
                                continue
                            }
                        }
                    } else {
                        if (
                            !domChilds[i].innerHTML &&
                            !domChilds[i].nodeValue
                        ) {
                            continue
                        }
                        this.processBreak(domChilds[i], domChilds[i - 1])
                        if (this.isNotCorrect()) {
                            //edge case
                            this.processBreak(
                                domChilds[i],
                                domChilds[i - 1],
                                true
                            )
                            if (this.isNotCorrect()) {
                                e.removeChild(domChilds[i])
                                continue
                            }
                        }
                    }
                }
                break
            } else {
                e.removeChild(domChilds[i])
            }
        }
    }
}

export default Truncate
