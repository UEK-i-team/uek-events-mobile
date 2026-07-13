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
  },
  dateBoxActive: {
    backgroundColor: '#FF7324', // Orange
  },
  dateBoxInactiveLight: {
    backgroundColor: '#EAEAEA',
  },
  dateBoxInactiveDark: {
    backgroundColor: '#A0A0A0',
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
    color: '#687076',
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
