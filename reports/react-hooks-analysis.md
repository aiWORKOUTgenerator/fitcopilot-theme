# React Hooks Dependency Analysis

## Files with hook dependency issues: 3

### src/features/Homepage/PersonalTraining/components/VideoPlayer/VideoPlayer.tsx

- **Line 481:** The ref value 'timeoutRef.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'timeoutRef.current' to a variable inside the effect, and use that variable in the cleanup function.

### src/hooks/useAsyncEffect.ts

- **Line 48:** React Hook useEffect was passed a dependency list that is not an array literal. This means we can't statically verify whether you've passed the correct dependencies.
- **Line 48:** React Hook useEffect has missing dependencies: 'asyncEffect' and 'onError'. Either include them or remove the dependency array. If 'asyncEffect' changes too often, find the parent component that defines it and wrap that definition in useCallback.

### src/hooks/useEventCallback.ts

- **Line 31:** React Hook useCallback was passed a dependency list that is not an array literal. This means we can't statically verify whether you've passed the correct dependencies.

## Common Issues and Solutions

1. **Missing dependencies**: Add all variables used inside the hook to the dependency array
2. **Object or array dependencies**: Convert to primitive values or memoize with useMemo
3. **Function dependencies**: Move function inside the hook or memoize with useCallback
4. **Props in dependency array**: Ensure props are memoized or used directly
5. **Constants outside dependency array**: Move constants outside the component or useEffect
6. **Deliberately skipping dependencies**: For specific cases, add an eslint-disable comment
