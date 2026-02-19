import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {tokens} from '@/theme';

export interface AlertModalConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

interface AlertModalRef {
  show: (config: AlertModalConfig) => void;
  hide: () => void;
}

export const AlertModalContext = React.createContext<{
  alertModal: React.RefObject<AlertModalRef>;
  showAlert: (config: AlertModalConfig) => void;
} | null>(null);

export const useAlertModal = () => {
  const context = React.useContext(AlertModalContext);
  if (!context) {
    throw new Error('useAlertModal must be used within AlertModalProvider');
  }
  return context.showAlert;
};

export const AlertModal = React.forwardRef<AlertModalRef, {}>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertModalConfig>({
    title: '',
    message: '',
    type: 'info',
  });

  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  const show = (newConfig: AlertModalConfig) => {
    setConfig(newConfig);
    setVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const hide = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'success':
        return tokens.color.state.success;
      case 'error':
        return tokens.color.state.error;
      case 'warning':
        return tokens.color.state.warning;
      default:
        return tokens.color.brand.primary;
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const typeColor = getTypeColor(config.type);
  const typeIcon = getTypeIcon(config.type);

  const defaultButtons = [
    {
      text: 'OK',
      onPress: hide,
      style: 'default' as const,
    },
  ];

  const buttons = config.buttons ?? defaultButtons;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hide}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={[styles.headerIcon, {backgroundColor: `${typeColor}20`}]}>
            <Ionicons name={typeIcon} size={32} color={typeColor} />
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>

          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.buttonDestructive,
                  button.style === 'cancel' && styles.buttonCancel,
                  buttons.length > 1 &&
                    index > 0 && {marginLeft: tokens.spacing.md},
                ]}
                onPress={() => {
                  button.onPress();
                  hide();
                }}>
                <Text
                  style={[
                    styles.buttonText,
                    button.style === 'destructive' && styles.buttonTextDestructive,
                    button.style === 'cancel' && styles.buttonTextCancel,
                  ]}>
                  {button.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
});

AlertModal.displayName = 'AlertModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  container: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    maxWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    color: tokens.text.primary,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: tokens.typography.size.md,
    color: tokens.text.secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: tokens.surface.base,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  buttonDestructive: {
    backgroundColor: tokens.color.state.error,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: tokens.typography.size.md,
  },
  buttonTextCancel: {
    color: tokens.text.primary,
  },
  buttonTextDestructive: {
    color: '#fff',
  },
});
