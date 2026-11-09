import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import {useCurrentUser} from '../../context/AuthContext';
import {subscribeChats, getPartnerUid} from '../../services/chatService';
import {subscribeUsers} from '../../services/userService';
import {formatRelativeTime} from '../../utils/format';
import {colors, radius, spacing} from '../../theme';
import type {AppStackParamList} from '../../navigation/types';
import type {AppUser, ChatSummary, ConversationItem} from '../../types';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

export default function HomeScreen() {
  const currentUser = useCurrentUser();
  const navigation = useNavigation<Navigation>();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeChats = subscribeChats(currentUser.uid, nextChats => {
      setChats(nextChats);
      setLoading(false);
    });
    const unsubscribeUsers = subscribeUsers(currentUser.uid, setUsers);

    return () => {
      unsubscribeChats();
      unsubscribeUsers();
    };
  }, [currentUser.uid]);

  const conversations = useMemo<ConversationItem[]>(() => {
    const usersByUid = new Map(users.map(user => [user.uid, user]));

    return chats
      .map(chat => {
        const partnerUid = getPartnerUid(chat.members, currentUser.uid);
        if (!partnerUid) {
          return null;
        }

        const partner = usersByUid.get(partnerUid);
        if (!partner) {
          return null;
        }

        return {
          chatId: chat.chatId,
          partner,
          lastMessage: chat.lastMessage,
          lastMessageAt: chat.lastMessageAt,
          unreadCount: chat.unread?.[currentUser.uid] ?? 0,
        };
      })
      .filter((item): item is ConversationItem => item !== null);
  }, [chats, users, currentUser.uid]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, item) => sum + item.unreadCount, 0),
    [conversations],
  );

  const openChat = (item: ConversationItem) => {
    navigation.navigate('Chat', {
      partnerUid: item.partner.uid,
      partnerName: item.partner.fullName,
    });
  };

  const renderItem = ({item}: {item: ConversationItem}) => {
    const hasUnread = item.unreadCount > 0;

    return (
      <Pressable
        onPress={() => openChat(item)}
        style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
        <Avatar fullName={item.partner.fullName} online={item.partner.online} />

        <View style={styles.rowBody}>
          <View style={styles.rowTop}>
            <Text style={styles.name} numberOfLines={1}>
              {item.partner.fullName}
            </Text>
            <Text style={styles.time}>
              {formatRelativeTime(item.lastMessageAt)}
            </Text>
          </View>

          <View style={styles.rowBottom}>
            <Text
              style={[styles.preview, hasUnread && styles.previewUnread]}
              numberOfLines={1}>
              {item.lastMessage || 'Chưa có tin nhắn'}
            </Text>
            {hasUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tin nhắn</Text>
        {totalUnread > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{totalUnread} chưa đọc</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.chatId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={
            conversations.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            <EmptyState
              icon="💬"
              title="Chưa có cuộc trò chuyện"
              message="Mở tab Danh bạ và chọn một người để bắt đầu nhắn tin."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  headerBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    backgroundColor: colors.background,
  },
  rowBody: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  preview: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textInverse,
  },
  separator: {
    height: 1,
    marginLeft: 76,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
