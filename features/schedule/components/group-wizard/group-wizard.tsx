import React, { useState, useMemo, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, FlatList, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClearIcon from "@/assets/icons/clear-300.svg";
import { useAuth } from "@/features/auth";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./group-wizard.styles";
import { useSchedule } from "../../contexts/schedule-context";

interface GroupWizardProps {
  visible: boolean;
  onClose: () => void;
}

const getLanguageDisplayName = (name: string, code: string) => {
  const lowerName = (name || "").toLowerCase();
  const lowerCode = (code || "").toLowerCase();
  
  if (lowerName.includes("ang") || lowerCode.includes("ang")) return "Język angielski";
  if (lowerName.includes("eng") || lowerCode.includes("eng")) return "English";
  
  if (lowerName.includes("niem") || lowerCode.includes("niem")) return "Język niemiecki";
  if (lowerName.includes("ger") || lowerCode.includes("ger")) return "German";
  
  if (lowerName.includes("hiszp") || lowerCode.includes("hiszp")) return "Język hiszpański";
  if (lowerName.includes("spa") || lowerCode.includes("spa")) return "Spanish";
  
  if (lowerName.includes("fran") || lowerCode.includes("fran")) return "Język francuski";
  if (lowerName.includes("fre") || lowerCode.includes("fre") || lowerCode.includes("fra")) return "French";
  
  if (lowerName.includes("ros") || lowerCode.includes("ros")) return "Język rosyjski";
  if (lowerName.includes("rus") || lowerCode.includes("rus")) return "Russian";
  
  if (lowerName.includes("włos") || lowerName.includes("wlos") || lowerCode.includes("wlo")) return "Język włoski";
  if (lowerName.includes("ita") || lowerCode.includes("ita")) return "Italian";
  
  if (lowerName.includes("polsk") || lowerCode.includes("pol")) return "Język polski";
  
  return "Inne Języki"; // fallback so they don't get split into single groups
};

const cleanCategoryName = (name: string) => {
  if (!name) return "Inne";
  return name.replace(/\*/g, '').trim();
};

export const GroupWizard: React.FC<GroupWizardProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { selectedGroupIds, setSelectedGroupIds, groupsData, isGroupsLoading, refreshGroups } = useSchedule();
  const { status, authSessionService } = useAuth();
  const [isRestoringSession, setIsRestoringSession] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Local state for the wizard
  const [localKierunekIds, setLocalKierunekIds] = useState<number[]>([]);
  const [localJezykiIds, setLocalJezykiIds] = useState<number[]>([]);
  const [localWfIds, setLocalWfIds] = useState<number[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset local state once per opening; later groupsData refreshes must not
  // discard the user's in-progress selection.
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!visible) {
      isInitializedRef.current = false;
      return;
    }
    if (groupsData && !isInitializedRef.current) {
      isInitializedRef.current = true;
      setStep(1);
      setSearchQuery("");
      
      const isJezyk = (cat: string = "", name: string = "") => {
        const lcat = cat.toLowerCase();
        const lname = name.toLowerCase();
        return lcat.includes("lektorat") || lcat.includes("język") || lcat.includes("jezyk") || lname.includes("język") || lname.includes("jezyk");
      };

      const jezykiGroupIds = groupsData.planzajec?.filter((g: any) => isJezyk(g.schedule_category, g.name)).map((g: any) => g.id) || [];
      const wfGroupIds = groupsData.usos?.flatMap((g: any) => g.sub_groups.map((sg: any) => sg.id)) || [];

      // Initialize local state based on global context
      const selectedKierunek = selectedGroupIds.filter(id => !jezykiGroupIds.includes(id) && !wfGroupIds.includes(id));
      const selectedJezyki = selectedGroupIds.filter(id => jezykiGroupIds.includes(id));
      const selectedWf = selectedGroupIds.filter(id => wfGroupIds.includes(id));

      setLocalKierunekIds(selectedKierunek);
      setLocalJezykiIds(selectedJezyki);
      setLocalWfIds(selectedWf);
    }
  }, [visible, groupsData]);

  useEffect(() => {
    if (visible && !groupsData) {
      void refreshGroups();
    }
  }, [visible, groupsData, refreshGroups]);

  const handleRetryGroups = () => {
    if (status === "unverified") {
      setIsRestoringSession(true);
      void authSessionService.restore().finally(() => setIsRestoringSession(false));
    } else {
      void refreshGroups();
    }
  };

  const handleSaveAndClose = () => {
    const finalIds = [...localJezykiIds, ...localKierunekIds, ...localWfIds];
    
    setSelectedGroupIds(finalIds);
    onClose();
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
      setSearchQuery("");
    } else {
      handleSaveAndClose();
    }
  };

  const isJezykFunc = (cat: string = "", name: string = "") => {
    const lcat = cat.toLowerCase();
    const lname = name.toLowerCase();
    return lcat.includes("lektorat") || lcat.includes("język") || lcat.includes("jezyk") || lname.includes("język") || lname.includes("jezyk");
  };

  // Data processing
  const kierunekSelected = useMemo(() => {
    if (!groupsData?.planzajec) return [];
    return groupsData.planzajec
      .filter((g: any) => localKierunekIds.includes(g.id))
      .map((g: any) => ({ ...g, type: 'group' }));
  }, [groupsData, localKierunekIds]);

  const kierunekList = useMemo(() => {
    if (!groupsData?.planzajec) return [];
    let list = groupsData.planzajec.filter((g: any) => !isJezykFunc(g.schedule_category, g.name) && (debouncedQuery || !localKierunekIds.includes(g.id)));
    
    const categories = new Map<string, any[]>();
    list.forEach(g => {
      const cat = cleanCategoryName(g.schedule_category);
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat)!.push(g);
    });

    const result: any[] = [];
    Array.from(categories.keys()).sort().forEach(cat => {
      const items = categories.get(cat)!;
      let filteredItems = items;
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        filteredItems = items.filter((g: any) => g.name.toLowerCase().includes(q) || g.group_code?.toLowerCase().includes(q));
      }
      
      if (filteredItems.length > 0) {
        if (!debouncedQuery) {
          result.push({ type: 'category', id: `kierunek-${cat}`, title: cat, count: items.length });
        }
        if (expandedCategories[`kierunek-${cat}`] || debouncedQuery) {
          result.push(...filteredItems.map((i: any) => ({ ...i, type: 'group' })));
        }
      }
    });
    return result;
  }, [groupsData, debouncedQuery, expandedCategories, localKierunekIds]);

  const jezykiSelected = useMemo(() => {
    if (!groupsData?.planzajec) return [];
    return groupsData.planzajec
      .filter((g: any) => localJezykiIds.includes(g.id))
      .map((g: any) => ({ ...g, type: 'group' }));
  }, [groupsData, localJezykiIds]);

  const jezykiList = useMemo(() => {
    if (!groupsData?.planzajec) return [];
    let list = groupsData.planzajec.filter((g: any) => isJezykFunc(g.schedule_category, g.name) && (debouncedQuery || !localJezykiIds.includes(g.id)));
    
    const categories = new Map<string, any[]>();
    list.forEach(g => {
      const cat = getLanguageDisplayName(g.name, g.group_code);
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat)!.push(g);
    });

    const result: any[] = [];
    Array.from(categories.keys()).sort().forEach(cat => {
      const items = categories.get(cat)!;
      let filteredItems = items;
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        filteredItems = items.filter((g: any) => g.name.toLowerCase().includes(q) || g.group_code?.toLowerCase().includes(q));
      }
      
      if (filteredItems.length > 0) {
        if (!debouncedQuery) {
          result.push({ type: 'category', id: `jezyki-${cat}`, title: cat, count: items.length });
        }
        if (expandedCategories[`jezyki-${cat}`] || debouncedQuery) {
          result.push(...filteredItems.map((i: any) => ({ ...i, type: 'group' })));
        }
      }
    });
    return result;
  }, [groupsData, debouncedQuery, expandedCategories, localJezykiIds]);

  const wfSelected = useMemo(() => {
    if (!groupsData?.usos) return [];
    const selected: any[] = [];
    groupsData.usos.forEach((g: any) => {
      g.sub_groups.forEach((sg: any) => {
        if (localWfIds.includes(sg.id)) {
          selected.push({
            id: sg.id,
            name: g.name,
            subtitle: g.group_code ? `${g.group_code} • Grupa ${sg.group_number}` : `Grupa ${sg.group_number}`,
            type: 'group'
          });
        }
      });
    });
    return selected;
  }, [groupsData, localWfIds]);

  const wfList = useMemo(() => {
    if (!groupsData?.usos) return [];
    
    const categories = new Map<string, any[]>();
    groupsData.usos.forEach((g: any) => {
      const cat = cleanCategoryName(g.name);
      
      g.sub_groups.forEach((sg: any) => {
        if (debouncedQuery || !localWfIds.includes(sg.id)) {
          if (!categories.has(cat)) categories.set(cat, []);
          categories.get(cat)!.push({
            id: sg.id,
            name: g.name,
            subtitle: g.group_code ? `${g.group_code} • Grupa ${sg.group_number}` : `Grupa ${sg.group_number}`,
            originalCategory: cat
          });
        }
      });
    });

    const result: any[] = [];
    Array.from(categories.keys()).sort().forEach(cat => {
      const items = categories.get(cat)!;
      let filteredItems = items;
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        filteredItems = items.filter((g: any) => g.name.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q));
      }
      
      if (filteredItems.length > 0) {
        if (!debouncedQuery) {
          result.push({ type: 'category', id: `wf-${cat}`, title: cat, count: items.length });
        }
        if (expandedCategories[`wf-${cat}`] || debouncedQuery) {
          result.push(...filteredItems.map((i: any) => ({ ...i, type: 'group' })));
        }
      }
    });
    return result;
  }, [groupsData, debouncedQuery, expandedCategories, localWfIds]);

  const toggleKierunek = (id: number) => {
    setLocalKierunekIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleJezyk = (id: number) => {
    setLocalJezykiIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleWf = (id: number) => {
    setLocalWfIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderRadio = (isSelected: boolean) => (
    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
      {isSelected && <Text style={styles.checkIcon}>✓</Text>}
    </View>
  );

  const renderCheckbox = (isSelected: boolean) => (
    <View style={[styles.checkboxSquare, isSelected && styles.checkboxSquareActive]}>
      {isSelected && <Text style={styles.checkIcon}>✓</Text>}
    </View>
  );

  const renderKierunekStep = () => {
    return (
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Wybierz grupę kierunkową</Text>
          <Text style={styles.subtitle}>Wpisz nazwę kierunku lub grupy, np. ZIIAS1-3611.</Text>
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj grupy..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery("")} hitSlop={8}>
              <ClearIcon width={20} height={20} fill={colors.dark_grey} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={[
            ...(kierunekSelected.length > 0 && !debouncedQuery ? [{ type: 'header', title: `Wybrane (${kierunekSelected.length})`, id: 'wybrane-header' }] : []),
            ...(debouncedQuery ? [] : kierunekSelected),
            ...(kierunekList.length > 0 && !debouncedQuery ? [{ type: 'header', title: 'Wszystkie grupy', id: 'wszystkie-header' }] : []),
            ...kierunekList
          ]}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => {
            if (item.type === 'header') {
              return <Text style={styles.listSectionTitle}>{item.title}</Text>;
            }
          if (item.type === 'category') {
            return (
              <TouchableOpacity 
                style={styles.listCategoryHeader} 
                onPress={() => toggleCategory(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.listCategoryTitle}>{item.title}</Text>
                <View style={styles.listCategoryBadge}>
                  <Text style={styles.listCategoryBadgeText}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            );
          }
            const isSelected = localKierunekIds.includes(item.id);
            return (
              <TouchableOpacity 
                style={[styles.groupItem, isSelected && styles.groupItemActive]} 
                onPress={() => toggleKierunek(item.id)}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.group_code || item.name}</Text>
                  <Text style={styles.groupSubtitle}>{item.name}</Text>
                </View>
                {renderCheckbox(isSelected)}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak wyników</Text>}
        />
      </View>
    );
  };

  const renderJezykiStep = () => {
    return (
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Wybierz języki obce</Text>
          <Text style={styles.subtitle}>Możesz wybrać kilka grup lub pominąć ten krok.</Text>
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj języka lub grupy"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery("")} hitSlop={8}>
              <ClearIcon width={20} height={20} fill={colors.dark_grey} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={[
            ...(jezykiSelected.length > 0 && !debouncedQuery ? [{ type: 'header', title: `Wybrane (${jezykiSelected.length})`, id: 'wybrane-header' }] : []),
            ...(debouncedQuery ? [] : jezykiSelected),
            ...(jezykiList.length > 0 && !debouncedQuery ? [{ type: 'header', title: 'Wszystkie grupy', id: 'wszystkie-header' }] : []),
            ...jezykiList
          ]}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => {
            if (item.type === 'header') {
              return <Text style={styles.listSectionTitle}>{item.title}</Text>;
            }
            if (item.type === 'category') {
              return (
                <TouchableOpacity 
                  style={styles.listCategoryHeader} 
                  onPress={() => toggleCategory(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.listCategoryTitle}>{item.title}</Text>
                  <View style={styles.listCategoryBadge}>
                    <Text style={styles.listCategoryBadgeText}>{item.count}</Text>
                  </View>
                </TouchableOpacity>
              );
            }
            const isSelected = localJezykiIds.includes(item.id);
            const displayName = getLanguageDisplayName(item.name, item.group_code);
            return (
              <TouchableOpacity 
                style={[styles.groupItem, isSelected && styles.groupItemActive]} 
                onPress={() => toggleJezyk(item.id)}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{displayName}</Text>
                  <Text style={styles.groupSubtitle}>{item.group_code || item.name}</Text>
                </View>
                {renderCheckbox(isSelected)}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak wyników</Text>}
        />
      </View>
    );
  };

  const renderWfStep = () => {
    return (
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Wybierz zajęcia z WF</Text>
          <Text style={styles.subtitle}>Wybierz grupy lub pomiń ten krok.</Text>
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj dyscypliny lub grupy"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => setSearchQuery("")} hitSlop={8}>
              <ClearIcon width={20} height={20} fill={colors.dark_grey} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={[
            ...(wfSelected.length > 0 && !debouncedQuery ? [{ type: 'header', title: `Wybrane (${wfSelected.length})`, id: 'wybrane-header' }] : []),
            ...(debouncedQuery ? [] : wfSelected),
            ...(wfList.length > 0 && !debouncedQuery ? [{ type: 'header', title: 'Wszystkie grupy', id: 'wszystkie-header' }] : []),
            ...wfList
          ]}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => {
            if (item.type === 'header') {
              return <Text style={styles.listSectionTitle}>{item.title}</Text>;
            }
          if (item.type === 'category') {
            return (
              <TouchableOpacity 
                style={styles.listCategoryHeader} 
                onPress={() => toggleCategory(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.listCategoryTitle}>{item.title}</Text>
                <View style={styles.listCategoryBadge}>
                  <Text style={styles.listCategoryBadgeText}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            );
          }
            const isSelected = localWfIds.includes(item.id);
            return (
              <TouchableOpacity 
                style={[styles.groupItem, isSelected && styles.groupItemActive]} 
                onPress={() => toggleWf(item.id)}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupSubtitle}>{item.subtitle}</Text>
                </View>
                {renderCheckbox(isSelected)}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak wyników</Text>}
        />
      </View>
    );
  };

  const renderGroupsUnavailable = () => {
    const isBusy = isGroupsLoading || isRestoringSession || status === "initializing";

    return (
      <>
        <View style={styles.statusContent}>
          {isBusy ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Text style={[styles.mainTitle, styles.statusTitle]}>Nie udało się pobrać listy grup</Text>
              <Text style={[styles.subtitle, styles.statusText]}>
                Sprawdź połączenie z internetem i spróbuj ponownie.
              </Text>
              <TouchableOpacity style={styles.statusRetryButton} onPress={handleRetryGroups}>
                <Text style={styles.buttonPrimaryText}>Spróbuj ponownie</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
            <Text style={styles.buttonSecondaryText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      allowSwipeDismissal={false}
      onRequestClose={() => {}}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Konfigurator grup</Text>
        </View>

        {!groupsData ? renderGroupsUnavailable() : (
        <>
        <View style={styles.stepperContainer}>
          {[
            { num: 1, label: "Kierunek" },
            { num: 2, label: "Języki" },
            { num: 3, label: "WF" },
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num; 
            
            let icon = <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>{s.num}</Text>;
            if (isCompleted || (s.num === 1 && localKierunekIds.length > 0) || (s.num === 2 && localJezykiIds.length > 0)) {
               icon = <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>✓</Text>;
            }

            return (
              <TouchableOpacity 
                key={s.num} 
                style={[styles.stepPill, isActive && styles.stepPillActive]}
                onPress={() => setStep(s.num as 1 | 2 | 3)}
              >
                <View style={[styles.stepNumberWrapper, isActive && styles.stepNumberWrapperActive]}>
                  {icon}
                </View>
                <Text style={[styles.stepText, isActive && styles.stepTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {step === 1 && renderKierunekStep()}
        {step === 2 && renderJezykiStep()}
        {step === 3 && renderWfStep()}

        <View style={styles.bottomNav}>
          {step < 3 ? (
            <>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleSaveAndClose}>
                <Text style={styles.buttonSecondaryText}>{"Zakończ \ni zapisz"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonPrimary, styles.buttonNext]} onPress={handleNext}>
                <Text style={styles.buttonPrimaryText}>Dalej <Text style={styles.arrowIcon}>→</Text></Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.buttonPrimary, styles.buttonPrimaryFull]} onPress={handleSaveAndClose}>
              <Text style={styles.buttonPrimaryText}>✓ Zakończ</Text>
            </TouchableOpacity>
          )}
        </View>
        </>
        )}
      </SafeAreaView>
    </Modal>
  );
};
