//! Search cmucourses with a cli, with the bm25 crate.
//!
//! Try with `cargo run --release path/to/db/json`, then interactively submit queries.
//!
//! Try running it again to load it from cache!
//!
//! The database json file is named `courses.json` in https://scottylabs.slack.com/files/U08M22PL413/F09G6PQPXAP/course-search-sandbox.zip.

use courses_data::SearchEngine;
use std::{
    fs::File,
    io::{BufReader, Write},
    path::Path,
    time::Instant,
};

fn main() {
    let mut interactive = true;
    if std::env::args().skip(1).any(|arg| arg == "--only-build") {
        interactive = false;
    }

    let search_engine: SearchEngine;
    if !Path::new("target/data").exists()
        || std::env::args().skip(1).any(|arg| arg == "--force-rebuild")
    {
        let path_to_db_json = std::env::args().skip(1).next().unwrap();
        search_engine = courses_data::SearchEngine::new(&path_to_db_json);

        let serialized_search_engine =
            bincode::serde::encode_to_vec(&search_engine, bincode::config::standard()).unwrap();

        File::create("target/data")
            .unwrap()
            .write_all(&serialized_search_engine)
            .unwrap();
    } else {
        let time_before_index = Instant::now();

        search_engine = bincode::serde::decode_from_reader(
            BufReader::new(File::open("target/data").unwrap()),
            bincode::config::standard(),
        )
        .unwrap();

        println!(
            "deserialized cached index from file system in {} seconds:",
            time_before_index.elapsed().as_secs_f64()
        );
    }

    if !interactive {
        return;
    }

    let mut buffer = String::new();
    loop {
        // print user prompt

        print!("query > ");
        std::io::stdout().flush().unwrap();

        // get user input
        buffer.clear();
        std::io::stdin().read_line(&mut buffer).unwrap();

        /// ANSI control code to clear the terminal screen
        const CLEAR: &str = "\x1b[2J";
        print!("{CLEAR}");

        // search and record duration it took
        let time_before_searching = Instant::now();

        let results = search_engine.search(&buffer);

        println!(
            "\n\n---QUERY \"{}\" RETURNED COURSES ORDERING IN {} SECONDS:",
            &buffer[..buffer.len() - 1],
            time_before_searching.elapsed().as_secs_f64()
        );

        for result in results {
            println!("{}\n\n", result);
        }
    }
}
