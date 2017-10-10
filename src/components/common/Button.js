import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {

  const { buttonStyle, textStyle} = styles;

  return (
      <TouchableOpacity onPress = { onPress } style = { buttonStyle }>
        <Text style = { textStyle }> { children } </Text>
      </TouchableOpacity>
  );
};

const styles = {
  buttonStyle : {
    alignSelf:'stretch',
    backgroundColor:'#F5FCFF',
    borderRadius:5,
    borderColor:'#919191',
    borderWidth:2,
    marginTop:20,
    marginLeft:5,
    marginRight:5
  },
  textStyle : {
    alignSelf:'center',
    color:'#919191',
    fontSize:16,
    fontWeight:'600',
    paddingTop:10,
    paddingBottom:10
  }
};

export {Button};
