import { RefObject, useCallback, useEffect, useRef } from "react";
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, TextInput } from "react-native";

/** Space kept visible under the input, enough for the submit button below it. */
const SPACE_BELOW_INPUT = 96;
/** Never scroll the input closer than this to the top of the window. */
const MIN_INPUT_TOP = 96;
/** Android applies the KeyboardAvoidingView padding after keyboardDidShow. */
const ANDROID_LAYOUT_DELAY_MS = 100;

/**
 * Android does not scroll a ScrollView to the focused input when the keyboard
 * opens, so a field low on a tall screen stays hidden under the keyboard.
 * Scrolls just enough to reveal the input and the space below it.
 */
export function useKeepFocusedInputVisible(scrollRef: RefObject<ScrollView | null>) {
  const scrollOffsetRef = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const subscription = Keyboard.addListener("keyboardDidShow", (event) => {
      const keyboardTop = event.endCoordinates.screenY;
      if (timer) clearTimeout(timer);

      timer = setTimeout(
        () => {
          const input = TextInput.State.currentlyFocusedInput();
          if (!input || !scrollRef.current) return;

          input.measureInWindow((_x, y, _width, height) => {
            const overlap = y + height + SPACE_BELOW_INPUT - keyboardTop;
            const delta = Math.min(overlap, y - MIN_INPUT_TOP);
            if (delta <= 0) return;
            scrollRef.current?.scrollTo({ y: scrollOffsetRef.current + delta, animated: true });
          });
        },
        Platform.OS === "android" ? ANDROID_LAYOUT_DELAY_MS : 0,
      );
    });

    return () => {
      subscription.remove();
      if (timer) clearTimeout(timer);
    };
  }, [scrollRef]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  return { onScroll };
}
