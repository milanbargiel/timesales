all: build build-types

dev:
	node build.mjs --watch

install:
	yarn install

build:
	node build.mjs

build-wasm:
	tinygo build -o public/build/sand-backend.wasm -target wasm --no-debug ./src/backend/main.go

build-types:
	tsc && mv public/build/types/index.d.ts public/build/sand-bundle.d.ts && rm -rf public/build/types