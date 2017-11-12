import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';

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
    borderColor: '#919191',
    borderWidth: 2,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  textStyle : {
    alignSelf: 'center',
    color: '#919191',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
};

export { Button };
