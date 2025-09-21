# CMUCourses Data Layer

An experimental, WIP Rust library for more performant processing, search, and rendering of CMUCourses data. (Since this is just a Rust library for now, integrating it into a CMUCourses application is on the user.)

Here's a general idea of what we're trying to work toward:

- store or migrate CMUCourses data to a [tantivy](https://github.com/quickwit-oss/tantivy) schema

- send that data to users as a static asset

- let tantivy run the search clientside

To get an idea of the interface, feel free to browse the docs (`cargo doc --no-deps --open`). Also, see the example at [.examples/cli.rs](./examples/cli.rs).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for developer standards.
