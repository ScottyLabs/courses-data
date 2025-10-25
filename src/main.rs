//! Search cmucourses with a cli, with the bm25 crate.
//!
//! Try with `cargo run --release path/to/db/json`, then interactively submit queries.
//!
//! Try running it again to load it from cache!
//!
//! The database json file is named `courses.json` in https://scottylabs.slack.com/files/U08M22PL413/F09G6PQPXAP/course-search-sandbox.zip.

use courses_data::SearchEngine;
use log::{debug, trace};
use std::{
    fs::File,
    io::{BufReader, Write},
    path::Path,
    time::Instant,
};

#[cfg(feature = "zlib")]
use flate2::{Compression, bufread::ZlibEncoder};
#[cfg(feature = "zlib")]
use std::io::Read;

fn main() {
    courses_data::init_logger();

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

        trace!("compressing");
        let time_before_compress = Instant::now();

        // zlib specific transformations
        #[cfg(feature = "zlib")]
        let serialized_search_engine = {
            let mut compressed_search_engine = vec![];

            ZlibEncoder::new(
                BufReader::new(serialized_search_engine.as_slice()),
                Compression::best(),
            )
            .read_to_end(&mut compressed_search_engine)
            .unwrap();

            compressed_search_engine
        };

        // brotli specific transformations
        #[cfg(feature = "brotli")]
        let serialized_search_engine = {
            let mut compressed_search_engine = vec![];

            brotli::BrotliCompress(
                &mut serialized_search_engine.as_slice(),
                &mut compressed_search_engine,
                &brotli::enc::BrotliEncoderParams::default(),
            )
            .unwrap();

            compressed_search_engine
        };

        debug!(
            "finished compressing in {} seconds:",
            time_before_compress.elapsed().as_secs_f64()
        );

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

        debug!(
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
