import { ThemedText } from '@/shared/components/themed-text';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Event } from '@/shared/types/event';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

// Local date helpers (implemented here to avoid adding/updating external file)
const getCurrentDate = () => new Date();

function resetTime(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

function getMonthName(date: Date) {
  const month = date.toLocaleString('default', { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1);
}

function formatMonth(d: Date) {
  const formatted = d.toLocaleString('pl-PL', { month: 'long' });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export interface DateItem {
	date: Date;
	day: string;
	events: Event[]; // Added to determine the number of dots
}

interface TimelineScrollerProps {
	selectedDate: Date | null | undefined;
	setSelectedDate: (date: Date) => void;
	datesDays: DateItem[];
	scrollRef: React.RefObject<FlatList | null>;
  visibleEventId: string | null; // Added to highlight the active dot
}

interface DayProps {
  setSelectedDate: (date: Date) => void;
  item: DateItem;
  index: number;
  formattedDates: (string | undefined)[];
  isDaySelected: boolean;
  itemWidth: number;
  visibleEventId: string | null;
  isDark: boolean;
}

const Day = memo(function Day({setSelectedDate, item, index, formattedDates, isDaySelected, itemWidth, visibleEventId, isDark}: DayProps) {
    const dayNumber = item.date.getDate();
    const hasEvents = item.events.length > 0;
  
    if (!hasEvents) {
      // Small greyed out version for dates with no events
      return (
        <View style={[styles.dayContainer, { width: itemWidth }]}>
          <View style={styles.dateBoxEmpty}>
            <ThemedText style={isDark ? styles.dayTextEmptyDark : styles.dayTextEmptyLight}>
              {dayNumber}
            </ThemedText>
          </View>
        </View>
      );
    }

    // Helper function to determine dot visibility and active state
    
      const getDotConfig = (events: Event[], visibleId: string | null) => {
      if (events.length <= 3) {
        // Show one dot per event
        return events.map((e) => ({
          key: e.id,
          isActive: e.id === visibleId,
          type: 'single' as const
        }));
      } else {
        // Show max 3 dots for grouped events
        const visibleIndex = events.findIndex(e => e.id === visibleId);
        
        // If visibleId is not found in this day's events, all dots are inactive
        if (visibleIndex === -1) {
          return [
            { key: 'first', isActive: false, type: 'grouped' as const },
            { key: 'middle', isActive: false, type: 'grouped' as const },
            { key: 'last', isActive: false, type: 'grouped' as const }
          ];
        }

        const isFirst = visibleIndex === 0;
        const isLast = visibleIndex === events.length - 1;
        const isMiddle = !isFirst && !isLast;

        return [
          { key: 'first', isActive: isFirst, type: 'grouped' as const },
          { key: 'middle', isActive: isMiddle, type: 'grouped' as const },
          { key: 'last', isActive: isLast, type: 'grouped' as const }
        ];
      }
    };


    const dotConfig = getDotConfig(item.events, visibleEventId);

    return (
      <Pressable 
        style={[styles.dayContainer, { width: itemWidth }]}
        onPress={() => setSelectedDate(item.date)}
      >
        <View style={[
          styles.dateBox, 
          isDaySelected ? styles.dateBoxActive : (isDark ? styles.dateBoxInactiveDark : styles.dateBoxInactiveLight)
        ]}>
          <ThemedText style={[
            styles.dayText, 
            isDaySelected ? styles.dayTextActive : (isDark ? styles.dayTextInactiveDark : styles.dayTextInactiveLight)
          ]}>
            {dayNumber}
          </ThemedText>
        </View>
        <View style={styles.dotsContainer}>
          {dotConfig.map((dot) => (
            <View 
              key={dot.key} 
              style={[
                styles.dot, 
                dot.isActive ? styles.dotActive : (isDark ? styles.dotInactiveDark : styles.dotInactiveLight),
                dot.isActive && styles.dotActiveWide
              ]} 
            />
          ))}
        </View>
      </Pressable>
    );
});

export function TimelineScroller({selectedDate, setSelectedDate, scrollRef, datesDays, visibleEventId}: TimelineScrollerProps) {
    const { fontScale, width: windowWidth } = useWindowDimensions();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // State to track the currently most visible month in the scroll view
    const [visibleMonthDate, setVisibleMonthDate] = useState<Date | null>(selectedDate || null);

    const ITEM_WIDTH_PX = useMemo(
      () => STYLE_VALUES.ITEM_WIDTH_BASE * fontScale + STYLE_VALUES.ITEM_WIDTH_OFFSET,
      [fontScale]
    );

    const formattedDates = useMemo(() => {
      if (datesDays) {
        return datesDays.map((el) => {
          if (
            resetTime(new Date(el.date)).getTime() <
            resetTime(getCurrentDate()).getTime()
          )
            return 'old';
          if (
            resetTime(new Date(el.date)).getTime() ===
            resetTime(getCurrentDate()).getTime()
          )
            return 'today';
        });
      }
      return [];
    }, [datesDays]);

    const currentDateIndex = useMemo(() => {
      if (!selectedDate) {
        return formattedDates.findIndex((el: string | undefined) => el === 'today');
      }
      return datesDays.findIndex(d => d.date.toDateString() === selectedDate.toDateString());
    }, [formattedDates, selectedDate, datesDays]);

    // Auto-scroll when the active date changes (from scrolling the list)
    useEffect(() => {
      if (currentDateIndex >= 0 && scrollRef.current && datesDays.length > 0) {
        try {
          scrollRef.current.scrollToIndex({
            index: currentDateIndex,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (e) {
          // ignore
        }
      }
    }, [currentDateIndex, datesDays]);

    const handleScroll = (event: any) => {
      if (!datesDays || datesDays.length === 0) return;
      
      const offsetX = event.nativeEvent.contentOffset.x;
      const centerContentX = offsetX + (windowWidth / 2) - 12;
      
      let index = Math.floor(centerContentX / ITEM_WIDTH_PX);
      if (index < 0) index = 0;
      if (index >= datesDays.length) index = datesDays.length - 1;

      const centerDate = datesDays[index]?.date;
      if (centerDate) {
        if (!visibleMonthDate || 
            centerDate.getMonth() !== visibleMonthDate.getMonth() ||
            centerDate.getFullYear() !== visibleMonthDate.getFullYear()) {
          setVisibleMonthDate(new Date(centerDate));
        }
      }
    };

    const uniqueMonths = useMemo(() => {
      const months: { id: string; date: Date; label: string }[] = [];
      const seen = new Set<string>();
      
      if (!datesDays) return months;
      
      datesDays.forEach(d => {
        const id = `${d.date.getFullYear()}-${d.date.getMonth()}`;
        if (!seen.has(id)) {
          seen.add(id);
          months.push({ id, date: d.date, label: formatMonth(d.date) });
        }
      });
      return months;
    }, [datesDays]);

    const activeMonthIndex = useMemo(() => {
      if (!visibleMonthDate) return 0;
      const id = `${visibleMonthDate.getFullYear()}-${visibleMonthDate.getMonth()}`;
      const idx = uniqueMonths.findIndex(m => m.id === id);
      return Math.max(0, idx);
    }, [visibleMonthDate, uniqueMonths]);

    const scrollAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(scrollAnim, {
        toValue: -activeMonthIndex * 140, // 140 is the fixed width for each month item
        useNativeDriver: true,
        bounciness: 0,
        speed: 12,
      }).start();
    }, [activeMonthIndex, scrollAnim]);

    if (!datesDays || !datesDays.length) return <></>;

    return (
      <View style={styles.container}>
        <View style={styles.monthStripWrapper}>
          <Animated.View style={[styles.monthStripAnimated, { transform: [{ translateX: scrollAnim }] }]}>
            {uniqueMonths.map((m, index) => {
              const isMain = index === activeMonthIndex;
              return (
                <View key={m.id} style={styles.monthItem}>
                  <ThemedText style={[
                    isMain ? styles.monthTextMain : styles.monthTextSide,
                    isMain 
                      ? (isDark ? styles.monthTextMainDark : styles.monthTextMainLight)
                      : (isDark ? styles.monthTextSideDark : styles.monthTextSideLight)
                  ]}>
                    {m.label}
                  </ThemedText>
                </View>
              );
            })}
          </Animated.View>
        </View>
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={datesDays}
          horizontal
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 700));
            wait.then(() => {
              scrollRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
              });
            });
          }}
          getItemLayout={(data, index) => {
            return {
              length: ITEM_WIDTH_PX,
              offset: ITEM_WIDTH_PX * index,
              index,
            };
          }}
          initialScrollIndex={currentDateIndex >= 0 ? currentDateIndex : 0}
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isDaySelected = item.date.toDateString() === selectedDate?.toDateString();

            return (
              <Day
                item={item}
                formattedDates={formattedDates}
                setSelectedDate={setSelectedDate}
                isDaySelected={isDaySelected}
                index={index}
                itemWidth={ITEM_WIDTH_PX}
                visibleEventId={visibleEventId}
                isDark={isDark}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
}

