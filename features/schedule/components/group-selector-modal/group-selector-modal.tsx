import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from "react-native";
import { useTheme } from "@/shared/context/ThemeContext";
import { getStyles } from "./group-selector-modal.styles";
import { useDependencies } from "@/shared/di/DependencyProvider";
import { IScheduleGroupsResponse } from "@/shared/types/schedule";
import { useSchedule } from "../../contexts/schedule-context";

interface GroupSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

type ListItem = 
  | { type: 'category'; id: string; title: string; count: number }
  | { type: 'group'; id: number; title: string; subtitle: string; categoryId: string };

export const GroupSelectorModal: React.FC<GroupSelectorModalProps> = ({ visible, onClose }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = getStyles(colors);
  const { scheduleRepository } = useDependencies();
  const { selectedGroupIds, toggleGroup } = useSchedule();

  const [groups, setGroups] = useState<IScheduleGroupsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (visible && !groups) {
      loadGroups();
    }
  }, [visible]);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await scheduleRepository.getAvailableGroups();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load schedule groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const listData = useMemo(() => {
    if (!groups) return [];

    const isSearching = debouncedQuery.trim().length > 0;
    const lowerQuery = debouncedQuery.toLowerCase();
    
    const allGroupsMap = new Map<number, any>();
    
    // Group Planzajec
    const pzCategories = new Map<string, any[]>();
    if (groups.planzajec) {
      groups.planzajec.forEach(g => {
        const cat = g.schedule_category || "Inne";
        if (!pzCategories.has(cat)) pzCategories.set(cat, []);
        const groupItem = {
          type: 'group',
          id: g.id,
          title: g.name,
          subtitle: g.group_code || cat,
          categoryId: `pz-${cat}`
        };
        pzCategories.get(cat)!.push(groupItem);
        allGroupsMap.set(g.id, groupItem);
      });
    }

    // Group USOS
    const usosGroups: any[] = [];
    if (groups.usos) {
      groups.usos.forEach(g => {
        g.sub_groups.forEach(sg => {
          const groupItem = {
            type: 'group',
            id: sg.id,
            title: g.name,
            subtitle: g.group_code ? `${g.group_code} • Grupa ${sg.group_number}` : `Grupa ${sg.group_number}`,
            categoryId: 'usos-wf'
          };
          usosGroups.push(groupItem);
          allGroupsMap.set(sg.id, groupItem);
        });
      });
    }

    if (isSearching) {
      const allGroups = [
        ...usosGroups,
        ...Array.from(pzCategories.values()).flat()
      ];
      return allGroups.filter(g => 
        g.title.toLowerCase().includes(lowerQuery) || 
        g.subtitle.toLowerCase().includes(lowerQuery)
      );
    }

    const result: ListItem[] = [];
    
    if (!isSearching && selectedGroupIds.length > 0) {
      const selectedGroupItems = selectedGroupIds.map(id => allGroupsMap.get(id)).filter(Boolean);
      if (selectedGroupItems.length > 0) {
        result.push({ type: 'category', id: 'selected-groups', title: 'Wybrane grupy', count: selectedGroupItems.length });
        if (expandedCategories['selected-groups']) {
          result.push(...selectedGroupItems);
        }
      }
    }
    
    if (usosGroups.length > 0) {
      result.push({ type: 'category', id: 'usos-wf', title: 'USOS (Wychowanie Fizyczne)', count: usosGroups.length });
      if (expandedCategories['usos-wf']) {
        result.push(...usosGroups);
      }
    }

    const sortedCats = Array.from(pzCategories.keys()).sort();
    sortedCats.forEach(catName => {
      const catId = `pz-${catName}`;
      const items = pzCategories.get(catName)!;
      result.push({ type: 'category', id: catId, title: catName, count: items.length });
      if (expandedCategories[catId]) {
        result.push(...items);
      }
    });

    return result;
  }, [groups, debouncedQuery, expandedCategories]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const renderCheckbox = useCallback((isSelected: boolean) => (
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <View style={styles.innerCircle} />}
    </View>
  ), [styles]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'category') {
      const isExpanded = !!expandedCategories[item.id];
      return (
        <TouchableOpacity 
          style={styles.categoryHeader} 
          onPress={() => toggleCategory(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.count}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const isSelected = selectedGroupIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.groupItem, { paddingHorizontal: 20 }]}
        onPress={() => toggleGroup(item.id)}
      >
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.title}</Text>
          <Text style={styles.groupCode}>{item.subtitle}</Text>
        </View>
        {renderCheckbox(isSelected)}
      </TouchableOpacity>
    );
  }, [expandedCategories, selectedGroupIds, toggleCategory, toggleGroup, styles, renderCheckbox]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Wybierz grupy</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Gotowe</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj grupy..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={listData}
              keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
              renderItem={renderItem}
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={5}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
