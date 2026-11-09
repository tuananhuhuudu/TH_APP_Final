import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Avatar from '../../components/Avatar';
import MessageBubble from '../../components/MessageBubble';
import MessageInput from '../../components/MessageInput';
import EmptyState from '../../components/EmptyState';
import {useCurrentUser} from '../../context/AuthContext';
import {
  getChatId,
  markChatAsRead,
  sendMessage,
  subscribeMessages,
} from '../../services/chatService';
import {subscribeUser} from '../../services/userService';
import {
  getCurrentCoordinates,
  requestLocationPermission,
} from '../../services/locationService';
import {formatLastSeen} from '../../utils/format';
import {colors, spacing} from '../../theme';
import type {AppStackParamList} from '../../navigation/types';
import type {AppUser, Message} from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Chat'>;

export default function ChatScreen({route, navigation}: Props) {
  const {partnerUid, partnerName} = route.params;
  const currentUser = useCurrentUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingLocation, setSendingLocation] = useState(false);

  const listRef = useRef<FlatList<Message>>(null);

  const chatId = useMemo(
    () => getChatId(currentUser.uid, partnerUid),
    [currentUser.uid, partnerUid],
  );

  useEffect(() => {
    const unsubscribe = subscribeMessages(chatId, nextMessages => {
      setMessages(nextMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = subscribeUser(partnerUid, setPartner);
    return unsubscribe;
  }, [partnerUid]);

  useEffect(() => {
    markChatAsRead(chatId, currentUser.uid);
  }, [chatId, currentUser.uid, messages.length]);

  useEffect(() => {
    const displayName = partner?.fullName ?? partnerName;
    const isOnline = partner?.online ?? false;

    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Avatar fullName={displayName} size={36} online={isOnline} />
          <View style={styles.headerTexts}>
            <Text style={styles.headerName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text
              style={[styles.headerStatus, isOnline && styles.headerOnline]}
              numberOfLines={1}>
              {isOnline
                ? 'Đang hoạt động'
                : formatLastSeen(partner?.lastSeen ?? 0)}
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation, partner, partnerName]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({animated: true});
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToEnd();
    }
  }, [messages.length, scrollToEnd]);

  const handleSendText = async (text: string) => {
    try {
      await sendMessage({
        chatId,
        senderId: currentUser.uid,
        receiverId: partnerUid,
        type: 'text',
        text,
      });
    } catch {
      Alert.alert('Không gửi được', 'Kiểm tra kết nối mạng rồi thử lại.');
    }
  };

  const handleSendLocation = async () => {
    setSendingLocation(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Thiếu quyền vị trí',
          'Hãy cấp quyền vị trí trong Cài đặt để gửi vị trí.',
        );
        return;
      }

      const {latitude, longitude} = await getCurrentCoordinates();
      await sendMessage({
        chatId,
        senderId: currentUser.uid,
        receiverId: partnerUid,
        type: 'location',
        text: 'Vị trí của tôi',
        latitude,
        longitude,
      });
    } catch (error: any) {
      Alert.alert('Không gửi được vị trí', error?.message ?? 'Đã có lỗi xảy ra.');
    } finally {
      setSendingLocation(false);
    }
  };

  const renderItem = ({item}: {item: Message}) => (
    <MessageBubble message={item} isMine={item.senderId === currentUser.uid} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.primary}
          />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              messages.length === 0 && styles.emptyContent,
            ]}
            onContentSizeChange={scrollToEnd}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon="👋"
                title="Bắt đầu cuộc trò chuyện"
                message={'Gửi lời chào đầu tiên tới ' + (partner?.fullName ?? partnerName) + '.'}
              />
            }
          />
        )}

        <MessageInput
          onSendText={handleSendText}
          onSendLocation={handleSendLocation}
          sendingLocation={sendingLocation}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  loader: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTexts: {
    gap: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textMuted,
  },
  headerOnline: {
    color: colors.online,
    fontWeight: '600',
  },
});
