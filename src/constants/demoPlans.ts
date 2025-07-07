// src/constants/demoPlans.ts - תיקון מהיר להוספת שדות נדרשים
import { Plan } from "../types/plan";

export const demoPlans: Plan[] = [
  {
    id: "plan_ppl_1",
    name: "תוכנית כוח - PPL",
    description: "תוכנית קלאסית בחלוקת Push, Pull, Legs לבניית כוח ומסה.",
    creator: "demo",

    // ✅ שדות נדרשים שנוספו
    createdAt: "2024-01-01T10:00:00.000Z",
    updatedAt: "2024-01-01T10:00:00.000Z",
    userId: "demo_user",

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
    description: "תוכנית פופולרית לחלוקת אימונים, מתאימה ל-4 אימונים בשבוع.",
    creator: "demo",

    // ✅ שדות נדרשים שנוספו
    createdAt: "2024-01-02T10:00:00.000Z",
    updatedAt: "2024-01-02T10:00:00.000Z",
    userId: "demo_user",

    days: [
      {
        id: "day_upper_1",
        name: "יום א' - חלק עליון",
        exercises: [
          {
            id: "ex_pushups",
            name: "שכיבות סמיכה",
            muscleGroup: "חזה",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_db_row",
            name: "חתירה עם משקולת יחידה",
            muscleGroup: "גב",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_db_shoulder_press",
            name: "לחיצת כתפיים במשקולות",
            muscleGroup: "כתפיים",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_assisted_pullups",
            name: "מתח בעזרה",
            muscleGroup: "גב",
            sets: 3,
            reps: 8,
          },
          {
            id: "ex_db_bicep_curl",
            name: "כפיפת מרפקים במשקולות",
            muscleGroup: "יד קדמית",
            sets: 2,
            reps: 12,
          },
          {
            id: "ex_tricep_dips",
            name: "דיפים על ספסל",
            muscleGroup: "יד אחורית",
            sets: 2,
            reps: 10,
          },
        ],
      },
      {
        id: "day_lower_1",
        name: "יום ב' - חלק תחתון",
        exercises: [
          {
            id: "ex_bodyweight_squat",
            name: "סקוואט במשקל גוף",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 15,
          },
          {
            id: "ex_lunges",
            name: "פילטיס (צעדי אימון)",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_glute_bridge",
            name: "הרמת ישבן בשכיבה",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 15,
          },
          {
            id: "ex_wall_sit",
            name: "ישיבה על קיר",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 30,
          },
          {
            id: "ex_standing_calf_raises",
            name: "הרמות עקבים בעמידה",
            muscleGroup: "שוקיים",
            sets: 3,
            reps: 20,
          },
        ],
      },
      {
        id: "day_upper_2",
        name: "יום ג' - חלק עליון (מגוון)",
        exercises: [
          {
            id: "ex_incline_pushups",
            name: "שכיבות סמיכה בשיפוע",
            muscleGroup: "חזה",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_db_chest_fly",
            name: "פתיחות חזה במשקולות",
            muscleGroup: "חזה",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_reverse_fly",
            name: "פתיחות אחוריות",
            muscleGroup: "גב",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_lateral_raises_light",
            name: "הרמות צד קלות",
            muscleGroup: "כתפיים",
            sets: 3,
            reps: 15,
          },
          {
            id: "ex_concentration_curl",
            name: "כפיפת ריכוז",
            muscleGroup: "יד קדמית",
            sets: 2,
            reps: 10,
          },
        ],
      },
      {
        id: "day_lower_2",
        name: "יום ד' - חלק תחתון (מגוון)",
        exercises: [
          {
            id: "ex_sumo_squat",
            name: "סקוואט סומו",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 12,
          },
          {
            id: "ex_reverse_lunges",
            name: "פילטיס לאחור",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 10,
          },
          {
            id: "ex_single_leg_deadlift",
            name: "דדליפט על רגל אחת",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 8,
          },
          {
            id: "ex_squat_pulses",
            name: "דופקי סקוואט",
            muscleGroup: "רגליים",
            sets: 3,
            reps: 20,
          },
          {
            id: "ex_seated_calf_raises",
            name: "הרמות עקבים בישיבה",
            muscleGroup: "שוקיים",
            sets: 3,
            reps: 25,
          },
        ],
      },
    ],
  },
];
