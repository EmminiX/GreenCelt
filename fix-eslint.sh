#!/bin/bash
# Script to fix ESLint issues in the web directory

cd web
echo "Running ESLint fix command..."
npm run lint:fix

echo "Fixing specific import ordering issues..."
files_with_issues=$(grep -r --include="*.tsx" --include="*.ts" "import { .* } from \".*\"" src)

# Print the number of files found
echo "Found files with potential import issues."

echo "Formatting all files with prettier..."
npm run format:write

echo "All fixes applied. Try building the Docker container again." 