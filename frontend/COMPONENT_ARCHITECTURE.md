# 🌳 UI Component Architecture

## Component Hierarchy

```
App.tsx
├── WagmiProvider (Web3 config)
│   ├── QueryClientProvider (React Query)
│   │   ├── RainbowKitProvider (Wallet UI)
│   │   │   └── ToastProvider ✨ (Global notifications)
│   │   │       └── Router
│   │   │           ├── Routes
│   │   │           │   ├── Landing
│   │   │           │   ├── EventsList
│   │   │           │   ├── EventDetails
│   │   │           │   ├── MyTickets
│   │   │           │   ├── CreateOrganization
│   │   │           │   ├── Dashboard
│   │   │           │   ├── CreateEvent
│   │   │           │   ├── WorkerManagement
│   │   │           │   ├── Sponsorships
│   │   │           │   ├── ComponentShowcase
│   │   │           │   └── NotFound
│   │   │           └── Toast Container (Portal to body)
```

## Component Composition Patterns

### 📦 Card Pattern (Compound Component)
```
Card
├── CardHeader
│   ├── CardTitle
│   └── CardDescription (optional)
├── CardBody
│   └── [Your Content]
└── CardFooter
    └── [Action Buttons]
```

**Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Event Details</CardTitle>
    <CardDescription>View and manage your event</CardDescription>
  </CardHeader>
  <CardBody>
    <Input label="Name" />
    <Input label="Date" type="date" />
  </CardBody>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### 🔔 Modal Pattern (Portal + Compound)
```
Modal (Portal to document.body)
├── Overlay (backdrop blur)
└── Dialog Container
    ├── Header (with close button)
    ├── ModalBody
    │   └── [Your Content]
    └── ModalFooter
        └── [Action Buttons]
```

**Example:**
```tsx
<Modal isOpen={open} onClose={close} title="Confirm">
  <ModalBody>
    <p>Are you sure?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Delete</Button>
  </ModalFooter>
</Modal>
```

### 🍞 Toast Pattern (Context + Portal)
```
ToastProvider (Context)
├── [Your App Components]
│   └── useToast() hook access
└── ToastContainer (Portal to document.body)
    └── Toast Items (stacked)
        ├── Toast 1 (success)
        ├── Toast 2 (error)
        └── Toast 3 (info)
```

**Example:**
```tsx
// Setup (already done in App.tsx)
<ToastProvider>
  <YourApp />
</ToastProvider>

// Usage anywhere
const { success, error } = useToast();
success('Saved!');
error('Failed!');
```

## Component Dependencies

```
Button
└── cn() utility

Card (+ subcomponents)
└── cn() utility

Input
├── cn() utility
└── forwardRef

Modal (+ subcomponents)
├── cn() utility
├── createPortal (react-dom)
├── useEffect (keyboard & scroll)
└── useState (local state)

Toast (+ Provider)
├── cn() utility
├── createContext/useContext
├── createPortal (react-dom)
├── useState (toasts array)
├── useCallback (memoized functions)
└── setTimeout (auto-dismiss)

Badge
└── cn() utility

Skeleton (+ presets)
└── cn() utility
```

## Utility Dependencies

All components use:
```
cn() utility
├── clsx (conditional classes)
└── tailwind-merge (merge conflicts)
```

From: `src/lib/utils.ts`

## Type Exports

```typescript
// Button
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
} & HTMLButtonElement attributes

// Card
export type CardProps = {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
} & HTMLDivElement attributes

// Input
export type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
} & HTMLInputElement attributes

// Modal
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: ReactNode;
  className?: string;
}

// Toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Badge
export type BadgeProps = {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
} & HTMLSpanElement attributes

// Skeleton
export type SkeletonProps = {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  animate?: boolean;
} & HTMLDivElement attributes
```

## State Management

### Local State (useState)
- Modal: `isOpen` state
- Input: `value` state (controlled)
- ComponentShowcase: demo states

