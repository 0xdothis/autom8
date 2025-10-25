# UI Components

Complete set of reusable UI components following the black/white design system.

## 📦 Components Overview

### Button
Versatile button component with multiple variants and states.

**Variants:**
- `primary` - Black background, white text (default)
- `secondary` - White background, black text with border
- `ghost` - Transparent background
- `danger` - Red background for destructive actions

**Sizes:** `sm`, `md`, `lg`

**Props:**
- `loading` - Shows loading spinner
- `fullWidth` - Takes full width of container
- `disabled` - Disables interaction

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" loading={isPending}>
  Create Event
</Button>
```

---

### Card
Container component with optional header, body, and footer sections.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section with optional border
- `CardTitle` - Title heading (h1-h6)
- `CardDescription` - Subtitle text
- `CardBody` - Main content area
- `CardFooter` - Footer with action buttons

**Props:**
- `hover` - Adds hover shadow effect
- `padding` - `none`, `sm`, `md`, `lg`

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@/components/ui';

<Card hover>
  <CardHeader>
    <CardTitle>Event Details</CardTitle>
  </CardHeader>
  <CardBody>
    <p>Content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

### Input
Text input with label, validation, icons, and helper text.

**Types:** `text`, `email`, `password`, `number`, `date`, `tel`, etc.

**Props:**
- `label` - Input label
- `error` - Error message (shows red border)
- `helperText` - Helper text below input
- `leftIcon` - Icon on left side
- `rightIcon` - Icon on right side
- `fullWidth` - Takes full width
- `required` - Shows asterisk

**Usage:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Event Name"
  placeholder="Enter name"
  required
  error={errors.name}
  leftIcon={<SearchIcon />}
/>
```

---

### Modal
Dialog overlay with backdrop blur and animations.

**Props:**
- `isOpen` - Controls visibility
- `onClose` - Close handler
- `title` - Modal title
- `size` - `sm`, `md`, `lg`, `xl`, `full`
- `closeOnOverlayClick` - Close when clicking outside (default: true)
- `closeOnEscape` - Close on ESC key (default: true)
- `showCloseButton` - Show X button (default: true)

**Components:**
- `ModalHeader` - Header section
- `ModalBody` - Content section
- `ModalFooter` - Footer with action buttons

**Usage:**
```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

---

### Toast
Notification system with success, error, warning, and info variants.

**Setup:**
1. Wrap app with `ToastProvider` (already done in `App.tsx`)
2. Use `useToast` hook in components

**Methods:**
- `success(message, duration?)` - Green success notification
- `error(message, duration?)` - Red error notification
- `warning(message, duration?)` - Amber warning notification
- `info(message, duration?)` - Blue info notification

**Usage:**
```tsx
import { useToast } from '@/components/ui';

const MyComponent = () => {
  const { success, error } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      success('Saved successfully!');
    } catch (err) {
      error('Failed to save. Please try again.');
    }
  };
  
  return <Button onClick={handleSave}>Save</Button>;
};
```

---

### Badge
Small status indicator with variants and optional dot.

**Variants:**
- `default` - Gray
- `success` - Green
- `error` - Red
- `warning` - Amber
- `info` - Blue
- `outline` - Transparent with border

**Sizes:** `sm`, `md`, `lg`

**Props:**
- `dot` - Shows animated dot (useful for live status)

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" dot>Active</Badge>
<Badge variant="error">Ended</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

---

### Skeleton
Loading placeholder with animations.

**Variants:**
- `text` - Text line placeholder
- `circular` - Circle (avatars)
- `rectangular` - Rectangle (images, cards)

**Props:**
- `count` - Number of skeleton lines
- `width` - Custom width
- `height` - Custom height
- `animate` - Enable pulse animation (default: true)

**Preset Components:**
- `SkeletonCard` - Card loading state
- `SkeletonTable` - Table loading state
- `SkeletonAvatar` - Avatar loading state
- `SkeletonText` - Multiple text lines

**Usage:**
```tsx
import { Skeleton, SkeletonCard } from '@/components/ui';

// While loading
{isLoading ? (
  <SkeletonCard />
) : (
  <Card>...</Card>
)}

// Custom skeleton
<Skeleton variant="circular" width="4rem" height="4rem" />
<Skeleton variant="text" count={3} />
```

---

## 🎨 Design System

### Colors
All components follow the black/white color scheme:

- **Primary:** Black (`bg-black`, `text-white`)
- **Secondary:** White (`bg-white`, `text-black`, `border-gray-200`)
- **Status:**
  - Success: `text-green-600`, `bg-green-100`
  - Error: `text-red-600`, `bg-red-100`
  - Warning: `text-amber-600`, `bg-amber-100`
  - Info: `text-blue-600`, `bg-blue-100`

### Typography
- Font: Inter (body), JetBrains Mono (code)
- Sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

### Spacing
- Padding: `p-2`, `p-4`, `p-6`, `p-8`
- Margin: `m-2`, `m-4`, `m-6`, `m-8`
- Gap: `gap-2`, `gap-3`, `gap-4`

### Border Radius
- Small: `rounded-md` (6px)
- Medium: `rounded-lg` (8px)
- Large: `rounded-xl` (12px)
- Full: `rounded-full` (9999px)

### Shadows
- Small: `shadow-sm`
- Medium: `shadow-md`
- Large: `shadow-lg`
- XL: `shadow-2xl`

---

## 🧪 Testing Components

Visit `/showcase` in development to see all components with all variants:

```bash
npm run dev
# Open http://localhost:3001/showcase
```

This page demonstrates:
- All button variants and states
- Card layouts
- Input fields with validation
- Modal dialogs
- Toast notifications
- Badge variants
- Loading skeletons
- Usage examples

---

## 🔧 Customization

All components use Tailwind CSS and can be customized via `className` prop:

```tsx
<Button className="hover:scale-105 transition-transform">
  Custom Button
</Button>

<Card className="bg-gradient-to-r from-gray-50 to-white">
  Custom Card
</Card>
```

### Using cn() utility
Components use the `cn()` utility for class merging:

```tsx
import { cn } from '@/lib/utils';

const customClasses = cn(
  'base-classes',
  condition && 'conditional-classes',
  'always-applied'
);
```

---

## 📝 Best Practices

1. **Accessibility:**
   - All components have proper ARIA attributes
   - Focus states are visible
   - Keyboard navigation supported
   - Screen reader friendly

2. **Performance:**
   - Components use `forwardRef` for ref forwarding
   - Memoization where appropriate
   - Efficient re-renders

3. **Type Safety:**
   - Full TypeScript support
   - Exported prop types
   - IntelliSense support

4. **Consistency:**
   - Follow design system colors
   - Use provided size variants
   - Maintain spacing patterns

---

## 🚀 Next Steps

After familiarizing yourself with these components:

1. Create layout components (Header, Footer, Sidebar)
2. Build feature-specific components using these as building blocks
3. Implement Web3 integration with loading states and toasts
4. Add animations with Framer Motion

See `SETUP_GUIDE.md` for detailed implementation phases.
