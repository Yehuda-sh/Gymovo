// src/screens/plans/PlansScreen.tsx - מסך תוכניות משודרג עם עיצוב מתקדם

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

// Components
import Button from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";

// Data & Services
import { getDemoPlanForUser } from "../../constants/demoUsers";
import { getPlansByUserId, savePlan, deletePlan } from "../../data/storage";
import { fetchPublicPlans } from "../../services/wgerApi";

// Stores & Types
import { useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";
import { designSystem } from "../../theme/designSystem";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 🎨 צבעים מותאמים עם גרדיאנטים
const planGradients = {
  beginner: ["#00C9FF", "#0081FF"],
  intermediate: ["#FC466B", "#3F5EFB"],
  advanced: ["#FF416C", "#FF4B2B"],
  custom: designSystem.gradients.accent.colors,
  featured: designSystem.gradients.accent.colors,
};

// 🏷️ רכיב תג משודרג
const Tag = ({
  text,
  color = designSystem.colors.primary.main,
  icon,
}: {
  text: string;
  color?: string;
  icon?: string;
}) => (
  <View
    style={[
      styles.tag,
      { backgroundColor: color + "20", borderColor: color + "40" },
    ]}
  >
    {icon && <Ionicons name={icon as any} size={12} color={color} />}
    <Text style={[styles.tagText, { color }]}>{text}</Text>
  </View>
);

// 🔍 רכיב חיפוש משודרג עם אנימציה
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "חפש תוכנית...",
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...designSystem.animations.easings.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.searchContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Ionicons
        name="search"
        size={20}
        color={designSystem.colors.neutral.text.tertiary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={designSystem.colors.neutral.text.tertiary}
        style={styles.searchInput}
      />
      {value !== "" && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons
            name="close-circle"
            size={20}
            color={designSystem.colors.neutral.text.tertiary}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// 🔖 רכיב פילטרים משודרג
const FilterTabs = ({
  selected,
  onSelect,
}: {
  selected: "all" | "mine" | "public";
  onSelect: (filter: "all" | "mine" | "public") => void;
}) => {
  const filters = [
    { id: "all", label: "הכל", icon: "apps" },
    { id: "mine", label: "שלי", icon: "person" },
    { id: "public", label: "ציבוריות", icon: "globe" },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterTabs}
      contentContainerStyle={styles.filterTabsContent}
    >
      {filters.map((filter) => {
        const isActive = selected === filter.id;
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          Animated.sequence([
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();

          onSelect(filter.id as any);
        };

        return (
          <Animated.View
            key={filter.id}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={handlePress}
            >
              {isActive ? (
                <LinearGradient
                  colors={designSystem.gradients.primary.colors}
                  style={styles.filterTabGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={filter.icon as any} size={16} color="#fff" />
                  <Text
                    style={[styles.filterTabText, styles.filterTabTextActive]}
                  >
                    {filter.label}
                  </Text>
                </LinearGradient>
              ) : (
                <>
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={designSystem.colors.neutral.text.secondary}
                  />
                  <Text style={styles.filterTabText}>{filter.label}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

// 📋 רכיב כרטיס תוכנית משודרג
const PlanCard = ({
  plan,
  index,
  onPress,
  onShare,
  onDelete,
}: {
  plan: Plan;
  index: number;
  onPress: () => void;
  onShare: () => void;
  onDelete?: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 150,
        ...designSystem.animations.easings.spring,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 150,
        ...designSystem.animations.easings.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getDifficultyGradient = () => {
    // מחזיר גרדיאנט לפי רמת קושי או סוג תוכנית
    if (plan.difficulty === "beginner") return planGradients.beginner;
    if (plan.difficulty === "intermediate") return planGradients.intermediate;
    if (plan.difficulty === "advanced") return planGradients.advanced;
    return planGradients.custom;
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.planCard}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Header Gradient */}
        <LinearGradient
          colors={getDifficultyGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planCardHeader}
        >
          <View style={styles.planIconContainer}>
            <MaterialCommunityIcons name="dumbbell" size={40} color="#fff" />
          </View>

          {plan.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>פעילה</Text>
            </View>
          )}
        </LinearGradient>

        {/* Content */}
        <View style={styles.planContent}>
          <View style={styles.planHeader}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.createdBy && (
                <Text style={styles.planCreator}>
                  נוצר ע"י {plan.createdBy}
                </Text>
              )}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {plan.tags?.map((tag, idx) => (
                <Tag key={idx} text={tag} />
              ))}
              {plan.difficulty && (
                <Tag
                  text={
                    plan.difficulty === "beginner"
                      ? "מתחילים"
                      : plan.difficulty === "intermediate"
                      ? "ביניים"
                      : "מתקדמים"
                  }
                  color={
                    plan.difficulty === "beginner"
                      ? designSystem.colors.secondary.main
                      : plan.difficulty === "intermediate"
                      ? designSystem.colors.accent.orange
                      : designSystem.colors.semantic.error
                  }
                  icon="fitness"
                />
              )}
            </ScrollView>
          </View>

          {/* Description */}
          {plan.description && (
            <Text style={styles.planDescription} numberOfLines={2}>
              {plan.description}
            </Text>
          )}

          {/* Stats */}
          <View style={styles.planStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="calendar"
                size={16}
                color={designSystem.colors.primary.light}
              />
              <Text style={styles.statText}>{plan.days?.length || 0} ימים</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="time"
                size={16}
                color={designSystem.colors.primary.light}
              />
              <Text style={styles.statText}>{plan.duration || "גמיש"}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="barbell"
                size={16}
                color={designSystem.colors.primary.light}
              />
              <Text style={styles.statText}>
                {plan.totalExercises || 0} תרגילים
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.planActions}>
            <TouchableOpacity style={styles.startButton} onPress={handlePress}>
              <LinearGradient
                colors={designSystem.gradients.primary.colors}
                style={styles.startButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={16} color="#fff" />
                <Text style={styles.startButtonText}>התחל</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.iconButton} onPress={onShare}>
                <Ionicons
                  name="share-social"
                  size={20}
                  color={designSystem.colors.primary.main}
                />
              </TouchableOpacity>
              {onDelete && (
                <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
                  <Ionicons
                    name="trash"
                    size={20}
                    color={designSystem.colors.semantic.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 📭 רכיב Empty State משודרג
const EmptyState = ({ onCreatePlan }: { onCreatePlan: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 300,
        ...designSystem.animations.easings.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={80}
          color={designSystem.colors.neutral.text.tertiary}
        />
      </View>

      <Text style={styles.emptyTitle}>אין לך תוכניות עדיין</Text>
      <Text style={styles.emptyText}>
        צור תוכנית אימון מותאמת אישית או בחר מהתוכניות הציבוריות
      </Text>

      <TouchableOpacity onPress={onCreatePlan}>
        <LinearGradient
          colors={designSystem.gradients.primary.colors}
          style={styles.createButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.createButtonText}>צור תוכנית ראשונה</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🏋️ מסך תוכניות ראשי משודרג
const PlansScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [publicPlans, setPublicPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "mine" | "public"
  >("all");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;

  // Load plans
  useEffect(() => {
    loadPlans();
    animateEntrance();
  }, []);

  const animateEntrance = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        ...designSystem.animations.easings.spring,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        delay: 200,
        ...designSystem.animations.easings.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load user plans
      if (user?.id) {
        const userPlans = await getPlansByUserId(user.id);

        // Add demo plan if exists
        const demoPlan = getDemoPlanForUser(user.id);
        if (demoPlan) {
          const allUserPlans = [...userPlans];
          const exists = allUserPlans.some((p) => p.id === demoPlan.id);
          if (!exists) {
            allUserPlans.push(demoPlan);
          }
          setPlans(allUserPlans);
        } else {
          setPlans(userPlans);
        }
      }

      // Load public plans
      try {
        const publicData = await fetchPublicPlans();
        setPublicPlans(publicData);
      } catch (error) {
        console.log("Could not load public plans:", error);
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      Toast.show({
        type: "error",
        text1: "שגיאה בטעינת התוכניות",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    let allPlans: Plan[] = [];

    if (selectedFilter === "all") {
      allPlans = [...plans, ...publicPlans];
    } else if (selectedFilter === "mine") {
      allPlans = plans;
    } else {
      allPlans = publicPlans;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allPlans = allPlans.filter(
        (plan) =>
          plan.name.toLowerCase().includes(query) ||
          plan.description?.toLowerCase().includes(query) ||
          plan.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return allPlans;
  }, [plans, publicPlans, selectedFilter, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    Alert.alert("מחיקת תוכנית", "האם אתה בטוח שברצונך למחוק תוכנית זו?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlan(planId);
            await loadPlans();
            Toast.show({
              type: "success",
              text1: "התוכנית נמחקה בהצלחה",
            });
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "שגיאה במחיקת התוכנית",
            });
          }
        },
      },
    ]);
  };

  const handleSharePlan = async (plan: Plan) => {
    try {
      await Share.share({
        message: `תוכנית אימון: ${plan.name}\n${
          plan.description || ""
        }\n\nימי אימון: ${plan.days?.length || 0}`,
        title: plan.name,
      });
    } catch (error) {
      console.error("Error sharing plan:", error);
    }
  };

  const renderPlan = ({ item, index }: { item: Plan; index: number }) => (
    <PlanCard
      plan={item}
      index={index}
      onPress={() => navigation.navigate("PlanDetails", { planId: item.id })}
      onShare={() => handleSharePlan(item)}
      onDelete={
        item.userId === user?.id ? () => handleDeletePlan(item.id) : undefined
      }
    />
  );

  if (isLoading && !isRefreshing) {
    return (
      <LinearGradient
        colors={designSystem.gradients.dark.colors}
        style={styles.loadingContainer}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <MaterialCommunityIcons
            name="clipboard-text"
            size={48}
            color={designSystem.colors.primary.main}
          />
          <Text style={styles.loadingText}>טוען תוכניות...</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={designSystem.gradients.dark.colors}
      style={styles.container}
    >
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: headerScale }],
          },
        ]}
      >
        <Text style={styles.title}>תוכניות אימון</Text>
        <Text style={styles.subtitle}>
          {filteredPlans.length} תוכניות זמינות
        </Text>
      </Animated.View>

      {/* Featured Card */}
      {!searchQuery && selectedFilter === "all" && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate("CreateOrEditPlan")}
          >
            <LinearGradient
              colors={planGradients.featured}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <Ionicons name="star" size={30} color="#fff" />
              <Text style={styles.featuredTitle}>צור תוכנית מותאמת</Text>
              <Text style={styles.featuredSubtitle}>
                בנה תוכנית אימון אישית בדיוק לפי הצרכים שלך
              </Text>
              <View style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>התחל עכשיו</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Search & Filters */}
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterTabs selected={selectedFilter} onSelect={setSelectedFilter} />
      </Animated.View>

      {/* Plans List */}
      {filteredPlans.length > 0 ? (
        <FlatList
          data={filteredPlans}
          renderItem={renderPlan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[designSystem.colors.primary.main]}
              tintColor={designSystem.colors.primary.main}
            />
          }
        />
      ) : searchQuery ? (
        <View style={styles.noResultsContainer}>
          <Ionicons
            name="search"
            size={64}
            color={designSystem.colors.neutral.text.tertiary}
          />
          <Text style={styles.noResultsText}>
            לא נמצאו תוכניות התואמות לחיפוש
          </Text>
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearFiltersText}>נקה חיפוש</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <EmptyState
          onCreatePlan={() => navigation.navigate("CreateOrEditPlan")}
        />
      )}

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateOrEditPlan")}
        >
          <LinearGradient
            colors={designSystem.gradients.accent.colors}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },

  // Header
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
  },

  // Featured Card
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    ...designSystem.shadows.lg,
  },
  featuredGradient: {
    padding: 24,
    alignItems: "center",
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  featuredButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  featuredButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: designSystem.colors.background.card,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    ...designSystem.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: designSystem.colors.neutral.text.primary,
  },

  // Filter Tabs
  filterTabs: {
    marginBottom: 20,
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.card,
    gap: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
  },
  filterTabActive: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    ...designSystem.shadows.md,
  },
  filterTabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  filterTabText: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#fff",
  },

  // Plan Card
  planCard: {
    backgroundColor: designSystem.colors.background.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    ...designSystem.shadows.md,
  },
  planCardHeader: {
    height: 120,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  planIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    padding: 16,
  },
  activeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: designSystem.colors.secondary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  planContent: {
    padding: 20,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
  },
  planCreator: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
  },
  tagsContainer: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 4,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  planDescription: {
    fontSize: 15,
    color: designSystem.colors.neutral.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: designSystem.colors.neutral.text.secondary,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  listContent: {
    paddingBottom: 100,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: designSystem.colors.neutral.text.secondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    ...designSystem.shadows.lg,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // No Results
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: designSystem.colors.neutral.text.secondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  clearFiltersText: {
    fontSize: 16,
    color: designSystem.colors.primary.main,
    fontWeight: "600",
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 28,
    ...designSystem.shadows.xl,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlansScreen;
