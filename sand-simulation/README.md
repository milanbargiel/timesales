# ZeitSand

Pixel simulation of some sand

Example Links:

[3 Minutes, start at 50%](https://jim-fx.com/sand/#180,0.6)

[1,5 Minutes](https://jim-fx.com/sand/#90)

[10 Minutes](https://jim-fx.com/sand/#600)

## How does it work?

[WebAssembly] --> [Javascript] --> [WebGL]

## How to run this?


## With Docker

```bash
docker build . -t sand-dev
```

```bash
docker run -p 8080:8080 sand-dev
```

## Without Docker:

### Prerequesites

- [Golang](https://golang.org/doc/install)
- [TinyGo](https://tinygo.org/getting-started/)
  - Used for compiling to wasm, because the standard go compiler produces very large files
- [Make](https://cmake.org/install/)
  - Not really needed just makes things easier
- [Node](https://nodejs.org/en/download/)


### Dev Mode

**With CMake**

```bash
make install
```

```bash
make dev
```

**Without Cmake**

```bash
[yarn/npm/pnpm] install
```

```bash
node build.mjs --watch
```

### Build

**With CMake**

```bash
make build
```

**Without Cmake**
```bash
node build.mjs
```

```bash
tinygo build -o public/build/main.wasm -target wasm ./src/backend/main.go
```