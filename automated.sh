#!/bin/bash

# Get the current date and time
current_date=$(date +"%Y-%m-%d %H:%M:%S")

# Prompt the user for a custom commit message
echo "Enter your commit message:"
read user_commit_message

# Combine the user's message with the dynamic date and time
commit_message="$user_commit_message - $current_date  "

# Add all changes to the staging area
git add .

# Commit changes with the combined commit message
git commit -m "$commit_message"

# Push changes to the default branch (e.g., main)
git push origin main

# Run the npm build command
npm run build

echo "Changes committed and pushed to GitHub successfully!"
