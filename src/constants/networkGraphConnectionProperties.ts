/**
 * Contains the Hex, Singular, Plural and the Singular Prefix values for the different node types
 * Light color is calculated by changing the HSLA (L) value to 90%
 */
const networkGraphConnectionProperties = {
    belang: {
        hex: '#D11F3D',
        hexLight: '#f1bcc5',
        singular: 'Belang',
        plural: 'Belangen',
        prefix: 'het',
    },
    maatregel: {
        hex: '#00804D',
        hexLight: '#b3d9c9',
        singular: 'Maatregel',
        plural: 'Maatregelen',
        prefix: 'de',
    },
    beleidsdoel: {
        hex: '#FF6B02',
        hexLight: '#ffd3b3',
        singular: 'beleidsdoel',
        plural: 'Beleidsdoelen',
        prefix: 'het',
    },
    thema: {
        hex: '#847062',
        hexLight: '#dad4d0',
        singular: 'Thema',
        plural: "Thema's",
        prefix: 'het',
    },
    verordening: {
        hex: '#281F6B',
        hexLight: '#bfbcd3',
        singular: 'Verordening',
        plural: 'Verordeningsartikelen',
        prefix: 'de',
    },
    beleidskeuze: {
        hex: '#EFCC36',
        hexLight: '#faf0c3',
        singular: 'Beleidskeuze',
        plural: 'Beleidskeuzes',
        prefix: 'de',
    },
}

export default networkGraphConnectionProperties
