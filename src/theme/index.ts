import designTokens from './tokens/design-tokens.react-native.json';

export const tokens = {
  color: {
    slate: designTokens.color.slate,
    brand: {
      primary: designTokens.color.amber['500'],
      primaryStrong: designTokens.color.amber['600'],
    },
    state: designTokens.color.state,
    charts: designTokens.color.charts,
  },
  surface: designTokens.surface,
  text: designTokens.text,
  border: designTokens.border,
  spacing: designTokens.spacing,
  radius: designTokens.radius,
  typography: designTokens.typography,
};

export type AppTokens = typeof tokens;
