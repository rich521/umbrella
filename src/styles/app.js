export const fontPrimaryColor = '#545454';
const fontSecondaryColor = '#656565';

const styles = {
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: 'white',
    },
    textStyle: {
        temp: {
            color: fontPrimaryColor,
            fontSize: 65,
            marginBottom: 30,
            textAlignVertical: 'top',
        },
        unit: {
            fontSize: 20,
            textAlignVertical: 'top',
        },
        notes: {
            color: fontPrimaryColor,
            fontSize: 20,
            marginBottom: 36,
        },
        question: {
            marginBottom: 12,
            color: fontSecondaryColor,
            fontStyle: 'italic',
        },
        answer: {
            color: fontSecondaryColor,
            fontStyle: 'italic',
        },
    },
    spinnerContainer: {
      backgroundColor: 'white',
      flex: 1,
      padding: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
      position:'relative',
    },
    tempContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
    settingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },
    updateText: {
        fontSize: 10,
    },
  };

  export default styles;
