// src/screens/workouts/start-workout/hooks/usePlans.ts
// Hook מתקדם לניהול תוכניות אימון עם caching ו-optimistic updates

import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getPlansByUserId } from "../../../../data/storage";
import { useUserStore } from "../../../../stores/userStore";
import { Plan } from "../../../../types/plan";

interface UsePlansReturn {
  plans: Plan[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedPlan: Plan | null;
  refresh: () => Promise<void>;
  selectPlan: (plan: Plan | null) => void;
  deletePlan: (planId: string) => Promise<void>;
  updatePlan: (plan: Plan) => void;
}

const CACHE_KEY = "plans_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  plans: Plan[];
  timestamp: number;
  userId: string;
}

export const usePlans = (): UsePlansReturn => {
  const user = useUserStore((state) => state.user);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Cache reference
  const cacheRef = useRef<CacheData | null>(null);

  // Load from cache
  const loadFromCache = useCallback(async (): Promise<Plan[] | null> => {
    if (!user?.id) return null;

    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const cache: CacheData = JSON.parse(cachedData);

      // Check if cache is valid
      const isExpired = Date.now() - cache.timestamp > CACHE_DURATION;
      const isDifferentUser = cache.userId !== user.id;

      if (isExpired || isDifferentUser) {
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }

      cacheRef.current = cache;
      return cache.plans;
    } catch (err) {
      console.error("Error loading from cache:", err);
      return null;
    }
  }, [user?.id]);

  // Save to cache
  const saveToCache = useCallback(
    async (plansToCache: Plan[]) => {
      if (!user?.id) return;

      try {
        const cacheData: CacheData = {
          plans: plansToCache,
          timestamp: Date.now(),
          userId: user.id,
        };

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        cacheRef.current = cacheData;
      } catch (err) {
        console.error("Error saving to cache:", err);
      }
    },
    [user?.id]
  );

  // Load plans
  const loadPlans = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) {
        setError("משתמש לא מחובר");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);

        // Try to load from cache first
        if (!forceRefresh) {
          const cachedPlans = await loadFromCache();
          if (cachedPlans) {
            setPlans(cachedPlans);
            setIsLoading(false);
            return;
          }
        }

        // Load from storage
        const userPlans = await getPlansByUserId(user.id);

        // Sort plans by last modified or created date
        const sortedPlans = userPlans.sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        setPlans(sortedPlans);
        await saveToCache(sortedPlans);

        // If selected plan was deleted, clear selection
        if (
          selectedPlan &&
          !sortedPlans.find((p) => p.id === selectedPlan.id)
        ) {
          setSelectedPlan(null);
        }
      } catch (err) {
        console.error("Error loading plans:", err);
        setError("שגיאה בטעינת תוכניות");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id, loadFromCache, saveToCache, selectedPlan]
  );

  // Refresh plans
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPlans(true);
  }, [loadPlans]);

  // Select plan
  const selectPlan = useCallback((plan: Plan | null) => {
    setSelectedPlan(plan);
  }, []);

  // Delete plan (optimistic update)
  const deletePlan = useCallback(
    async (planId: string) => {
      // Optimistic update
      setPlans((prevPlans) => prevPlans.filter((p) => p.id !== planId));

      // Clear selection if deleted plan was selected
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }

      // Update cache
      const updatedPlans = plans.filter((p) => p.id !== planId);
      await saveToCache(updatedPlans);

      // Note: Actual deletion should be handled by the parent component
      // This is just for optimistic UI updates
    },
    [plans, saveToCache, selectedPlan]
  );

  // Update plan (optimistic update)
  const updatePlan = useCallback(
    (updatedPlan: Plan) => {
      setPlans((prevPlans) =>
        prevPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      );

      // Update selected plan if it's the one being updated
      if (selectedPlan?.id === updatedPlan.id) {
        setSelectedPlan(updatedPlan);
      }
    },
    [selectedPlan]
  );

  // Initial load
  useEffect(() => {
    loadPlans();
  }, []);

  // Reload on focus
  useFocusEffect(
    useCallback(() => {
      // Only refresh if cache is expired
      if (cacheRef.current) {
        const isExpired =
          Date.now() - cacheRef.current.timestamp > CACHE_DURATION;
        if (isExpired) {
          loadPlans(true);
        }
      }
    }, [loadPlans])
  );

  return {
    plans,
    isLoading,
    isRefreshing,
    error,
    selectedPlan,
    refresh,
    selectPlan,
    deletePlan,
    updatePlan,
  };
};
