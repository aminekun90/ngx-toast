import { TestBed } from "@angular/core/testing";
import { provideToast } from "./toast.config";
import { ToastService } from "./Toast.service";

describe("ToastService", () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideToast({ duration: 1000 })],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("assigns a default icon based on type", () => {
    service.success("ok");
    expect(service.toasts()[0].icon).toEqual(["fas", "check-circle"]);
  });

  it("auto-dismisses after the configured duration", () => {
    service.info("hi");
    expect(service.toasts()).toHaveLength(1);
    vi.advanceTimersByTime(1000); // duration
    vi.advanceTimersByTime(400); // exit animation
    expect(service.toasts()).toHaveLength(0);
  });

  it("promise() swaps the loading toast in place instead of duplicating", async () => {
    await service.promise(Promise.resolve("data"), {
      loading: "loading...",
      success: "done",
      error: "fail",
    });

    // a single toast, swapped in place from loading to success
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].type).toBe("success");
    expect(service.toasts()[0].message).toBe("done");
  });

  it("does not reuse ids across an emptied list (no stale-timer collision)", () => {
    const first = service.info("a");
    service.remove(first);
    vi.advanceTimersByTime(400);
    const second = service.info("b");
    expect(second).not.toBe(first);
  });

  it("clear() dismisses every toast", () => {
    service.info("a");
    service.success("b");
    service.clear();
    vi.advanceTimersByTime(400);
    expect(service.toasts()).toHaveLength(0);
  });

  it("pause() then resume() extends the lifetime past the original duration", () => {
    const id = service.info("hi");
    vi.advanceTimersByTime(500);
    service.pause(id);
    vi.advanceTimersByTime(5000); // would have expired if not paused
    expect(service.toasts()).toHaveLength(1);
    service.resume(id);
    vi.advanceTimersByTime(500); // remaining 500ms
    vi.advanceTimersByTime(400);
    expect(service.toasts()).toHaveLength(0);
  });
});
