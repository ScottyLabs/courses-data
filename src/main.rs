//! Search cmucourses with bm25 crate.
//!
//! Try with `cargo run --release path/to/db/json`, then interactively submit queries.
//!
//! Try running it again to load it from cache!
//!
//! The database json file is named `courses.json` in https://scottylabs.slack.com/files/U08M22PL413/F09G6PQPXAP/course-search-sandbox.zip.

use bm25::{SearchEngine, SearchEngineBuilder, Tokenizer};
use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::{BufReader, Write},
    path::Path,
    time::Instant,
};

/// n-wide sliding windows over a str.
///
/// From https://stackoverflow.com/questions/51257304/.
fn char_windows<'a>(src: &'a str, win_size: usize) -> impl Iterator<Item = &'a str> {
    src.char_indices().flat_map(move |(from, _)| {
        src[from..]
            .char_indices()
            .skip(win_size - 1)
            .next()
            .map(|(to, c)| &src[from..from + to + c.len_utf8()])
    })
}

/// Tokenize with n-grams.
///
/// Change how wide the n-gram is with `N` in the source code.
///
/// This could be a const generic but I don't want to use too much magic.
#[derive(Default, Serialize, Deserialize)]
struct NGramTokenizer;

impl Tokenizer for NGramTokenizer {
    fn tokenize(&self, input_text: &str) -> Vec<String> {
        const N: usize = 3;

        char_windows(input_text, N)
            .map(|window| window.to_lowercase())
            .collect()
    }
}

fn main() {
    let mut args = std::env::args().skip(1);
    let path_to_db_json = args.next().unwrap();

    let db_json_file = fs::read(&path_to_db_json).expect(&format!(
        "COULD NOT READ DATABASE JSON FILE {}. error was",
        path_to_db_json
    ));

    let db = json::parse(str::from_utf8(&db_json_file).unwrap()).unwrap();

    println!("db json has {} course entries", db.len());
    println!("starting index-building step");

    let time_before_index = Instant::now();

    let search_engine: SearchEngine<u32, u32, NGramTokenizer>;
    if Path::new("target/data").exists() {
        search_engine = bincode::serde::decode_from_reader(
            BufReader::new(File::open("target/data").unwrap()),
            bincode::config::standard(),
        )
        .unwrap();

        println!(
            "deserialized cached index from file system in {} seconds:",
            time_before_index.elapsed().as_secs_f64()
        );
    } else {
        search_engine = SearchEngineBuilder::<u32, u32, NGramTokenizer>::with_tokenizer_and_corpus(
            NGramTokenizer {},
            db.entries().map(|entry| {
                format!(
                    "{} | {} | {}",
                    entry.1["courseID"].to_string(),
                    entry.1["name"].to_string(),
                    entry.1["desc"].to_string()
                )
            }),
        )
        .build();

        println!(
            "constructed index from scratch in {} seconds:",
            time_before_index.elapsed().as_secs_f64()
        );

        let serialized_search_engine =
            bincode::serde::encode_to_vec(&search_engine, bincode::config::standard()).unwrap();

        File::create("target/data")
            .unwrap()
            .write_all(&serialized_search_engine)
            .unwrap();
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

        let results = search_engine.search(&buffer, 7);

        println!(
            "\n\n---QUERY \"{}\" RETURNED COURSES ORDERING IN {} SECONDS:",
            &buffer[..buffer.len() - 1],
            time_before_searching.elapsed().as_secs_f64()
        );

        for result in results {
            println!("{}\n\n", result.document.contents);
        }
    }
}
