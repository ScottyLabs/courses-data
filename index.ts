import lunr, { Index } from "lunr";

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
  private courses: any[] = [];
  private index: Index = null as unknown as Index;

  /**
   * Load a CMUCourses search engine.
   */
  constructor(fetch_from: [string, string]) {
    this.init(fetch_from);
  }

  private async init(fetch_from: [string, string]): Promise<void> {
    try {
      let [index_endpoint, data_endpoint] = fetch_from;

      const [indexResponse, dataResponse] = await Promise.all([
        fetch(index_endpoint),
        fetch(data_endpoint),
      ]);

      const serializedIndex = await indexResponse.json();
      this.courses = await dataResponse.json();

      this.index = lunr.Index.load(serializedIndex);
    } catch (error) {
      console.error("Error loading courses/search index:", error);
    }
  }

  // mount exisintg

  // check new, downloads/replaces

  // useeffect

  query(s: string): Course[] {
    if (!this.index || !s.trim()) {
      return [];
    }

    let lunr_results: Index.Result[] = this.index.search(s);


    let results: Course[] = lunr_results
      .map((result) =>
        this.courses.find((course) => course.id === result.ref)!
      );

    return results;
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
