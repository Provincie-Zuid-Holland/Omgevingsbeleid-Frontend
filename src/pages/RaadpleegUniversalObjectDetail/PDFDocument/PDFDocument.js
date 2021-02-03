import React, { Component } from 'react'
// import {
//     Page,
//     Text,
//     View,
//     Image,
//     Document,
//     StyleSheet,
// } from '@react-pdf/renderer'

// PDF Styles & Document
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 30,
        color: '#2d3748',
    },
    section: {
        margin: 10,
        flexGrow: 1,
    },
    text: {
        fontSize: 12,
    },
    title: {
        fontSize: 15,
        marginBottom: 10,
        display: 'block',
    },
})

function PDFContainerViewFieldsBeleidsbeslissing(props) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Image src={process.env.PUBLIC_URL + '/images/logo.png'} />
                    <Text style={styles.title}>{props.objectTitel}</Text>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum pulvinar sollicitudin tellus nec volutpat.
                        Donec id auctor est. Vivamus ac quam metus. Cras urna
                        purus, dignissim quis tincidunt vitae, blandit posuere
                        metus. Vestibulum ante ipsum primis in faucibus orci
                        luctus et ultrices posuere cubilia Curae; Sed congue
                        suscipit lacus, sed eleifend felis mollis nec. Donec
                        maximus egestas eros quis pretium. Quisque sagittis at
                        turpis eget imperdiet. Donec purus ipsum, luctus et
                        elementum ut, aliquet et justo. Aliquam vitae quam sit
                        amet dolor maximus tincidunt. Duis iaculis ullamcorper
                        purus, ut laoreet orci vestibulum vel. Integer ex est,
                        scelerisque sit amet luctus quis, efficitur non tellus.
                        Praesent eget dictum orci, id maximus felis. Sed
                        dignissim tellus vitae leo lacinia, sit amet auctor erat
                        efficitur. Integer quis massa convallis libero dignissim
                        rutrum. Maecenas et eleifend ex, et efficitur dolor.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum pulvinar sollicitudin tellus nec volutpat.
                        Donec id auctor est. Vivamus ac quam metus. Cras urna
                        purus, dignissim quis tincidunt vitae, blandit posuere
                        metus. Vestibulum ante ipsum primis in faucibus orci
                        luctus et ultrices posuere cubilia Curae; Sed congue
                        suscipit lacus, sed eleifend felis mollis nec. Donec
                        maximus egestas eros quis pretium. Quisque sagittis at
                        turpis eget imperdiet. Donec purus ipsum, luctus et
                        elementum ut, aliquet et justo. Aliquam vitae quam sit
                        amet dolor maximus tincidunt. Duis iaculis ullamcorper
                        purus, ut laoreet orci vestibulum vel. Integer ex est,
                        scelerisque sit amet luctus quis, efficitur non tellus.
                        Praesent eget dictum orci, id maximus felis. Sed
                        dignissim tellus vitae leo lacinia, sit amet auctor erat
                        efficitur. Integer quis massa convallis libero dignissim
                        rutrum. Maecenas et eleifend ex, et efficitur dolor.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum pulvinar sollicitudin tellus nec volutpat.
                        Donec id auctor est. Vivamus ac quam metus. Cras urna
                        purus, dignissim quis tincidunt vitae, blandit posuere
                        metus. Vestibulum ante ipsum primis in faucibus orci
                        luctus et ultrices posuere cubilia Curae; Sed congue
                        suscipit lacus, sed eleifend felis mollis nec. Donec
                        maximus egestas eros quis pretium. Quisque sagittis at
                        turpis eget imperdiet. Donec purus ipsum, luctus et
                        elementum ut, aliquet et justo. Aliquam vitae quam sit
                        amet dolor maximus tincidunt. Duis iaculis ullamcorper
                        purus, ut laoreet orci vestibulum vel. Integer ex est,
                        scelerisque sit amet luctus quis, efficitur non tellus.
                        Praesent eget dictum orci, id maximus felis. Sed
                        dignissim tellus vitae leo lacinia, sit amet auctor erat
                        efficitur. Integer quis massa convallis libero dignissim
                        rutrumLorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Vestibulum pulvinar sollicitudin tellus nec
                        volutpat. Donec id auctor est. Vivamus ac quam metus.
                        Cras urna purus, dignissim quis tincidunt vitae, blandit
                        posuere metus. Vestibulum ante ipsum primis in faucibus
                        orci luctus et ultrices posuere cubilia Curae; Sed
                        congue suscipit lacus, sed eleifend felis mollis nec.
                        Donec maximus egestas eros quis pretium. Quisque
                        sagittis at turpis eget imperdiet. Donec purus ipsum,
                        luctus et elementum ut, aliquet et justo. Aliquam vitae
                        quam sit amet dolor maximus tincidunt. Duis iaculis
                        ullamcorper purus, ut laoreet orci vestibulum vel.
                        Integer ex est, scelerisque sit amet luctus quis,
                        efficitur non tellus. Praesent eget dictum orci, id
                        maximus felis. Sed dignissim tellus vitae leo lacinia,
                        sit amet auctor erat efficitur. Integer quis massa
                        convallis libero dignissim rutrum. Maecenas et eleifend
                        ex, et efficitur dolor. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Vestibulum pulvinar
                        sollicitudin tellus nec volutpat. Donec id auctor est.
                        Vivamus ac quam metus. Cras urna purus, dignissim quis
                        tincidunt vitae, blandit posuere metus. Vestibulum ante
                        ipsum primis in faucibus orci luctus et ultrices posuere
                        cubilia Curae; Sed congue suscipit lacus, sed eleifend
                        felis mollis nec. Donec maximus egestas eros quis
                        pretium. Quisque sagittis at turpis eget imperdiet.
                        Donec purus ipsum, luctus et elementum ut, aliquet et
                        justo. Aliquam vitae quam sit amet dolor maximus
                        tincidunt. Duis iaculis ullamcorper purus, ut laoreet
                        orci vestibulum vel. Integer ex est, scelerisque sit
                        amet luctus quis, efficitur non tellus. Praesent eget
                        dictum orci, id maximus felis. Sed dignissim tellus
                        vitae leo lacinia, sit amet auctor erat efficitur.
                        Integer quis massa convallis libero dignissim rutrum.
                        Maecenas et eleifend ex, et efficitur dolor. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Vestibulum
                        pulvinar sollicitudin tellus nec volutpat. Donec id
                        auctor est. Vivamus ac quam metus. Cras urna purus,
                        dignissim quis tincidunt vitae, blandit posuere metus.
                        Vestibulum ante ipsum primis in faucibus orci luctus et
                        ultrices posuere cubilia Curae; Sed congue suscipit
                        lacus, sed eleifend felis mollis nec. Donec maximus
                        egestas eros quis pretium. Quisque sagittis at turpis
                        eget imperdiet. Donec purus ipsum, luctus et elementum
                        ut, aliquet et justo. Aliquam vitae quam sit amet dolor
                        maximus tincidunt. Duis iaculis ullamcorper purus, ut
                        laoreet orci vestibulum vel. Integer ex est, scelerisque
                        sit amet luctus quis, efficitur non tellus. Praesent
                        eget dictum orci, id maximus felis. Sed dignissim tellus
                        vitae leo lacinia, sit amet auctor erat efficitur.
                        Integer quis massa convallis libero dignissim
                        rutrumLorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Vestibulum pulvinar sollicitudin tellus nec
                        volutpat. Donec id auctor est. Vivamus ac quam metus.
                        Cras urna purus, dignissim quis tincidunt vitae, blandit
                        posuere metus. Vestibulum ante ipsum primis in faucibus
                        orci luctus et ultrices posuere cubilia Curae; Sed
                        congue suscipit lacus, sed eleifend felis mollis nec.
                        Donec maximus egestas eros quis pretium. Quisque
                        sagittis at turpis eget imperdiet. Donec purus ipsum,
                        luctus et elementum ut, aliquet et justo. Aliquam vitae
                        quam sit amet dolor maximus tincidunt. Duis iaculis
                        ullamcorper purus, ut laoreet orci vestibulum vel.
                        Integer ex est, scelerisque sit amet luctus quis,
                        efficitur non tellus. Praesent eget dictum orci, id
                        maximus felis. Sed dignissim tellus vitae leo lacinia,
                        sit amet auctor erat efficitur. Integer quis massa
                        convallis libero dignissim rutrum. Maecenas et eleifend
                        ex, et efficitur dolor. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Vestibulum pulvinar
                        sollicitudin tellus nec volutpat. Donec id auctor est.
                        Vivamus ac quam metus. Cras urna purus, dignissim quis
                        tincidunt vitae, blandit posuere metus. Vestibulum ante
                        ipsum primis in faucibus orci luctus et ultrices posuere
                        cubilia Curae; Sed congue suscipit lacus, sed eleifend
                        felis mollis nec. Donec maximus egestas eros quis
                        pretium. Quisque sagittis at turpis eget imperdiet.
                        Donec purus ipsum, luctus et elementum ut, aliquet et
                        justo. Aliquam vitae quam sit amet dolor maximus
                        tincidunt. Duis iaculis ullamcorper purus, ut laoreet
                        orci vestibulum vel. Integer ex est, scelerisque sit
                        amet luctus quis, efficitur non tellus. Praesent eget
                        dictum orci, id maximus felis. Sed dignissim tellus
                        vitae leo lacinia, sit amet auctor erat efficitur.
                        Integer quis massa convallis libero dignissim rutrum.
                        Maecenas et eleifend ex, et efficitur dolor. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Vestibulum
                        pulvinar sollicitudin tellus nec volutpat. Donec id
                        auctor est. Vivamus ac quam metus. Cras urna purus,
                        dignissim quis tincidunt vitae, blandit posuere metus.
                        Vestibulum ante ipsum primis in faucibus orci luctus et
                        ultrices posuere cubilia Curae; Sed congue suscipit
                        lacus, sed eleifend felis mollis nec. Donec maximus
                        egestas eros quis pretium. Quisque sagittis at turpis
                        eget imperdiet. Donec purus ipsum, luctus et elementum
                        ut, aliquet et justo. Aliquam vitae quam sit amet dolor
                        maximus tincidunt. Duis iaculis ullamcorper purus, ut
                        laoreet orci vestibulum vel. Integer ex est, scelerisque
                        sit amet luctus quis, efficitur non tellus. Praesent
                        eget dictum orci, id maximus felis. Sed dignissim tellus
                        vitae leo lacinia, sit amet auctor erat efficitur.
                        Integer quis massa convallis libero dignissim rutrum
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

