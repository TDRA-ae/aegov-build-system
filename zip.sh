#!/bin/bash

# Exit on error
set -e

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create build directory if it doesn't exist
mkdir -p dist

# Create zip file with timestamp
ZIP_FILE="build_$TIMESTAMP.zip"

# Create zip archive
zip -r $ZIP_FILE ./* -x "node_modules/*" "dist/*" ".git/*" ".gitignore" "package-lock.json" ".DS_Store" ".env*" "*.sh"

echo "Build zipped successfully to $ZIP_FILE"
