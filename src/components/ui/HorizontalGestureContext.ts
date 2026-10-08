import { createContext } from 'react';

/**
 * Lets a horizontally scrolling child claim the current touch, so an ancestor horizontal gesture
 * (e.g. swiping between tabs) ignores it. The provider resets the claim at the start of every touch;
 * children call it from `onTouchStart`.
 */
export const HorizontalGestureContext = createContext<(() => void) | null>(null);
