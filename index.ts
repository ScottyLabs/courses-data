import lunr, { Index } from "lunr";
import { version } from "os";

export class CourseCode {
  department: number = -1;
  number: number = -1;

  toString(): string {
    return `${this.department}${this.number}`;
  }
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
  private data: Course[] = [];
  private index: Index = null as unknown as Index;

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
    this.init(fetch_from);
  }

  private async init(fetch_from: [string, string]): Promise<void> {
    try {
      let [version_endpoint, data_endpoint] = fetch_from;

      const [indexResponse, dataResponse] = await Promise.all([
        fetch(version_endpoint),
        fetch(data_endpoint),
      ]);
      
      const serializedIndex = await indexResponse.json();
      this.data = await dataResponse.json();
      
      this.index = lunr.Index.load(serializedIndex);
    } catch (error) {
      console.error('Error loading courses/search index:', error);
    }
  }

  // mount exisintg

  // check new, downloads/replaces

  // useeffect

  query(s: string): Course[] {
    if (!this.index || !s.trim()) {
      return [];
    }
    
    try {
      const results = this.index.search(s);

      const courses = results.map(result => {
        for (const c in this.data) {
          if (this.data[c].course_code.toString() === result.ref) {
            return this.data[c];
          }
        }
        throw new Error(`Course with ref ${result.ref} not found in data.`);
      }).slice(0, 10);
      
      return courses;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
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
