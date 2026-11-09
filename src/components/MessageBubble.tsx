import React from 'react';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '../theme';
import {formatTime} from '../utils/format';
import {buildMapsUrl} from '../services/locationService';
import type {Message} from '../types';

interface Props {
  message: Message;
  isMine: boolean;
}

export default function MessageBubble({message, isMine}: Props) {
  const isLocation =
    message.type === 'location' &&
    typeof message.latitude === 'number' &&
    typeof message.longitude === 'number';

  const openInMaps = () => {
    if (!isLocation) {
      return;
    }
    Linking.openURL(buildMapsUrl(message.latitude!, message.longitude!)).catch(
      () => {
      },
    );
  };

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      <View
        style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleTheirs,
        ]}>
        {isLocation ? (
          <Pressable onPress={openInMaps}>
            <Text
              style={[
                styles.locationTitle,
                isMine ? styles.textMine : styles.textTheirs,
              ]}>
              📍 Vị trí của tôi
            </Text>
            <Text
              style={[
                styles.coordinates,
                isMine ? styles.textMine : styles.textTheirs,
              ]}>
              {message.latitude!.toFixed(6)}, {message.longitude!.toFixed(6)}
            </Text>
            <Text style={[styles.openHint, isMine && styles.openHintMine]}>
              Nhấn để mở Google Maps
            </Text>
          </Pressable>
        ) : (
          <Text
            style={[
              styles.text,
              isMine ? styles.textMine : styles.textTheirs,
            ]}>
            {message.text}
          </Text>
        )}

        <Text style={[styles.time, isMine ? styles.timeMine : styles.timeTheirs]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowTheirs: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleMine,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: colors.bubbleTheirs,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMine: {
    color: colors.textInverse,
  },
  textTheirs: {
    color: colors.text,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  openHint: {
    fontSize: 12,
    marginTop: spacing.xs,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  openHintMine: {
    color: colors.primarySoft,
  },
  time: {
    fontSize: 11,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.75)',
  },
  timeTheirs: {
    color: colors.textMuted,
  },
});
