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
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: .5,
    borderColor: '#111111',
    paddingTop: 4,
  },
  dateBoxActive: {
    backgroundColor: '#FF7324', // Orange
  },
  dateBoxInactiveLight: {
    backgroundColor: '#EAEAEA',
  },
  dateBoxInactiveDark: {
    backgroundColor: '#A0A0A0', // lub A0A0A0
  },
  dateBoxEmpty: {
    width: 36,
    height: 62, // Total height of normal item: 48 (box) + 8 (margin) + 6 (dots)
    paddingBottom: 8, // Push the text up to match the visual center of the 48px box
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '400',
  },
  dayOfWeek: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -2,
  },
  dayTextActive: {
    color: '#11181C', // Dark text on active orange
  },
  dayOfWeekActive: {
    color: '#11181C',
  },
  dayTextInactiveLight: {
    color: '#687076',
  },
  dayOfWeekInactiveLight: {
    color: '#687076',
  },
  dayTextInactiveDark: {
    color: '#111111',
  },
  dayOfWeekInactiveDark: {
    color: '#111111',
  },
  dayTextEmptyLight: {
    fontSize: 15,
    color: '#A0A0A0', // Greyed out text
  },
  dayOfWeekEmptyLight: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: -2,
  },
  dayTextEmptyDark: {
    fontSize: 15,
    color: '#555555', // Greyed out text for dark mode
  },
  dayOfWeekEmptyDark: {
    fontSize: 10,
    color: '#555555',
    marginTop: -2,
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
