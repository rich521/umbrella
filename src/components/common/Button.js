import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { fontPrimaryColor } from '../../styles/app';

const Button = ({ onPress, children, iconStyle = false }) => {
  const { buttonStyle, textStyle} = styles;
  return (
      <TouchableOpacity
        onPress={onPress}
        style={iconStyle ? null : buttonStyle}
      >
        <Text style={textStyle}>{children}</Text>
      </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  iconStyle: PropTypes.bool,
}

const styles = {
  buttonStyle: {
    width: 200,
    alignSelf: 'center',
    borderRadius: 5,
    borderColor: fontPrimaryColor,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  textStyle : {
    alignSelf: 'center',
    color: fontPrimaryColor,
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
};

export { Button };
