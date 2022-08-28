SHELL := /bin/bash

.ONESHELL:
.DEFAULT_GOAL := help
.PHONY: help

# allow user specific optional overrides
-include Makefile.overrides

export

help: ## show help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

http-build-docker: ## build mock http docker image
	@docker build -t mockhttp -f ./http/Dockerfile .

http-run-docker: ## run mock http docker container on port 3000
	@docker run -it -p 3000:8080 mockhttp --port 3000

http-clean: ## remove mock http docker container
	@docker rm -f mockhttp

fmt: ## format code
	@npm run fmt
	@npm run lint:fix

lint: ## run static analysis
	@npm run fmt:check
	@npm run lint
