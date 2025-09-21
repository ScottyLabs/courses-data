//! Showcases us using the library to build a tantivy representation and return the output of search.
//!
//! Try with `cargo run --example cli_full_db -- "path/to/db/json" "15-122" "15" "Statistical Inference" "class"`
//!
//! The database json file is named `courses.json` in https://scottylabs.slack.com/files/U08M22PL413/F09G6PQPXAP/course-search-sandbox.zip.

use std::fs;

fn main() {
    let mut args = std::env::args().skip(1);
    let path_to_db_json = args.next().unwrap();

    let db_json_file = fs::read(&path_to_db_json).expect(&format!(
        "COULD NOT READ FILE {}. error was",
        path_to_db_json
    ));

    let db = json::parse(str::from_utf8(&db_json_file).unwrap()).unwrap();

    println!("db json has {} entries", db.len());
    let mut indexbuilder = courses_data::IndexBuilder::new();
    for entry in db.entries() {
        indexbuilder.add_course(
            entry.0.to_string(),
            &entry.1["courseID"].to_string(),
            &entry.1["name"].to_string(),
            &entry.1["desc"].to_string(),
        );
    }

    let index = indexbuilder.build();
    println!("done building index. moving to query step.");

    // We would then bincode index and ship it to our client as a static asset.
    // Client side wasm would run `index.query` whenever it needs, and tell the
    // db to fetch the resulting id order, after applying filters.

    // Since this is just an example, let's query our index with the command line.
    for query in args {
        println!("\n\nquery \"{}\" returned courses ordering:", &query);
        for id in index.query(&query) {
            println!("    {}", db[id].to_string());
        }
    }
}
