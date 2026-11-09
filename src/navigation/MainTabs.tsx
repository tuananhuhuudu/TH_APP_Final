import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ContactsScreen from '../screens/contacts/ContactsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import {useUnreadTotal} from '../hooks/useUnreadTotal';
import {colors} from '../theme';
import type {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({icon, focused}: {icon: string; focused: boolean}) {
  return (
    <Text style={[styles.icon, !focused && styles.iconBlurred]}>{icon}</Text>
  );
}

export default function MainTabs() {
  const unreadTotal = useUnreadTotal();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Tin nhắn',
          tabBarIcon: ({focused}) => <TabIcon icon="💬" focused={focused} />,
          tabBarBadge: unreadTotal > 0 ? unreadTotal : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen
        name="ContactsTab"
        component={ContactsScreen}
        options={{
          title: 'Danh bạ',
          tabBarIcon: ({focused}) => <TabIcon icon="👥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarIcon: ({focused}) => <TabIcon icon="🔔" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({focused}) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  icon: {
    fontSize: 20,
  },
  iconBlurred: {
    opacity: 0.5,
  },
  badge: {
    backgroundColor: colors.badge,
    fontSize: 11,
    fontWeight: '700',
  },
});
