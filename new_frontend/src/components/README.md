# Loading Components

This directory contains loading components that use a Lottie animation for a better user experience.

## Components

### LoadingSpinner

A reusable loading spinner component that displays a Lottie animation.

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Size of the spinner (default: 'md')
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import LoadingSpinner from './components/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With custom size
<LoadingSpinner size="lg" />

// With custom styling
<LoadingSpinner 
  size="md" 
  className="bg-blue-100 rounded-full p-4" 
/>
```

### SuspenseLoader

A full-screen loading component designed to be used as a Suspense fallback.

**Usage:**
```tsx
import { Suspense } from 'react';
import SuspenseLoader from './components/SuspenseLoader';

<Suspense fallback={<SuspenseLoader />}>
  <YourComponent />
</Suspense>
```

## Integration with Suspense

The components are designed to work seamlessly with React Suspense:

```tsx
import { Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

// For individual components
<Suspense fallback={<LoadingSpinner size="md" />}>
  <SlowLoadingComponent />
</Suspense>

// For full app loading (already configured in App.tsx)
<Suspense fallback={<SuspenseLoader />}>
  <App />
</Suspense>
```

## Animation File

The loading animation is located at:
`public/images/Animation - 1751019846836.json`

This is a Lottie animation file that provides a smooth, engaging loading experience.

## Dependencies

- `lottie-react` - For rendering Lottie animations
- `react` - For React components
- `tailwindcss` - For styling (optional, can be customized)

## Customization

You can customize the appearance by:
1. Modifying the `sizeClasses` object in `LoadingSpinner.tsx`
2. Adding custom CSS classes via the `className` prop
3. Replacing the animation file with a different Lottie animation
4. Adjusting the styling in `SuspenseLoader.tsx` 