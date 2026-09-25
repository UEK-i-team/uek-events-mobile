import { theme } from "@/shared/constants/theme";
import { StyleSheet } from "react-native";

export const MONTH_ITEM_WIDTH = 140;

export const styles = StyleSheet.create({
container: {
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  monthStripWrapper: {
    overflow: 'hidden',
    marginBottom: 8,
    height: 45,
    justifyContent: 'flex-end',
    paddingLeft: 16,
  },
  monthStripAnimated: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthItem: {
    width: MONTH_ITEM_WIDTH,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
  monthTextActive: {
    fontWeight: '300',
  },
  monthTextSide: {
    fontSize: 24,
    fontWeight: '300',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 30, // Powinno być nieco większe niż fontSize
  },
  monthTextSideLight: {
    color: '#111111',
  },
  monthTextSideDark: {
    color: '#FFFFFF',
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
  dayContainerPast: {
    opacity: 0.4,
  },
  weekdayText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 4,
    includeFontPadding: false,
  },
  weekdayTextLight: {
    color: '#9A9A9A',
  },
  weekdayTextDark: {
    color: '#8C8C8C',
  },
  weekdayTextActiveLight: {
    color: '#111111',
    fontWeight: '600',
  },
  weekdayTextActiveDark: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  weekdayTextToday: {
    color: '#FF7324',
    fontWeight: '700',
  },
  dateBox: {
    width: 53,
    height: 53,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: .5,
    borderColor: '#111111',
  },
  dateBoxActive: {
    backgroundColor: '#FF7324', // Orange
  },
  dateBoxInactiveLight: {
    backgroundColor: '#E1DFDF',
  },
  dateBoxInactiveDark: {
    backgroundColor: '#A0A0A0', // lub A0A0A0
  },
  dateBoxToday: {
    borderWidth: 2,
    borderColor: '#FF7324',
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
    fontSize: 24,
    fontWeight: '400',
  },
  dayTextActive: {
    color: '#11181C', // Dark text on active orange
  },
  dayTextInactiveLight: {
    color: '#11181C',
  },
  dayTextInactiveDark: {
    color: '#111111',
  },
  dayTextEmptyLight: {
    fontSize: 15,
    color: '#A0A0A0', // Greyed out text
  },
  dayTextEmptyDark: {
    fontSize: 15,
    color: '#555555', // Greyed out text for dark mode
  },
  dayTextEmptyToday: {
    color: '#FF7324',
    fontWeight: '700',
  },
  todayMarker: {
    position: 'absolute',
    bottom: 16,
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FF7324',
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
    backgroundColor: '#E9E9E9',
  },
});

