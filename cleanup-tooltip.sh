#!/bin/bash

# Set the base directory for the tooltip component
TOOLTIP_DIR="src/features/shared/Tooltip"

echo "Starting Tooltip directory cleanup..."

# 1. Remove complex theme contexts
echo "Removing theme contexts..."
rm -rf "$TOOLTIP_DIR/context/"

# 2. Remove variant directories
echo "Removing variant directories..."
rm -rf "$TOOLTIP_DIR/variants/"

# 3. Remove excessive hooks
echo "Removing excessive hooks..."
rm -rf "$TOOLTIP_DIR/hooks/"

# 4. Remove large type definitions (keeping only essential types in Tooltip.tsx)
echo "Removing complex type definitions..."
if [ -f "$TOOLTIP_DIR/types.ts" ]; then
    echo "Backing up types.ts to types.ts.bak before removal"
    cp "$TOOLTIP_DIR/types.ts" "$TOOLTIP_DIR/types.ts.bak"
    rm "$TOOLTIP_DIR/types.ts"
fi

# 5. Simplify index.ts to remove lazy loading
echo "Simplifying index.ts..."
echo 'import Tooltip from "./Tooltip";

export { default } from "./Tooltip";
export * from "./Tooltip";' > "$TOOLTIP_DIR/index.ts"

echo "Cleanup complete. Tooltip directory has been simplified."
echo "You should now update Tooltip.tsx to contain inline types and remove any references to lazy loading." 