import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const CardSection = ({ children, style}) =>
  <View style={{ ...styles.containerStyle, ...style }}>
    {children}
  </View>;

CardSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  style: PropTypes.shape({}),
}

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

export { CardSection };
