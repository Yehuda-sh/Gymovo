// src/screens/plans/create-edit/components/LoadingState.tsx
// מצב טעינה עבור מסך יצירה/עריכה של תוכנית

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../../../../theme/colors';

/**
 * Loading state component for plan creation/editing screen
 */
const LoadingState: React.FC = () => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default LoadingState; 