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

cargo install wasm-opt
wasm-opt target/wasm/*.wasm -o target/wasm/*.wasm-opt.wasm -O

mv target/wasm/*.wasm-opt.wasm target/wasm/*.wasm

cat > target/wasm/package.json <<'EOF'
{
  "name": "courses-data",
  "type": "module",
  "version": "0.1.0",
  "files": [
    "courses_data_bg.wasm",
    "courses_data.js",
    "courses_data.d.ts"
  ],
  "main": "courses_data.js",
  "types": "courses_data.d.ts",
  "sideEffects": [
    "./snippets/*"
  ]
}
EOF
