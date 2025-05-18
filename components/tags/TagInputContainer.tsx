import React from "react"

interface TagInputContainerProps {
  children: React.ReactNode
  showSuggestions: boolean
}

export const TagInputContainer: React.FC<TagInputContainerProps> = ({ children, showSuggestions }) => (
  <div
    className={[
      "flex flex-wrap items-center gap-2 rounded-md border bg-background p-2",
      showSuggestions ? "rounded-b-none border-b-0" : "",
    ].join(" ")}
  >
    {children}
  </div>
) 