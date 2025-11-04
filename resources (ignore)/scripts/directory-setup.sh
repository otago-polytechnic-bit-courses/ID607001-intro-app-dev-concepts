#!/bin/bash

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

created_count=0

for md_file in "$TARGET_DIR"/*.md; do
    # Check if any .md files exist
    if [ ! -e "$md_file" ]; then
        echo "No markdown files found in '$TARGET_DIR'"
        exit 0
    fi
    
    basename=$(basename "$md_file" .md)
    
    folder_path="$TARGET_DIR/$basename"
    
    if [ -d "$folder_path" ]; then
        echo "Folder already exists: $basename"
    else
        mkdir "$folder_path"
        echo "Created folder: $basename"
        ((created_count++))
    fi
done

echo ""
echo "Total folders created: $created_count"