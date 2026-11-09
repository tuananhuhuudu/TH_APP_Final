import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import {formatRelativeTime} from '../../utils/format';
import {colors, radius, spacing} from '../../theme';
import type {AppNotification} from '../../types';

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Chào mừng bạn đến với ứng dụng',
    body: 'Tài khoản của bạn đã được tạo thành công. Hãy vào Danh bạ để bắt đầu trò chuyện.',
    createdAt: Date.now() - 2 * 60 * 1000,
    read: false,
  },
  {
    id: 'n2',
    title: 'Mẹo: chia sẻ vị trí',
    body: 'Trong màn hình Chat, nhấn biểu tượng 📍 để gửi vị trí hiện tại của bạn.',
    createdAt: Date.now() - 45 * 60 * 1000,
    read: false,
  },
  {
    id: 'n3',
    title: 'Bảo mật tài khoản',
    body: 'Không chia sẻ mật khẩu với người khác. Đăng xuất khi dùng máy chung.',
    createdAt: Date.now() - 26 * 60 * 60 * 1000,
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<AppNotification[]>(SEED_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter(item => !item.read).length,
    [notifications],
  );

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? {...item, read: true} : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({...item, read: true})));
  };

  const renderItem = ({item}: {item: AppNotification}) => (
    <Pressable
      onPress={() => markAsRead(item.id)}
      style={({pressed}) => [
        styles.row,
        !item.read && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}>
      <View style={[styles.dot, item.read && styles.dotRead]} />

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text
            style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}
            numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead} hitSlop={8}>
            <Text style={styles.markAll}>Đánh dấu đã đọc</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <EmptyState
            icon="🔔"
            title="Chưa có thông báo"
            message="Các thông báo mới sẽ xuất hiện tại đây."
          />
        }
      />
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
  markAll: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  rowUnread: {
    backgroundColor: '#EFF6FF',
  },
  rowPressed: {
    opacity: 0.75,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: spacing.xs + 1,
  },
  dotRead: {
    backgroundColor: colors.border,
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
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  rowTitleUnread: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
  },
  body: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
