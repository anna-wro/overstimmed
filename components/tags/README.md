# TagMultiSelectInput Component

A reusable multi-select tag input component that supports autocomplete, suggestions, and custom tag creation.

## Features

- **Multi-select functionality** with tag badges
- **Autocomplete suggestions** from predefined tags
- **Custom tag creation** for user-defined tags
- **Keyboard navigation** (arrow keys, enter, escape, backspace)
- **Persistent storage** of user's custom tags
- **Configurable copy/text** for different use cases
- **Configurable categories** for different tag types (triggers, moods, etc.)
- **Accessible** with proper ARIA attributes

## Basic Usage

```tsx
import { TagMultiSelectInput, createTagMultiSelectCopy } from "@/components/tags/TagMultiSelectInput"
import { trackingPageCopy } from "@/copy/track"
import { DEFAULT_TRIGGERS, TRIGGER_CATEGORIES } from "@/consts/triggerConstants"

function MyComponent() {
  const [tags, setTags] = useState<string[]>([])

  return (
    <TagMultiSelectInput
      value={tags}
      onChange={setTags}
      copy={createTagMultiSelectCopy(trackingPageCopy.trigger)}
      inputId="my-tags"
      storageKey="myTags"
      defaultTags={DEFAULT_TRIGGERS}
      categories={TRIGGER_CATEGORIES}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | - | Array of selected tag strings |
| `onChange` | `(tags: string[]) => void` | - | Callback when tags change |
| `copy` | `TagMultiSelectCopy` | - | Text/copy configuration object |
| `inputId` | `string` | `"tags"` | HTML ID for the input element |
| `storageKey` | `string` | `"tags"` | LocalStorage key for persisting custom tags |
| `defaultTags` | `Tag[]` | `DEFAULT_TRIGGERS` | Default available tags |
| `categories` | `CategoryType[]` | `TRIGGER_CATEGORIES` | Categories for filtering and icons |

## Copy Configuration

The `copy` prop expects an object with the following structure:

```tsx
interface TagMultiSelectCopy {
  label: string                    // Label text above the input
  placeholder: string              // Placeholder when no tags selected
  placeholderMore: string          // Placeholder when tags are selected
  showSuggestions: string          // Aria label for show suggestions button
  hideSuggestions: string          // Aria label for hide suggestions button
  removeTag: string                // Remove button label (use {tag} placeholder)
  helpText: string                 // Help text below the input
}
```

## Category Configuration

Categories should follow this structure:

```tsx
type CategoryType = {
  id: string           // Unique identifier
  name: string         // Display name
  icon: React.ElementType  // Lucide icon component
  color: string        // Tailwind color class
}
```

## Helper Functions

### `createTagMultiSelectCopy(source)`

Creates a `TagMultiSelectCopy` object from existing copy structures (like `trackingPageCopy.trigger`):

```tsx
const copy = createTagMultiSelectCopy(trackingPageCopy.mood)
```

## Examples

### Mood Tracking

```tsx
import { DEFAULT_MOODS, MOOD_CATEGORIES } from "@/consts/moodConstants"

<TagMultiSelectInput
  value={moods}
  onChange={setMoods}
  copy={createTagMultiSelectCopy(trackingPageCopy.mood)}
  inputId="moods"
  storageKey="moodTags"
  defaultTags={DEFAULT_MOODS}
  categories={MOOD_CATEGORIES}
/>
```

### Custom Tags

```tsx
const customCopy = {
  label: "Skills",
  placeholder: "Add skills...",
  placeholderMore: "Add more skills...",
  showSuggestions: "Show skill suggestions",
  hideSuggestions: "Hide skill suggestions", 
  removeTag: "Remove {tag}",
  helpText: "Press Enter to add a skill."
}

const skillTags = [
  { text: "JavaScript", category: "programming" },
  { text: "React", category: "programming" },
  { text: "Design", category: "creative" }
]

const skillCategories = [
  { id: "programming", name: "Programming", icon: Code, color: "text-blue-500" },
  { id: "creative", name: "Creative", icon: Palette, color: "text-purple-500" }
]

<TagMultiSelectInput
  value={skills}
  onChange={setSkills}
  copy={customCopy}
  inputId="skills"
  storageKey="skillTags"
  defaultTags={skillTags}
  categories={skillCategories}
/>
```

## Tag Structure

Tags should follow this structure:

```tsx
type Tag = {
  text: string      // Display text for the tag
  category: string  // Category for grouping/filtering
}
```

## Keyboard Shortcuts

- **Enter**: Add current input as tag or select focused suggestion
- **Backspace**: Remove last tag when input is empty
- **Arrow Up/Down**: Navigate suggestions
- **Escape**: Close suggestions dropdown
- **Tab**: Navigate to next form element 