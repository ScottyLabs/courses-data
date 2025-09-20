# print the possible recipes you can run
default:
    @just --list --unsorted

# compile documentation for the library
doc:
    cargo doc --no-deps

# compile and open documentation for the library
doc-open:
    cargo doc --no-deps --open