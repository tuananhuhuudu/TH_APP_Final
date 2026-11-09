import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius} from '../theme';
import {getInitials} from '../utils/format';

interface Props {
  fullName: string;
  size?: number;
  online?: boolean;
}

export default function Avatar({fullName, size = 48, online}: Props) {
  const dotSize = Math.max(10, size * 0.28);

  return (
    <View style={{width: size, height: size}}>
      <View
        style={[
          styles.circle,
          {width: size, height: size, borderRadius: size / 2},
        ]}>
        <Text style={[styles.initials, {fontSize: size * 0.38}]}>
          {getInitials(fullName)}
        </Text>
      </View>

      {online !== undefined && (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: online ? colors.online : colors.offline,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
  },
  initials: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
