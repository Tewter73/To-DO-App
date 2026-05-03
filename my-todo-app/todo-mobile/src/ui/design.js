import { MD3LightTheme as PaperDefaultTheme } from 'react-native-paper'
import { Platform } from 'react-native'

export const palette = {
  primary: '#4338CA', // Indigo
  secondary: '#6366F1', // Soft Indigo
  accent: '#10B981', // Emerald
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  danger: '#EF4444',
  success: '#10B981',
}

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
    },
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
    }
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 5,
    },
    web: {
      boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
    }
  }),
}

export const appTheme = {
  ...PaperDefaultTheme,
  roundness: 16,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    background: palette.background,
    surface: palette.surface,
    outline: palette.border,
    onSurface: palette.textPrimary,
    onSurfaceVariant: palette.textSecondary,
    error: palette.danger,
    elevation: {
      ...PaperDefaultTheme.colors.elevation,
      level1: '#FFFFFF',
      level2: '#FFFFFF',
    },
  },
}

export const layout = {
  pagePadding: 24,
  cardRadius: 20,
  gap: 16,
}
