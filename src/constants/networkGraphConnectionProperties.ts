import {
    symbolCircle,
    symbolCross,
    symbolDiamond,
    symbolSquare,
    symbolStar,
    symbolTriangle,
} from 'd3'

const sqrt3 = Math.sqrt(3)

const triangleDown = {
    draw: function (context: any, size: any) {
        const y = -Math.sqrt(size / (sqrt3 * 3))
        context.moveTo(0, -y * 2)
        context.lineTo(-sqrt3 * y, y)
        context.lineTo(sqrt3 * y, y)
        context.closePath()
    },
}

const triangleLeft = {
    draw: function (context: any, size: any) {
        const x = -Math.sqrt(size / (sqrt3 * 3))
        context.moveTo(x * 2, 0)
        context.lineTo(-x, -sqrt3 * x)
        context.lineTo(-x, sqrt3 * x)
        context.closePath()
    },
}

const triangleRight = {
    draw: function (context: any, size: any) {
        const x = -Math.sqrt(size / (sqrt3 * 3))
        context.moveTo(-x * 2, 0)
        context.lineTo(x, -sqrt3 * x)
        context.lineTo(x, sqrt3 * x)
        context.closePath()
    },
}

const xMark = {
    draw: function (context: any, size: any) {
        const r = Math.sqrt(size / 5) / 2
        const pi = Math.PI
        const tau = 2 * pi
        const theta = tau / 8
        const rotatePoint = (x: any, y: any, theta: any) => {
            return [
                Math.cos(theta) * x + -Math.sin(theta) * y, // x
                Math.sin(theta) * x + Math.cos(theta) * y, // y
            ]
        }

        // Use the same construction points as `symbolCross` and rotate 1/8 turn.
        const points = [
            rotatePoint(-3 * r, -r, theta),
            rotatePoint(-r, -r, theta),
            rotatePoint(-r, -3 * r, theta),
            rotatePoint(r, -3 * r, theta),
            rotatePoint(r, -r, theta),
            rotatePoint(3 * r, -r, theta),
            rotatePoint(3 * r, r, theta),
            rotatePoint(r, r, theta),
            rotatePoint(r, 3 * r, theta),
            rotatePoint(-r, 3 * r, theta),
            rotatePoint(-r, r, theta),
            rotatePoint(-3 * r, r, theta),
        ]

        // eslint-disable-next-line prefer-spread
        context.moveTo.apply(context, points.pop())

        for (let i = 0; i < points.length; i++) {
            // eslint-disable-next-line prefer-spread
            context.lineTo.apply(context, points[i])
        }

        context.closePath()
    },
}

/**
 * Contains the Hex, Singular, Plural and the Singular Prefix values for the different node types
 * Light color is calculated by changing the HSLA (L) value to 90%
 */
const networkGraphConnectionProperties = {
    ambities: {
        hex: '#AA0067',
        hexLight: '#e6b3d1',
        singular: 'Ambitie',
        plural: 'Ambities',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: triangleLeft,
    },
    gebiedsprogrammas: {
        hex: '#503D90',
        hexLight: '#e0dbf0',
        singular: 'Gebiedsprogramma',
        plural: "Gebiedsprogramma's",
        prefix: 'het',
        demonstrativePronoun: 'dit',
        symbol: xMark,
    },
    belangen: {
        hex: '#D11F3D',
        hexLight: '#f1bcc5',
        singular: 'Belang',
        plural: 'Belangen',
        prefix: 'het',
        demonstrativePronoun: 'dit',
        symbol: symbolCircle,
    },
    beleidsregels: {
        hex: '#7BADDE',
        hexLight: '#d7e6f5',
        singular: 'Beleidsregel',
        plural: 'Beleidsregels',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: symbolCross,
    },
    beleidsprestaties: {
        hex: '#76BC21',
        hexLight: '#d6ebbc',
        singular: 'Beleidsprestatie',
        plural: 'Beleidsprestaties',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: symbolDiamond,
    },
    maatregelen: {
        hex: '#00804D',
        hexLight: '#b3d9c9',
        singular: 'Maatregel',
        plural: 'Maatregelen',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: triangleRight,
    },
    beleidsdoelen: {
        hex: '#FF6B02',
        hexLight: '#ffd3b3',
        singular: 'beleidsdoel',
        plural: 'Beleidsdoelen',
        prefix: 'het',
        demonstrativePronoun: 'dit',
        symbol: symbolSquare,
    },
    themas: {
        hex: '#847062',
        hexLight: '#dad4d0',
        singular: 'Thema',
        plural: "Thema's",
        prefix: 'het',
        demonstrativePronoun: 'dit',
        symbol: symbolStar,
    },
    verordeningen: {
        hex: '#281F6B',
        hexLight: '#bfbcd3',
        singular: 'Verordening',
        plural: 'Verordeningsartikelen',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: triangleDown,
    },
    beleidskeuzes: {
        hex: '#EFCC36',
        hexLight: '#faf0c3',
        singular: 'Beleidskeuze',
        plural: 'Beleidskeuzes',
        prefix: 'de',
        demonstrativePronoun: 'deze',
        symbol: symbolTriangle,
    },
} as const

export default networkGraphConnectionProperties
