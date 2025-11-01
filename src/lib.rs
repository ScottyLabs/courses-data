//! Search cmucourses with bm25. WASM-compatible!

use bm25::{SearchEngineBuilder, Tokenizer};
use log::{debug, trace};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io::BufReader;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::js_sys::Promise;

#[cfg(not(target_arch = "wasm32"))]
use std::time::Instant;
#[cfg(target_arch = "wasm32")]
use web_time::Instant;

#[cfg(feature = "zlib")]
use flate2::bufread::ZlibDecoder;
#[cfg(feature = "zlib")]
use flate2::{Compression, bufread::ZlibEncoder};
#[cfg(feature = "zlib")]
use std::io::Read;

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

/// Initialize the logging backend.
///
/// The backends for native and wasm code are different.
pub fn init_logger() {
    #[cfg(not(target_arch = "wasm32"))]
    simple_logger::init_with_env().unwrap();

    #[cfg(target_arch = "wasm32")]
    console_log::init_with_level(log::Level::Trace).unwrap();
}

#[wasm_bindgen]
impl SearchEngine {
    /// Create a search engine from a json file.
    ///
    /// The schema for this json file is "the one that Theo sent. There is no schema.
    /// You must use specifically the file Theo sent."
    ///
    /// This is a temporary function while we wait on getting the schema
    /// for the production database.
    pub fn from_json_path(data_path: &str) -> Self {
        let db_json_file = fs::read(data_path).expect(&format!(
            "COULD NOT READ DATABASE JSON FILE {}. error was",
            data_path
        ));
        let db = json::parse(str::from_utf8(&db_json_file).unwrap()).unwrap();

        trace!("db json has {} course entries", db.len());
        trace!("starting index-building step");
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

        debug!(
            "constructed index from scratch in {} seconds:",
            time_before_index.elapsed().as_secs_f64()
        );

        Self { bm25_engine }
    }

    pub fn to_bytes(&self) -> Vec<u8> {
        let serialized_search_engine =
            bincode::serde::encode_to_vec(self, bincode::config::standard()).unwrap();

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

        serialized_search_engine
    }

    pub fn from_bytes(serialized_engine: Vec<u8>) -> Self {
        let before_decompress = Instant::now();

        // brotli specific transformation
        #[cfg(feature = "brotli")]
        let serialized_engine = {
            let mut brotli_output = Vec::new();
            brotli::BrotliDecompress(&mut serialized_engine.as_slice(), &mut brotli_output)
                .unwrap();
            brotli_output
        };

        // zlib specific transformation
        #[cfg(feature = "zlib")]
        let serialized_engine = {
            let mut zlib_output = Vec::new();
            ZlibDecoder::new(serialized_engine.as_slice())
                .read_to_end(&mut zlib_output)
                .unwrap();
            zlib_output
        };

        debug!(
            "search binary decompression took {}s",
            before_decompress.elapsed().as_secs_f64()
        );

        let before_deser = Instant::now();

        let bm25_engine = bincode::serde::decode_from_reader(
            BufReader::new(serialized_engine.as_slice()),
            bincode::config::standard(),
        )
        .unwrap();

        debug!(
            "search binary deserialization took {}s",
            before_deser.elapsed().as_secs_f64()
        );

        // process data and send engine to js

        Self { bm25_engine }
    }

    #[wasm_bindgen(js_name = from_Uint8Array)]
    /// Create a search engine from bytes.
    ///
    /// One might get these bytes from the result of a Fetch API call.
    pub fn from_js_bytes(serialized_engine: Vec<u8>) -> Promise {
        init_logger();

        wasm_bindgen_futures::future_to_promise(async move {
            Ok(JsValue::from(Self::from_bytes(serialized_engine)))
        })
    }

    /// Search the database and return a `Vec` of results, ordered by relevance to query.
    pub fn search(&self, query: &str) -> Vec<String> {
        let now = Instant::now();

        let result = self
            .bm25_engine
            .search(query, 7) // arbitrarily decide 7 max results to prevent obnoxiousness in CLI demo.
            .into_iter()
            .map(|result| result.document.contents)
            .collect();

        debug!("search took {}s", now.elapsed().as_secs_f64());

        result
    }
}
