import smoothscroll from "smoothscroll-polyfill"

const polyfills = () => {
    // Polyfill for window.scrollTo({ behavior: "smooth" })
    smoothscroll.polyfill()

    // Polyfill for Object Assign
    if (typeof Object.assign != "function") {
        // eslint-disable-next-line no-extend-native
        Object.assign = function (target, varArgs) {
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError(
                    "Cannot convert undefined or null to object"
                )
            }

            var to = Object(target)

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index]

                if (nextSource != null) {
                    // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (
                            Object.prototype.hasOwnProperty.call(
                                nextSource,
                                nextKey
                            )
                        ) {
                            to[nextKey] = nextSource[nextKey]
                        }
                    }
                }
            }
            return to
        }
    }

    // Polyfill for .includes method on string
    if (!String.prototype.includes) {
        // eslint-disable-next-line no-extend-native
        String.prototype.includes = function (search, start) {
            if (search instanceof RegExp) {
                throw TypeError("first argument must not be a RegExp")
            }
            if (start === undefined) {
                start = 0
            }
            return this.indexOf(search, start) !== -1
        }
    }

    // Polyfill for the array .fill method
    if (!Array.prototype.fill) {
        // eslint-disable-next-line no-extend-native
        Object.defineProperty(Array.prototype, "fill", {
            value: function (value) {
                // Steps 1-2.
                if (this == null) {
                    throw new TypeError("this is null or not defined")
                }

                var O = Object(this)

                // Steps 3-5.
                var len = O.length >>> 0

                // Steps 6-7.
                var start = arguments[1]
                var relativeStart = start >> 0

                // Step 8.
                var k =
                    relativeStart < 0
                        ? Math.max(len + relativeStart, 0)
                        : Math.min(relativeStart, len)

                // Steps 9-10.
                var end = arguments[2]
                var relativeEnd = end === undefined ? len : end >> 0

                // Step 11.
                var final =
                    relativeEnd < 0
                        ? Math.max(len + relativeEnd, 0)
                        : Math.min(relativeEnd, len)

                // Step 12.
                while (k < final) {
                    O[k] = value
                    k++
                }

                // Step 13.
                return O
            },
        })
    }

    if (!String.prototype.includes) {
        /* eslint-disable-next-line */
        String.prototype.includes = function () {
            /* eslint-disable-next-line */
            "use strict"
            return String.prototype.indexOf.apply(this, arguments) !== -1
        }
    }
}

export { polyfills }
