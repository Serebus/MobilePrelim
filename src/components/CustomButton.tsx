import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.button];

    // Size
    switch (size) {
      case 'small':
        base.push(styles.sizeSmall);
        break;
      case 'large':
        base.push(styles.sizeLarge);
        break;
      case 'medium':
      default:
        base.push(styles.sizeMedium);
        break;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.push(styles.variantSecondary);
        break;
      case 'outline':
        base.push(styles.variantOutline);
        break;
      case 'danger':
        base.push(styles.variantDanger);
        break;
      case 'ghost':
        base.push(styles.variantGhost);
        break;
      case 'primary':
      default:
        base.push(styles.variantPrimary);
        break;
    }

    if (disabled) {
      base.push(styles.disabled);
    }

    if (style) {
      base.push(style);
    }

    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [styles.text];

    switch (size) {
      case 'small':
        base.push(styles.textSmall);
        break;
      case 'large':
        base.push(styles.textLarge);
        break;
      case 'medium':
      default:
        base.push(styles.textMedium);
        break;
    }

    switch (variant) {
      case 'secondary':
        base.push(styles.textSecondary);
        break;
      case 'outline':
        base.push(styles.textOutline);
        break;
      case 'danger':
        base.push(styles.textDanger);
        break;
      case 'ghost':
        base.push(styles.textGhost);
        break;
      case 'primary':
      default:
        base.push(styles.textPrimary);
        break;
    }

    if (textStyle) {
      base.push(textStyle);
    }

    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#38bdf8' : '#ffffff'}
        />
      ) : (
        <Text style={getTextStyle()}>
          {icon ? `${icon} ` : ''}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  sizeSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  sizeLarge: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    minHeight: 56,
  },
  variantPrimary: {
    backgroundColor: '#2563eb',
  },
  variantSecondary: {
    backgroundColor: '#334155',
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  variantDanger: {
    backgroundColor: '#dc2626',
  },
  variantGhost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 13,
  },
  textMedium: {
    fontSize: 15,
  },
  textLarge: {
    fontSize: 17,
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#f8fafc',
  },
  textOutline: {
    color: '#38bdf8',
  },
  textDanger: {
    color: '#ffffff',
  },
  textGhost: {
    color: '#94a3b8',
  },
});
