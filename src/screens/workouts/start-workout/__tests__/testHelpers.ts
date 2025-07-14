// src/screens/workouts/start-workout/__tests__/testHelpers.ts

export const mockPlan = {
  id: "test-plan-1",
  name: "תוכנית בדיקה",
  level: "מתחיל",
  type: "strength",
  days: [
    {
      id: "day-1",
      name: "יום א - חזה וטרייספס",
      exercises: [
        {
          id: "ex-1",
          name: "לחיצת חזה",
          category: "chest",
          sets: 3,
          targetReps: 10,
        },
      ],
    },
  ],
};

export const mockRecentWorkout = {
  id: "workout-1",
  planId: "test-plan-1",
  planName: "תוכנית בדיקה",
  dayId: "day-1",
  dayName: "יום א",
  date: new Date(),
  duration: 45,
  exerciseCount: 5,
};
