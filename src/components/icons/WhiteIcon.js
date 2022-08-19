import React from 'react';
import { Image, View } from 'react-native';
import { loginStyles } from '../theme/loginTheme';

export const WhiteLogo = () => {
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/LinkDevice/small-warning-icon.png')}
        style={{
          top: -11,
          // left: 10,
          width: 100,
          height: 100,


        }}
      />

    </View>
  );
};
