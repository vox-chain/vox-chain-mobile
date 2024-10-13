import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { ToastShowParams } from 'react-native-toast-message';

export function useToast() {
  const insets = useSafeAreaInsets();

  const commonProps = {
    topOffset: insets.top === 0 ? 15 : insets.top + 10,
    visibilityTime: 2000,
  };

  const error = useCallback(
    (message: string, otherProps: ToastShowParams = {}) =>
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        ...commonProps,
        ...otherProps,
      }),
    []
  );

  const success = useCallback(
    (message: string, otherProps: ToastShowParams = {}) =>
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: message,
        ...commonProps,
        ...otherProps,
      }),
    []
  );

  const info = useCallback(
    (message: string, otherProps: ToastShowParams = {}) =>
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: message,
        ...commonProps,
        ...otherProps,
      }),
    []
  );

  return {
    error,
    success,
    info,
  };
}
