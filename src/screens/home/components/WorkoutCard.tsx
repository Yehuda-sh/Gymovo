// src/screens/home/components/WorkoutCard.tsx
// כרטיס אימון עם פרטים מלאים

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { CardLayout, Spacer, Typography } from '../../../components/ui';
import { theme } from '../../../theme';
import { Workout } from '../../../types/workout';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

/**
 * Card component for displaying workout information
 */
const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <CardLayout style={{ marginBottom: theme.spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body">{workout.name}</Typography>
          <Typography variant="caption" color={theme.colors.textSecondary}>
            {new Date(workout.date!).toLocaleDateString('he-IL')}
          </Typography>
        </View>

        <Spacer size="sm" />

        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.md,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.xs,
            }}
          >
            <Ionicons
              name="barbell-outline"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {workout.exercises?.length || 0} תרגילים
            </Typography>
          </View>

          {workout.duration && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Typography variant="caption" color={theme.colors.textSecondary}>
                {workout.duration} דקות
              </Typography>
            </View>
          )}

          {workout.rating && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
            >
              <Ionicons name="star" size={14} color={theme.colors.warning} />
              <Typography variant="caption" color={theme.colors.textSecondary}>
                {workout.rating}/5
              </Typography>
            </View>
          )}
        </View>
      </CardLayout>
    </TouchableOpacity>
  );
};

export default WorkoutCard; 