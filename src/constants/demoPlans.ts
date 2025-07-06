// File: src/constants/demoPlans.ts
import { Plan } from "../types/plan";

export const demoPlans: Plan[] = [
  {
    id: "plan_ppl_1",
    name: "תוכנית כוח - PPL",
    description: "תוכנית קלאסית בחלוקת Push, Pull, Legs לבניית כוח ומסה.",
    creator: "demo",
    days: [
      {
        id: "day_ppl_push",
        name: "יום א' - Push (חזה, כתפיים, יד אחורית)",
        exercises: [
          {
            id: "ex_bench_press",
            name: "לחיצת חזה במוט",
            muscleGroup: "חזה",
            sets: 4,
            reps: 8,
          },
          {
            id: "ex_incline_db_press",
            name: "לחיצת חזה בשיפוע חיובי עם משקולות",
            muscleGroup: "חזה",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_shoulder_press",
            name: "לחיצת כתפיים עם משקולות",
            muscleGroup: "כתפיים",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_tricep_pushdown",
            name: "פשיטת מרפקים בפולי עליון",
            muscleGroup: "יד אחורית",
            sets: 3,
            reps: 12,
          },
        ],
      },
      {
        id: "day_ppl_pull",
        name: "יום ב' - Pull (גב, יד קדמית)",
        exercises: [
          {
            id: "ex_pullups",
            name: "מתח (עם/בלי עזרה)",
            muscleGroup: "גב",
            sets: 4,
            reps: 8,
          },
          {
            id: "ex_barbell_row",
            name: "חתירה עם מוט",
            muscleGroup: "גב",
            sets: 4,
            reps: 10,
          },
          {
            id: "ex_lat_pulldown",
            name: "משיכת פולי עליון",
            muscleGroup: "גב",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_bicep_curl",
            name: "כפיפת מרפקים עם משקולות",
            muscleGroup: "יד קדמית",
            sets: 3,
            reps: 12,
          },
        ],
      },
      {
        id: "day_ppl_legs",
        name: "יום ג' - Legs (רגליים)",
        exercises: [
          {
            id: "ex_squat",
            name: "סקוואט עם מוט",
            muscleGroup: "רגליים",
            sets: 4,
            reps: 8,
          },
          {
            id: "ex_leg_press",
            name: "לחיצת רגליים במכונה",
            muscleGroup: "רגליים",
            sets: 4,
            reps: 10,
          },
          {
            id: "ex_romanian_deadlift",
            name: "דדליפט רומני",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_calf_raises",
            name: "הרמות עקבים",
            muscleGroup: "שוקיים",
            sets: 3,
            reps: 20,
          },
        ],
      },
    ],
  },
  {
    id: "plan_split_2",
    name: "פיצול עליון/תחתון (Upper/Lower)",
    description: "תוכנית פופולרית לחלוקת אימונים, מתאימה ל-4 אימונים בשבוע.",
    creator: "demo",
    days: [
      {
        id: "day_split_upper_a",
        name: "אימון עליון A",
        exercises: [
          {
            id: "ex_bench_press_2",
            name: "לחיצת חזה",
            muscleGroup: "חזה",
            sets: 4,
            reps: 8,
          },
          {
            id: "ex_seated_row",
            name: "חתירה בישיבה",
            muscleGroup: "גב",
            sets: 4,
            reps: 10,
          },
          {
            id: "ex_shoulder_press_2",
            name: "לחיצת כתפיים",
            muscleGroup: "כתפיים",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_bicep_curl_2",
            name: "כפיפת מרפקים",
            muscleGroup: "יד קדמית",
            sets: 3,
            reps: 12,
          },
        ],
      },
      {
        id: "day_split_lower_a",
        name: "אימון תחתון A",
        exercises: [
          {
            id: "ex_squat_2",
            name: "סקוואט",
            muscleGroup: "רגליים",
            sets: 4,
            reps: 8,
          },
          {
            id: "ex_leg_press_2",
            name: "לחיצת רגליים",
            muscleGroup: "רגליים",
            sets: 4,
            reps: 10,
          },
          {
            id: "ex_leg_extension",
            name: "פשיטת ברכיים",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 15,
          },
          {
            id: "ex_calf_raises_2",
            name: "הרמות עקב",
            muscleGroup: "שוקיים",
            sets: 3,
            reps: 20,
          },
        ],
      },
    ],
  },
];
