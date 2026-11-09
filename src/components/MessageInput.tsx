import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors, radius, spacing} from '../theme';

interface Props {
  onSendText: (text: string) => void;
  onSendLocation: () => void;
  sendingLocation?: boolean;
}

export default function MessageInput({
  onSendText,
  onSendLocation,
  sendingLocation = false,
}: Props) {
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSendText(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onSendLocation}
        disabled={sendingLocation}
        style={({pressed}) => [
          styles.iconButton,
          pressed && styles.pressed,
          sendingLocation && styles.disabled,
        ]}>
        {sendingLocation ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.icon}>📍</Text>
        )}
      </Pressable>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Nhập tin nhắn..."
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={1000}
      />

      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={({pressed}) => [
          styles.sendButton,
          !canSend && styles.disabled,
          pressed && canSend && styles.pressed,
        ]}>
        <Text style={styles.sendIcon}>➤</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  icon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.textInverse,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
});
