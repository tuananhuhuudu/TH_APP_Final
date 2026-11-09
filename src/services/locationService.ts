import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Quyền truy cập vị trí',
      message: 'Ứng dụng cần vị trí của bạn để gửi vào cuộc trò chuyện.',
      buttonPositive: 'Đồng ý',
      buttonNegative: 'Từ chối',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export function getCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        if (error.code === 1) {
          reject(new Error('Bạn đã từ chối quyền vị trí.'));
        } else if (error.code === 2) {
          reject(new Error('Không xác định được vị trí. Hãy bật GPS.'));
        } else if (error.code === 3) {
          reject(new Error('Quá thời gian chờ lấy vị trí. Thử lại nhé.'));
        } else {
          reject(new Error('Không lấy được vị trí.'));
        }
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  });
}

export function buildMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
