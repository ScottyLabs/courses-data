# print the possible recipes you can run
default:
    @just --list --unsorted

# compile documentation for the library
doc:
    cargo doc --no-deps

# compile and open documentation for the library
doc-open:
    cargo doc --no-deps --open

# build the library to wasm (see note in main.rs for the database arg)
build-web:
    cargo run --release --features zlib -- courses.json --only-build --force-rebuild 
    # this next step requires wasm-pack from https://drager.github.io/wasm-pack/installer/
    # at time of writing, it can be installed with `curl https://drager.github.io/wasm-pack/installer/init.sh -sSf | bash` (sh doesn't work)
    wasm-pack build --out-dir target/wasm --target web --features include-bytes --features zlib

# serve a web example of the library to localhost. (make sure build-web has been run)
[working-directory: 'target/wasm']
serve-example:
    cp ../../target/data serialized_engine
    cp ../../index.html .
    python3 -m http.server 8001