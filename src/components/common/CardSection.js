import React from 'react';
import {View} from 'react-native';

const CardSection = (props) => {
  return(
    <View style={[styles.containerStyle,props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle:{
    borderBottomWidth:1,
    padding:20,
    backgroundColor: '#f9f9f9',
    borderColor:'#ddd',
    position:'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
};

export  {CardSection};
