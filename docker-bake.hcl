group "default" {
  targets = [ "test", "build" ]
}

target "test" {
    dockerfile = "Dockerfile.test"
    context = "."
    tags = ["back-end-test"]
    args = {
        RUN_CHECKS=false
    }
}

target "build" {
    dockerfile = "Dockerfile"
    context = "."
    tags = ["arnavchhabra/backend-template"]
}
