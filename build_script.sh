# This is meant to replace wasm-pack because it is deprecated

cargo build \
  --lib \
  --target wasm32-unknown-unknown \
  --features include-bytes,zlib \
  --release

cargo install wasm-bindgen-cli

wasm-bindgen target/wasm32-unknown-unknown/release/courses_data.wasm \
  --out-dir target/wasm \
  --typescript \
  --target web
