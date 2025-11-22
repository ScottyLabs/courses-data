import lunr, { Index } from "lunr";

export class CourseCode {
  department: number = -1;
  number: number = -1;
}

export class Course {
  course_code: CourseCode = new CourseCode();
  name: string = "";
  units: number = -1;
  description: string = "";
  prereqs: CourseCode[] = [];
  coreqs: CourseCode[] = [];
  crosslisted: CourseCode[] = [];
}

export class SearchEngine {
  private index: Index;

  /**
   * Load a CMUCourses search engine.
   *
   * Defaults to loading from disk.
   * Will fetch from a version REST API endpoint to see if we need to update
   * our search engine on disk. If so, or if we have no data on disk, downloads
   * data from a data REST API endpoint.
   *
   * @param fetch_from a `[version_endpoint, data_endpoint]`
   */
  constructor(fetch_from: [string, string]) {
    let [version_endpoint, data_endpoint] = fetch_from;
    this.index = lunr.Index.load({});
  }

  // mount exisintg

  // check new, downloads/replaces

  // useeffect

  query(s: string): Course[] {
    return [];
  }
}

const worker = new Worker("./search.ts");

worker.postMessage("hello");
worker.onmessage = (event) => {
  console.log(event.data);
};

/**
 * WHEN WORKING ON CODEBASE, DO NOT FUCK WITH THE INDEXEDDB 
 * NAME/CONFIG RANDOMLY. IF YOU DO, MIGHT REQUIRE ALL USERS TO 
 * REDOWNLOAD THE SEARCH INDEX
 */

/**
 * Gets the local version of the search index
 * @param indexeddb stores the data
 * @returns version
 */
function get_db_version(indexeddb: string): string {
  return "0.0.1";
}

/**
 * Gets the servers version of the search index
 * @returns version
 */
function get_latest_version(): string {
  return "0.0.1"; // TODO: versioning standard
}

/**
 * Actually downloads the data from the sources
 * @returns [coursesData, searchIndex]
 */
function fetch_data_from_server(): [string, string] {
  return ["todo", "todo"];
}

/**
 * 
 * @param indexedb database to fetch data from
 * @returns [coursesData, searchIndex]
 */
function fetch_data_from_db(indexedb: string): [string, string] {
  return ["todo", "todo"];
}

/**
 * 
 * @param indexedb used to store data
 * @param data [coursesData, searchIndex]
 * @param version version found on server
 */
function store_data(indexedb: string, data: [string, string], version: string): void {

}

/**
 * Does all the logic to fetch the local search engine
 * files
 * @returns [coursesData, searchIndex] found in 
 *          search.js
 */
export function get_data(): [string, string] {
  // logic to initialize the DB
  let indexedb: string = "foo";

  let local_version: string = get_db_version(indexedb);
  let server_version: string = get_latest_version();

  if (local_version == server_version) {
    return fetch_data_from_db(indexedb);
  }

  let data: [string, string] = fetch_data_from_server();
  store_data(indexedb, data, server_version);
  return data;
}
