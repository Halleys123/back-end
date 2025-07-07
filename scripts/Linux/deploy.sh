#!/bin/bash

# This script runs the docker buildx bake command and removes the back-end-test image if the build is successful

# Run the docker buildx bake command
echo "Running docker buildx bake..."
docker buildx bake

# Check if the previous command was successful
if [ $? -eq 0 ]; then
    echo "Build successful. Removing back-end-test image..."
    docker rmi back-end-test
    # Run docker compose
    echo "Running docker compose..."
    docker compose up
else
    echo "Build failed. Skipping image removal."
fi
