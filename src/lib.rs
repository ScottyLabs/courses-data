//! Search cmucourses with bm25. WASM-compatible!

use bm25::{SearchEngineBuilder, Tokenizer};
use flate2::bufread::ZlibDecoder;
use serde::{Deserialize, Serialize};
use std::io::Read;
use std::{
    fs::{self},
    time::Instant,
};
use wasm_bindgen::prelude::*;

#[cfg(feature = "include-bytes")]
use std::io::BufReader;
#[cfg(feature = "include-bytes")]
use wasm_bindgen_futures::js_sys::Promise;

/// Create n-wide sliding windows over a str.
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
pub struct NGramTokenizer;

impl Tokenizer for NGramTokenizer {
    fn tokenize(&self, input_text: &str) -> Vec<String> {
        const N: usize = 3;

        char_windows(input_text, N)
            .map(|window| window.to_lowercase())
            .collect()
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct SearchEngine {
    bm25_engine: bm25::SearchEngine<u32, u32, NGramTokenizer>,
}

#[wasm_bindgen]
impl SearchEngine {
    pub fn new(data_path: &str) -> Self {
        let db_json_file = fs::read(&data_path).expect(&format!(
            "COULD NOT READ DATABASE JSON FILE {}. error was",
            data_path
        ));
        let db = json::parse(str::from_utf8(&db_json_file).unwrap()).unwrap();

        println!("db json has {} course entries", db.len());
        println!("starting index-building step");
        let time_before_index = Instant::now();

        let bm25_engine =
            SearchEngineBuilder::<u32, u32, NGramTokenizer>::with_tokenizer_and_corpus(
                NGramTokenizer {},
                db.entries().map(|entry| {
                    format!(
                        "{} {} {} | {} {} {} | {}",
                        entry.1["courseID"].to_string(),
                        entry.1["courseID"].to_string(),
                        entry.1["courseID"].to_string(),
                        entry.1["name"].to_string(),
                        entry.1["name"].to_string(),
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

        Self { bm25_engine }
    }

    #[cfg(feature = "include-bytes")]
    #[wasm_bindgen(constructor)]
    /// Create a search engine from bytes that are added to the (wasm) binary at compile time.
    ///
    /// Because that happens at compile time, this causes a compile error if
    /// the serialized search engine doesn't exist. But the code to create that
    /// engine would not compile too! To solve this bootstrapping chicken and
    /// egg problem, we lock this function behind a conditional-compilation feature.
    ///
    /// See how this gets used in the project justfile.
    pub fn from_include_bytes() -> Promise {
        wasm_bindgen_futures::future_to_promise(async move {
            let mut output = Vec::new();
            ZlibDecoder::new(include_bytes!("../target/data").as_slice())
                .read_to_end(&mut output)
                .unwrap();

            Ok(JsValue::from(Self {
                bm25_engine: bincode::serde::decode_from_reader(
                    BufReader::new(output.as_slice()),
                    bincode::config::standard(),
                )
                .unwrap(),
            }))
        })
    }

    /// Search the database and return a `Vec` of results, ordered by relevance to query.
    pub fn search(&self, query: &str) -> Vec<String> {
        self.bm25_engine
            .search(query, 7) // arbitrarily decide 7 max results to prevent obnoxiousness in CLI demo.
            .into_iter()
            .map(|result| result.document.contents)
            .collect()
    }
}
