import { createFiltersSheetController } from "./filters-sheet-controller";

describe("filters sheet lifecycle", () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;
  const originalRequestFrame = global.requestAnimationFrame;
  const originalCancelFrame = global.cancelAnimationFrame;

  beforeEach(() => {
    frames = new Map();
    nextFrame = 0;
    global.requestAnimationFrame = jest.fn((callback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    });
    global.cancelAnimationFrame = jest.fn((frame) => {
      frames.delete(frame);
    });
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRequestFrame;
    global.cancelAnimationFrame = originalCancelFrame;
  });

  function flushFrames() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  }

  function setup() {
    const present = jest.fn();
    const dismiss = jest.fn();
    const onClose = jest.fn();
    const controller = createFiltersSheetController({ present, dismiss, onClose });
    controller.setFocused(true);
    return { controller, present, dismiss, onClose };
  }

  it("coalesces rapid presses and waits for dismissal before allowing another open", () => {
    const { controller, present, dismiss, onClose } = setup();
    for (let i = 0; i < 20; i++) controller.open();
    flushFrames();
    controller.onAnimate(-1, 0);
    controller.onChange(0);
    for (let i = 0; i < 20; i++) controller.open();
    expect(present).toHaveBeenCalledTimes(1);

    expect(controller.close()).toBe(true);
    expect(controller.close()).toBe(true);
    controller.onChange(-1);
    controller.open();
    flushFrames();
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(present).toHaveBeenCalledTimes(1);

    controller.onDismiss();
    controller.onDismiss();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(true);
    controller.open();
    flushFrames();
    expect(present).toHaveBeenCalledTimes(2);
  });

  it("recovers when opening is interrupted and onChange(-1) is never emitted", () => {
    const { controller, present, onClose } = setup();
    controller.open();
    flushFrames();
    controller.onAnimate(-1, 0);
    // The sheet returns to its initial -1 index, so Gorhom only emits onDismiss.
    controller.onDismiss();
    expect(onClose).toHaveBeenCalledWith(true);
    expect(controller.close()).toBe(false);

    controller.open();
    flushFrames();
    expect(present).toHaveBeenCalledTimes(2);
  });

  it.each(["back", "blur"])("cancels a pending presentation on %s", (reason) => {
    const { controller, present, dismiss, onClose } = setup();
    controller.open();
    if (reason === "back") {
      expect(controller.close()).toBe(true);
    } else {
      controller.setFocused(false);
    }
    flushFrames();
    expect(present).not.toHaveBeenCalled();
    expect(dismiss).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith(false);
    expect(controller.close()).toBe(false);

    controller.setFocused(true);
    controller.open();
    flushFrames();
    expect(present).toHaveBeenCalledTimes(1);
  });

  it.each(["back", "blur"])("retains %s during the library's deferred mount", (reason) => {
    const { controller, present, dismiss, onClose } = setup();
    controller.open();
    flushFrames();
    if (reason === "back") {
      expect(controller.close()).toBe(true);
    } else {
      controller.setFocused(false);
    }
    expect(dismiss).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    // Returning to Home and pressing again must not revoke the queued close.
    controller.setFocused(true);
    controller.open();
    flushFrames();
    controller.onAnimate(-1, 0);
    expect(dismiss).toHaveBeenCalledTimes(1);
    controller.onChange(0);
    expect(dismiss).toHaveBeenCalledTimes(1);
    controller.onDismiss();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(present).toHaveBeenCalledTimes(1);

    controller.open();
    flushFrames();
    expect(present).toHaveBeenCalledTimes(2);
  });

  it("closes once a position is reported even without an animation callback", () => {
    const { controller, dismiss } = setup();
    controller.open();
    flushFrames();
    controller.close();
    controller.onChange(0);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it("closes an already open sheet on blur without reopening on focus", () => {
    const { controller, present, dismiss, onClose } = setup();
    controller.open();
    flushFrames();
    controller.onChange(0);
    controller.setFocused(false);
    controller.setFocused(true);
    flushFrames();
    expect(dismiss).toHaveBeenCalledTimes(1);
    expect(present).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    controller.onDismiss();
    expect(onClose).toHaveBeenCalledWith(true);
  });

  it("still dismisses on Back if a gesture started closing and was interrupted", () => {
    const { controller, dismiss } = setup();
    controller.open();
    flushFrames();
    controller.onChange(0);
    controller.onAnimate(0, -1);
    expect(controller.close()).toBe(true);
    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it("rejects opening outside Home and allows native Back when closed", () => {
    const { controller, present, onClose } = setup();
    controller.setFocused(false);
    controller.open();
    flushFrames();
    expect(present).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith(false);
    expect(controller.close()).toBe(false);
  });

  it("survives repeated interrupted open-close cycles", () => {
    const { controller, present, onClose } = setup();
    for (let i = 0; i < 100; i++) {
      controller.open();
      flushFrames();
      controller.onAnimate(-1, 0);
      controller.close();
      controller.open();
      controller.onDismiss();
    }
    expect(present).toHaveBeenCalledTimes(100);
    expect(onClose).toHaveBeenCalledTimes(100);
    expect(controller.close()).toBe(false);
  });
});
