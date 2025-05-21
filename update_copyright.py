#!/usr/bin/env python3
"""
Script to update copyright notices in source files.
This script finds all files containing the Bytedance copyright notice and
adds an additional line acknowledging contributions by Emmi C.
"""

import os
import re
import argparse
from pathlib import Path

# Define the original copyright pattern
COPYRIGHT_PATTERN = r'(# |// )Copyright \(c\) 2025 Bytedance Ltd\. and/or its affiliates'
LICENSE_PATTERN = r'Copyright \(c\) 2025 Bytedance Ltd\. and/or its affiliates'

# Define the new copyright text to add
ADDITIONAL_TEXT_PY = "# Modifications and enhancements by Emmi C (GreenCeltAI)"
ADDITIONAL_TEXT_JS = "// Modifications and enhancements by Emmi C (GreenCeltAI)"
ADDITIONAL_TEXT_LICENSE = "Modifications and enhancements by Emmi C (GreenCeltAI)"

def update_file_copyright(file_path):
    """Update the copyright notice in a single file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Handle Python/Shell files
    if file_path.suffix in ('.py', '.sh'):
        if re.search(COPYRIGHT_PATTERN, content) and not re.search(re.escape(ADDITIONAL_TEXT_PY), content):
            modified_content = re.sub(
                COPYRIGHT_PATTERN,
                f'\\g<1>Copyright (c) 2025 Bytedance Ltd. and/or its affiliates\n{ADDITIONAL_TEXT_PY}',
                content
            )
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(modified_content)
            return True
    
    # Handle JavaScript/TypeScript files
    elif file_path.suffix in ('.js', '.jsx', '.ts', '.tsx'):
        if re.search(COPYRIGHT_PATTERN, content) and not re.search(re.escape(ADDITIONAL_TEXT_JS), content):
            modified_content = re.sub(
                COPYRIGHT_PATTERN,
                f'\\g<1>Copyright (c) 2025 Bytedance Ltd. and/or its affiliates\n{ADDITIONAL_TEXT_JS}',
                content
            )
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(modified_content)
            return True
    
    # Handle LICENSE file
    elif file_path.name == 'LICENSE':
        if re.search(LICENSE_PATTERN, content) and not re.search(re.escape(ADDITIONAL_TEXT_LICENSE), content):
            modified_content = re.sub(
                LICENSE_PATTERN,
                f'Copyright (c) 2025 Bytedance Ltd. and/or its affiliates\n{ADDITIONAL_TEXT_LICENSE}',
                content
            )
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(modified_content)
            return True
    
    return False

def main():
    parser = argparse.ArgumentParser(description='Update copyright notices in the codebase')
    parser.add_argument('--directory', default='.', help='Root directory to search for files')
    parser.add_argument('--dry-run', action='store_true', help='Show files that would be changed without modifying them')
    args = parser.parse_args()

    root_dir = Path(args.directory)
    updated_files = []
    
    # Process all files recursively
    for path in root_dir.glob('**/*'):
        if path.is_file() and path.suffix in ('.py', '.js', '.jsx', '.ts', '.tsx', '.sh') or path.name == 'LICENSE':
            try:
                if args.dry_run:
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()
                        if (re.search(COPYRIGHT_PATTERN, content) or 
                            (path.name == 'LICENSE' and re.search(LICENSE_PATTERN, content))):
                            updated_files.append(path)
                else:
                    if update_file_copyright(path):
                        updated_files.append(path)
            except Exception as e:
                print(f"Error processing {path}: {e}")
    
    action = "Would update" if args.dry_run else "Updated"
    print(f"{action} {len(updated_files)} files:")
    for file_path in updated_files:
        print(f" - {file_path}")

if __name__ == "__main__":
    main() 