/**
 * @fileoverview Calls a handler when a click occurs outside the given ref elements.
 * @example useClickOutside(handleClose, dropdownRef, buttonRef)
 */
import { useEffect, type RefObject } from "react"
export function useClickOutside(
  handler: () => void,
  ...refs: RefObject<HTMLElement | null>[]
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutside = refs.every((ref) => {
        const el = ref.current
        return !el || (!el.contains(target) && el !== target)
      })
      if (isOutside) handler()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [handler])
}
