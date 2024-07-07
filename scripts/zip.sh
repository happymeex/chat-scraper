#!/bin/bash

folder_to_zip="chrome-extension"

zip -r "${folder_to_zip}.zip" "$folder_to_zip"

if [ $? -eq 0 ]; then
    echo "Extension successfully zipped to ${folder_to_zip}.zip"
else
    echo "Failed to zip chrome extension!"
fi
