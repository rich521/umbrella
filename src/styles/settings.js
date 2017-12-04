import { fontPrimaryColor } from './app';

const styles = {
    settingsContainer: {
        flex:1,
        backgroundColor: '#f9f9f9'
    },
    settingsInner: {
        flex: 1,
        alignItems: 'stretch',
        marginTop: 55,
        marginBottom: 0,
    },
    textStyle: {
        color: fontPrimaryColor,
        fontWeight: '400',
        fontSize: 15,
    },
    underTextStyle: {
        fontWeight: '200',
        fontSize: 11,
        color: '#bababa',
        // fontStyle: 'italic',
    },
};

export default styles;