const STYLE_VALUES = {
  ITEM_WIDTH_BASE: 56, // Adjusted to fit the new design (48 width + 8 total margin horizontally approx)
  ITEM_WIDTH_OFFSET: 4,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  monthStripWrapper: {
    overflow: 'hidden',
    marginBottom: 8,
    height: 32,
    justifyContent: 'flex-end',
  },
  monthStripAnimated: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  monthItem: {
    width: 140, // Uniform fixed width for all months
    paddingLeft: 12,
  },
  monthTextMain: {
    fontSize: 22,
    fontWeight: '600',
  },
  monthTextMainLight: {
    color: '#11181C',
  },
  monthTextMainDark: {
    color: '#ECEDEE',
  },
  monthTextSide: {
    fontSize: 16,
    fontWeight: '400',
  },
  monthTextSideLight: {
    color: '#A0A0A0',
  },
  monthTextSideDark: {
    color: '#687076',
  },
  listContent: {
    paddingLeft: 12,
    paddingRight: 20,
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBoxActive: {
    backgroundColor: '#FF7324', // Orange
  },
  dateBoxInactiveLight: {
    backgroundColor: '#EAEAEA',
  },
  dateBoxInactiveDark: {
    backgroundColor: '#2A2A2A',
  },
  dateBoxEmpty: {
    width: 36,
    height: 62, // Total height of normal item: 48 (box) + 8 (margin) + 6 (dots)
    paddingBottom: 14, // Push the text up to match the visual center of the 48px box
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  dayText: {
    fontSize: 20,
    fontWeight: '400',
  },
  dayTextActive: {
    color: '#11181C', // Dark text on active orange
  },
  dayTextInactiveLight: {
    color: '#687076',
  },
  dayTextInactiveDark: {
    color: '#9BA1A6',
  },
  dayTextEmptyLight: {
    fontSize: 15,
    color: '#A0A0A0', // Greyed out text
  },
  dayTextEmptyDark: {
    fontSize: 15,
    color: '#555555', // Greyed out text for dark mode
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 6,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActiveWide: {
    width: 14, 
  },
  dotActive: {
    backgroundColor: '#FF7324',
  },
  dotInactiveLight: {
    backgroundColor: '#4A4A4A',
  },
  dotInactiveDark: {
    backgroundColor: '#A0A0A0',
  },
});