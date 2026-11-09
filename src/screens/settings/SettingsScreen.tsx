import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Avatar from '../../components/Avatar';
import AppButton from '../../components/AppButton';
import {useCurrentUser} from '../../context/AuthContext';
import {logoutUser} from '../../services/authService';
import {setOffline} from '../../services/presenceService';
import {subscribeUser} from '../../services/userService';
import {formatRelativeTime} from '../../utils/format';
import {colors, radius, spacing} from '../../theme';
import type {AppUser} from '../../types';

export default function SettingsScreen() {
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeUser(currentUser.uid, setProfile);
    return unsubscribe;
  }, [currentUser.uid]);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất khỏi tài khoản này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await setOffline(currentUser.uid);
            await logoutUser();
          } catch {
            Alert.alert('Lỗi', 'Không đăng xuất được. Vui lòng thử lại.');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const displayName =
    profile?.fullName ?? currentUser.displayName ?? 'Người dùng';
  const email = profile?.email ?? currentUser.email ?? '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cài đặt</Text>

        <View style={styles.profileCard}>
          <Avatar fullName={displayName} size={72} />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Đang hoạt động</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin tài khoản</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã người dùng</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {currentUser.uid}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày tham gia</Text>
            <Text style={styles.infoValue}>
              {profile?.createdAt
                ? formatRelativeTime(profile.createdAt)
                : 'Đang tải...'}
            </Text>
          </View>
        </View>

        <AppButton
          title="Đăng xuất"
          onPress={handleLogout}
          loading={loggingOut}
          variant="danger"
          style={styles.logoutButton}
        />

        <Text style={styles.version}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.online,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
  version: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
