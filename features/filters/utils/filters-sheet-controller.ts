type SheetPhase = "closed" | "opening" | "open" | "closing";

interface FiltersSheetControllerOptions {
  present: () => void;
  dismiss: () => void;
  onClose: (didDismiss: boolean) => void;
}

/** Serializes modal commands, including requests made before its portal mounts. */
export function createFiltersSheetController({
  present,
  dismiss,
  onClose,
}: FiltersSheetControllerOptions) {
  let phase: SheetPhase = "closed";
  let focused = false;
  let presentFrame: number | null = null;
  let ready = false;
  let closeRequested = false;
  let dismissSent = false;

  const finishClose = (didDismiss: boolean) => {
    phase = "closed";
    ready = false;
    closeRequested = false;
    dismissSent = false;
    onClose(didDismiss);
  };

  const dismissWhenReady = () => {
    if (!ready || !closeRequested || dismissSent) return;

    dismissSent = true;
    phase = "closing";
    dismiss();
  };

  const close = () => {
    if (phase === "closed") return false;

    closeRequested = true;
    if (presentFrame !== null) {
      cancelAnimationFrame(presentFrame);
      presentFrame = null;
      finishClose(false);
    } else {
      // present() itself schedules a frame. dismiss() is a no-op until the
      // modal starts animating or reports an open position, so retain intent.
      dismissWhenReady();
    }
    return true;
  };

  return {
    open() {
      if (phase !== "closed") return;
      if (!focused) {
        onClose(false);
        return;
      }

      phase = "opening";
      presentFrame = requestAnimationFrame(() => {
        presentFrame = null;
        present();
      });
    },

    close,

    setFocused(value: boolean) {
      focused = value;
      if (!focused) close();
    },

    onAnimate(_fromIndex: number, toIndex: number) {
      if (phase === "closed") return;

      ready = true;
      if (!dismissSent) {
        phase = toIndex === -1 ? "closing" : "opening";
      }
      dismissWhenReady();
    },

    onChange(index: number) {
      if (phase === "closed") return;

      ready = true;
      if (!dismissSent) {
        phase = index === -1 ? "closing" : "open";
      }
      dismissWhenReady();
    },

    onDismiss() {
      if (phase === "closed") return;

      // A dismissal can arrive without onChange(-1) when opening is interrupted.
      // Keep new presentations blocked until the modal has actually unmounted.
      finishClose(true);
    },
  };
}
