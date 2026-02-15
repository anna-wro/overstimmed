import { renderHook } from "@testing-library/react";
import { useClickOutside } from "@/hooks/shared/useClickOutside";
import { useRef } from "react";

describe("useClickOutside", () => {
  it("calls handler when clicking outside the ref element", () => {
    const handler = vi.fn();
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const insideElement = document.createElement("div");
    document.body.appendChild(insideElement);

    renderHook(() => {
      const ref = useRef<HTMLElement>(insideElement);
      useClickOutside(handler, ref);
    });

    outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(outsideElement);
    document.body.removeChild(insideElement);
  });

  it("does not call handler when clicking inside the ref element", () => {
    const handler = vi.fn();
    const insideElement = document.createElement("div");
    document.body.appendChild(insideElement);

    renderHook(() => {
      const ref = useRef<HTMLElement>(insideElement);
      useClickOutside(handler, ref);
    });

    insideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(insideElement);
  });

  it("cleans up event listener on unmount", () => {
    const handler = vi.fn();
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(null);
      useClickOutside(handler, ref);
    });

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    removeSpy.mockRestore();
  });
});
