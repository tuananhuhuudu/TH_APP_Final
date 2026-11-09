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
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import {useCurrentUser} from '../../context/AuthContext';
import {subscribeUsers} from '../../services/userService';
import {formatLastSeen} from '../../utils/format';
import {colors, radius, spacing} from '../../theme';
import type {AppStackParamList} from '../../navigation/types';
import type {AppUser} from '../../types';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

export default function ContactsScreen() {
  const currentUser = useCurrentUser();
  const navigation = useNavigation<Navigation>();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeUsers(currentUser.uid, nextUsers => {
      setUsers(nextUsers);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser.uid]);

  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    if (!term) {
      return users;
    }
    return users.filter(
      user =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [users, keyword]);

  const onlineCount = useMemo(
    () => users.filter(user => user.online).length,
    [users],
  );

  const openChat = (user: AppUser) => {
    navigation.navigate('Chat', {
      partnerUid: user.uid,
      partnerName: user.fullName,
    });
  };

  const renderItem = ({item}: {item: AppUser}) => (
    <Pressable
      onPress={() => openChat(item)}
      style={({pressed}) => [styles.row, pressed && styles.rowPressed]}>
      <Avatar fullName={item.fullName} online={item.online} />

      <View style={styles.rowBody}>
        <Text style={styles.name} numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text
          style={[styles.status, item.online && styles.statusOnline]}
          numberOfLines={1}>
          {item.online ? 'Đang hoạt động' : formatLastSeen(item.lastSeen)}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh bạ</Text>
        <View style={styles.onlinePill}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlinePillText}>{onlineCount} đang online</Text>
        </View>
      </View>

      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm theo tên hoặc email..."
      />

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.uid}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={
            filtered.length === 0 ? styles.emptyContainer : undefined
          }
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            keyword.trim() ? (
              <EmptyState
                icon="🔍"
                title="Không tìm thấy"
                message={'Không có người dùng nào khớp với "' + keyword + '".'}
              />
            ) : (
              <EmptyState
                icon="👥"
                title="Chưa có người dùng khác"
                message="Hãy đăng ký thêm một tài khoản trên máy ảo thứ hai để thử chat."
              />
            )
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
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.online,
  },
  onlinePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
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
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  status: {
    fontSize: 13,
    color: colors.textMuted,
  },
  statusOnline: {
    color: colors.online,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 26,
    color: colors.textMuted,
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
