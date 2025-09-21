//! An experimental, WIP Rust library for more performant processing, search,
//! and rendering of CMUCourses data.

use tantivy::collector::TopDocs;
use tantivy::query::QueryParser;
use tantivy::schema::*;
use tantivy::{IndexWriter, ReloadPolicy};

pub type IdType = usize;

/// Build an index iteratively.
pub struct IndexBuilder {
    index: tantivy::Index,
    writer: tantivy::IndexWriter,
    id_field: Field,
    number_field: Field,
    name_field: Field,
    descr_field: Field,
}

impl IndexBuilder {
    pub fn new() -> Self {
        let mut schema_builder = Schema::builder();
        let id_field = schema_builder.add_u64_field("id", STORED);
        let number_field = schema_builder.add_text_field("number", TEXT);
        let name_field = schema_builder.add_text_field("name", TEXT);
        let descr_field = schema_builder.add_text_field("descr", TEXT);

        let schema = schema_builder.build();

        let index = tantivy::Index::create_in_ram(schema.clone());

        let writer: IndexWriter = index
            .writer(15_000_000) // 15MB RAM
            .unwrap();

        Self {
            index,
            writer,
            id_field,
            number_field,
            name_field,
            descr_field,
        }
    }

    pub fn add_course(&mut self, id: IdType, number: &str, name: &str, descr: &str) {
        let mut doc = TantivyDocument::default();
        doc.add_u64(self.id_field, id as u64);
        doc.add_text(self.number_field, number);
        doc.add_text(self.name_field, name);
        doc.add_text(self.descr_field, descr);
        self.writer.add_document(doc).unwrap();
    }

    pub fn build(mut self) -> Index {
        self.writer.commit().unwrap();

        // For a search server you will typically create one reader for the entire lifetime of your
        // program, and acquire a new searcher for every single request.
        let index_reader = self
            .index
            .reader_builder()
            .reload_policy(ReloadPolicy::Manual)
            .try_into()
            .unwrap();

        Index {
            index: self.index,
            index_reader,
            id_field: self.id_field,
            number_field: self.number_field,
            name_field: self.name_field,
            descr_field: self.descr_field,
        }
    }
}

pub struct Index {
    index: tantivy::Index,
    index_reader: tantivy::IndexReader,
    id_field: Field,
    number_field: Field,
    name_field: Field,
    descr_field: Field,
}

impl Index {
    pub fn query(&self, query: &str) -> Vec<IdType> {
        // Acquiring a `searcher` is very cheap.
        //
        // You should acquire a searcher every time you start processing a request and
        // and release it right after your query is finished.
        let searcher = self.index_reader.searcher();

        // The query parser can interpret human queries.
        // Here, if the user does not specify which
        // field they want to search, we specify all by default.
        let query_parser = QueryParser::for_index(
            &self.index,
            vec![self.number_field, self.name_field, self.descr_field],
        );

        // `QueryParser` may fail if the query is not in the right
        // format. For user facing applications, this can be a problem.
        // A ticket has been opened regarding this problem.
        let query = query_parser.parse_query(query).unwrap();

        // We can now perform our query.
        let top_docs = searcher.search(&query, &TopDocs::with_limit(5)).unwrap();

        // The actual documents still need to be
        // retrieved from Tantivy's store.
        //
        // Since the body field was not configured as stored,
        // the document returned will only contain
        // a title.
        top_docs
            .into_iter()
            .map(|(_score, doc_address)| {
                let retrieved_doc: TantivyDocument = searcher.doc(doc_address).unwrap();
                match OwnedValue::from(retrieved_doc.get_first(self.id_field).unwrap()) {
                    OwnedValue::U64(id) => id as IdType,
                    _ => unreachable!("We hardcoded id as a u64 above."),
                }
            })
            .collect()
    }
}