### Context State (Toast)
```typescript
ToastContext {
  toasts: Toast[];
  addToast: (type, message, duration?) => void;
  removeToast: (id) => void;
  success: (message, duration?) => void;
  error: (message, duration?) => void;
  warning: (message, duration?) => void;
  info: (message, duration?) => void;
}
```

### Derived State
- Badge: color classes from variant
- Button: loading spinner visibility
- Input: error border from error prop
- Skeleton: count-based rendering

## Animation Classes

All components use Tailwind custom animations:

```css
/* From index.css */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slide-in {
  from { transform: translateX(2rem); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**Used in:**
- Modal: `animate-fade-in` (overlay), `animate-slide-up` (dialog)
- Toast: `animate-slide-in` (notification)
- Badge dot: `animate-pulse-slow` (status indicator)
- Skeleton: `animate-pulse` (Tailwind default)

## Accessibility Features

### Keyboard Navigation
- **Button**: Enter/Space activation
- **Modal**: ESC to close, focus trap
- **Input**: Standard form navigation
- **Toast**: Dismiss with keyboard

### ARIA Attributes
```typescript
// Button
role="button" (implicit)
aria-disabled={disabled}

// Input
aria-invalid={error ? 'true' : 'false'}
aria-describedby={errorId || helperId}

// Modal
role="dialog"
aria-modal="true"
aria-labelledby={titleId}

// Toast
role="alert"

// Badge (implicit)
// Skeleton (implicit)
```

### Focus Management
- All interactive elements have visible focus rings
- Focus trapped in Modal when open
- Focus restored after Modal close
- Tab order preserved

## Responsive Behavior

### Breakpoints (from Tailwind)
```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

### Component Adaptations
- **Modal**: Full width on mobile (`mx-4`)
- **Card**: Grid layouts collapse on mobile
- **Button**: Full width option for mobile
- **Input**: Full width by default
- **Toast**: Fixed positioning adjusts
- **Badge**: Font size scales
- **Skeleton**: Responsive widths

## Performance Considerations

### Optimizations
- ✅ forwardRef for all form components
- ✅ Portal rendering (Modal, Toast) - avoids re-renders
- ✅ useCallback in Toast context - memoized functions
- ✅ Minimal re-renders (local state)
- ✅ CSS animations (GPU accelerated)
- ✅ Lazy loading compatible (code splitting)

### Bundle Impact
```
Components:     ~15KB (minified + gzipped)
Dependencies:   
  - clsx:              ~1KB
  - tailwind-merge:    ~5KB
  - react-dom/portal:  0KB (included in React)
Total:          ~21KB
```

## Testing Strategy

### Component Showcase Page
Visit `/showcase` to:
- ✅ Visually test all variants
- ✅ Interact with components
- ✅ See responsive behavior
- ✅ Copy usage examples
- ✅ Verify accessibility

### Manual Testing Checklist
- [ ] All button variants render correctly
- [ ] Card composition works
- [ ] Input validation displays errors
- [ ] Modal opens/closes properly
- [ ] Toast notifications stack
- [ ] Badge colors are correct
- [ ] Skeletons animate smoothly
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] Mobile responsive
- [ ] Dark mode ready (future)

## Future Enhancements

### Possible Additions
- [ ] Dropdown/Select component
- [ ] Checkbox component
- [ ] Radio component
- [ ] Switch/Toggle component
- [ ] Textarea component
- [ ] Tabs component
- [ ] Accordion component
- [ ] Tooltip component
- [ ] Progress bar
- [ ] Avatar component
- [ ] Alert/Banner component
- [ ] Pagination component
- [ ] Search input with debounce
- [ ] Date picker component
- [ ] File upload component

### Possible Improvements
- [ ] Dark mode variants
- [ ] Animation customization
- [ ] Theme provider (colors)
- [ ] Component testing (Vitest + Testing Library)
- [ ] Storybook integration
- [ ] CSS-in-JS alternative
- [ ] More preset skeletons
- [ ] Toast position options
- [ ] Modal stacking (multiple modals)
- [ ] Form context wrapper

---

**Current Status:** 7 core components complete, production-ready, fully documented.

**Next Phase:** Layout components (Header, Footer, Sidebar) to wrap pages.
