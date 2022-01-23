SHELL := /bin/bash

.DEFAULT_GOAL := help
.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

http-build-docker: ## Build Mock HTTP docker image
	@docker build -t mockhttp -f ./http/Dockerfile .

http-run-docker: ## Run Mock HTTP docker container on port 3000
	@docker run -it -p 3000:8080 mockhttp --port 3000

http-clean: ## Remove Mock HTTP docker container
	@docker rm -f mockhttp

## General

fmt: # Format code
	@yarn format

lint: # Run static analysis
	@yarn lint
