import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { BackHandler, Linking, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { differenceInMinutes, format } from "date-fns";
import { pl } from "date-fns/locale";
import { useTheme } from "@/shared/context/ThemeContext";
import { IScheduleEvent } from "@/shared/types/schedule";
import { useSchedule } from "../../contexts/schedule-context";
import { getScheduleClassColor, translateEventType } from "../../utils/translate-event-type";
import { getStyles } from "./class-details-sheet.styles";

export interface ClassDetailsSheetRef {
  open: (event: IScheduleEvent) => void;
}

const withAlpha = (hex: string, alpha: string) =>
  /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}${alpha}` : hex;

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
};

export const ClassDetailsSheet = forwardRef<ClassDetailsSheetRef>(function ClassDetailsSheet(_, ref) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const insets = useSafeAreaInsets();
  const { groupsData } = useSchedule();

  const sheetRef = useRef<BottomSheetModal>(null);
  const isOpenRef = useRef(false);
  const [event, setEvent] = useState<IScheduleEvent | null>(null);

  // The modal stays mounted in its closed position for the screen's lifetime,
  // so opening is a single snap animation instead of a portal mount.
  useImperativeHandle(ref, () => ({
    open: (nextEvent) => {
      setEvent(nextEvent);
      sheetRef.current?.snapToIndex(0);
    },
  }), []);

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  // Never dismiss() an already closed sheet: its forced close cannot finish
  // from the closed position and leaves every later snapToIndex() ignored.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (!isOpenRef.current) return false;
        sheetRef.current?.close();
        return true;
      });
      return () => {
        sub.remove();
        if (isOpenRef.current) sheetRef.current?.close();
      };
    }, [])
  );

  // The backdrop covers the whole app and starts out touchable; it only turns
  // touch-through via an animated reaction that can be lost on Android while
  // the sheet sits closed. Mounting it only while the sheet is open keeps an
  // invisible backdrop from blocking every touch on the screen.
  const [isBackdropMounted, setIsBackdropMounted] = useState(false);

  const handleAnimate = useCallback((_fromIndex: number, toIndex: number) => {
    if (toIndex >= 0) setIsBackdropMounted(true);
  }, []);

  const handleChange = useCallback((index: number) => {
    isOpenRef.current = index >= 0;
    if (index < 0) setIsBackdropMounted(false);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) =>
      isBackdropMounted ? (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
      ) : null,
    [isBackdropMounted]
  );

  const groupLabel = useMemo(() => {
    if (!event?.group_id || !groupsData) return null;

    const planzajecGroup = groupsData.planzajec?.find((g) => g.id === event.group_id);
    if (planzajecGroup) return planzajecGroup.group_code || planzajecGroup.name;

    for (const group of groupsData.usos ?? []) {
      const subGroup = group.sub_groups.find((sg) => sg.id === event.group_id);
      if (subGroup) return `${group.group_code || group.name} • Grupa ${subGroup.group_number}`;
    }
    return null;
  }, [event?.group_id, groupsData]);

  const renderContent = () => {
    if (!event) return null;

    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const accent = getScheduleClassColor(event.type);
    const dateLabel = format(start, "EEEE, d MMMM yyyy", { locale: pl });
    const teacherUrl = event.teacher?.url;

    return (
      <>
        <View style={[styles.typeBadge, { backgroundColor: withAlpha(accent, "26") }]}>
          <View style={[styles.typeDot, { backgroundColor: accent }]} />
          <Text style={styles.typeBadgeText}>{translateEventType(event.type)}</Text>
        </View>

        <Text style={styles.title}>{event.course}</Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="calendar-outline"
            label="Data"
            value={dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
            styles={styles}
            iconColor={colors.textPrimary}
          />
          <InfoRow
            icon="time-outline"
            label="Godzina"
            value={`${format(start, "H:mm")} – ${format(end, "H:mm")}`}
            trailing={formatDuration(differenceInMinutes(end, start))}
            styles={styles}
            iconColor={colors.textPrimary}
          />
          <InfoRow
            icon="location-outline"
            label="Sala"
            value={event.room?.name || "Sala nieznana"}
            styles={styles}
            iconColor={colors.textPrimary}
          />
          <InfoRow
            icon="person-outline"
            label="Prowadzący"
            value={event.teacher?.name || "Nieznany prowadzący"}
            onPress={teacherUrl ? () => void Linking.openURL(teacherUrl) : undefined}
            styles={styles}
            iconColor={colors.textPrimary}
            isLast={!groupLabel}
          />
          {groupLabel && (
            <InfoRow
              icon="people-outline"
              label="Grupa"
              value={groupLabel}
              styles={styles}
              iconColor={colors.textPrimary}
              isLast
            />
          )}
        </View>

        {!!event.notes?.trim() && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Uwagi</Text>
            <Text style={styles.notesText}>{event.notes.trim()}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={-1}
      stackBehavior="push"
      enableDismissOnClose={false}
      enablePanDownToClose
      onAnimate={handleAnimate}
      onChange={handleChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        {renderContent()}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  trailing?: string;
  onPress?: () => void;
  isLast?: boolean;
  iconColor: string;
  styles: ReturnType<typeof getStyles>;
}

function InfoRow({ icon, label, value, trailing, onPress, isLast, iconColor, styles }: InfoRowProps) {
  const body = (
    <View style={[styles.infoRow, !isLast && styles.infoRowDivider]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {trailing && <Text style={styles.infoTrailing}>{trailing}</Text>}
      {onPress && <Ionicons name="open-outline" size={18} color={iconColor} />}
    </View>
  );

  if (!onPress) return body;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} accessibilityRole="link">
      {body}
    </TouchableOpacity>
  );
}
