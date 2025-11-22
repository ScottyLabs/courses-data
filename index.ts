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

export function get_data(): [string, string] {
  return ["todo", "todo"];
}
