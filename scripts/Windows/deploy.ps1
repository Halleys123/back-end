# This script runs the docker buildx bake command and removes the back-end-test image if the build is successful

# Run the docker buildx bake command
Write-Host "Running docker buildx bake..."
docker buildx bake

# Check if the previous command was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful. Removing back-end-test image..."
    docker rmi back-end-test
    
    # Run docker compose
    Write-Host "Running docker compose..."
    docker -d compose up
} else {
    Write-Host "Build failed. Skipping image removal."
}
