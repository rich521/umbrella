const fontPrimaryColor = '#545454';
const fontSecondaryColor = '#656565';

const styles = {
    container : {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    textStyle : {
        temp: {
            color: fontPrimaryColor,        
            fontSize: 60,
            marginBottom: 30,
        },
        notes: {
            color: fontPrimaryColor,
            fontSize: 20,
            marginBottom: 30,            
        },
        question: {
            marginBottom: 5,
            color: fontSecondaryColor,            
            fontStyle: 'italic',            
        },
        answer: {
            color: fontSecondaryColor,            
            fontStyle: 'italic',            
        },
    },
    spinnerContainer : {
      flex: 1,
      padding: 5,
      justifyContent: 'center',
      position:'relative',
    },
    tempContainer : {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
  };

  export default styles;
  