function PDFContainerViewFieldsBeleidsregel() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
function PDFContainerViewFieldsMaatregel() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
function PDFContainerViewFieldsOpgave() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
function PDFContainerViewFieldsAmbitie() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
function PDFContainerViewFieldsBelang() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
function PDFContainerViewFieldsThema() {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}

class PDFDocument extends Component {
    render() {
        const titelEnkelvoud = this.props.titelEnkelvoud
        const dataObject = true
        const objectTitel = this.props.titel

        if (titelEnkelvoud === 'Beleidskeuze') {
            return (
                <PDFContainerViewFieldsBeleidsbeslissing
                    crudObject={dataObject}
                    objectTitel={objectTitel}
                />
            )
        } else if (titelEnkelvoud === 'Beleidsregel') {
            return (
                <PDFContainerViewFieldsBeleidsregel crudObject={dataObject} />
            )
        } else if (titelEnkelvoud === 'Maatregel') {
            return <PDFContainerViewFieldsMaatregel crudObject={dataObject} />
        } else if (titelEnkelvoud === 'Opgave') {
            return <PDFContainerViewFieldsOpgave crudObject={dataObject} />
        } else if (titelEnkelvoud === 'Ambitie') {
            return <PDFContainerViewFieldsAmbitie crudObject={dataObject} />
        } else if (titelEnkelvoud === 'Belang') {
            return <PDFContainerViewFieldsBelang crudObject={dataObject} />
        } else if (titelEnkelvoud === 'Thema') {
            return <PDFContainerViewFieldsThema crudObject={dataObject} />
        } else {
            return null
        }
    }
}

export default PDFDocument
