//! Showcases us using the library to build a tantivy representation and return the output of search.
//!
//! Try with `cargo run --example initial -- "15-122" "15" "Statistical Inference" "class"`

/// Some dummy data emulating the sections of the database we're allowed to make public and search for.
const DATA: &str = "15-122\tPrinciples of Imperative Computation\tFor students with a basic understanding of programming (variables, expressions, loops, arrays, functions). Teaches imperative programming and methods for ensuring the correctness of programs. Students will learn the process and concepts needed to go from high-level descriptions of algorithms to correct imperative implementations, with specific application to basic data structures and algorithms. Much of the course will be conducted in a subset of C amenable to verification, with a transition to full C near the end. This course prepares students for 15-213 and 15-210. NOTE: students must achieve a C or better in order to use this course to satisfy the pre-requisite for any subsequent Computer Science course.
15-150\tPrinciples of Functional Programming\tAn introduction to programming based on a \"functional\" model of computation. The functional model is a natural generalization of algebra in which programs are formulas that describe the output of a computation in terms of its inputs---that is, as a function. But instead of being confined to real- or complex-valued functions, the functional model extends the algebraic view to a very rich class of data types, including not only aggregates built up from other types, but also functions themselves as values. This course is an introduction to programming that is focused on the central concepts of function and type. One major theme is the interplay between inductive types, which are built up incrementally; recursive functions, which compute over inductive types by decomposition; and proof by structural induction, which is used to prove the correctness and time complexity of a recursive function. Another major theme is the role of types in structuring large programs into separate modules, and the integration of imperative programming through the introduction of data types whose values may be altered during computation. NOTE: students must achieve a C or better in order to use this course to satisfy the pre-requisite for any subsequent Computer Science course. David Khan will be teaching this course, Summer 22. Please direct any questions about this waitlist to Amy Weis at alweis@andrew.cmu.edu.
15-412\tOperating System Practicum\tThe goal of this class is for students to acquire hands-on experience with operating-system code as it is developed and deployed in the real world. Groups of two to four students will select, build, install, and become familiar with an open-source operating system project; propose a significant extension or upgrade to that project; and develop a production-quality implementation meeting the coding standards of that project. Unless infeasible, the results will be submitted to the project for inclusion in the code base. Variations on this theme are possible at the discretion of the instructor. For example, it may be possible to work within the context of a non-operating-system software infrastructure project (window system, web server, or embedded network device kernel) or to extend a 15-410 student kernel. In some situations students may work alone. Group membership and unit count (9 units versus 12) will be decided by the third week of the semester. Contributing to a real-world project will involve engaging in some mixture of messy, potentially open-ended activities such as: learning a revision control system, writing a short design document, creating and updating a simple project plan, participating in an informal code review, synthesizing scattered information about hardware and software, classifying and/or reading large amounts of code written by various people over a long period of time, etc.
36-235\tProbability and Statistical Inference I\tThis class is the first half of a two-semester, calculus-based course sequence that introduces theoretical aspects of probability and statistical inference to students. The material in this course and in 36-236 (Probability and Statistical Inference II) is organized so as to provide repeated exposure to essential concepts: the courses cover specific probability distributions and their inferential applications one after another, starting with the normal distribution and continuing with the binomial and Poisson distributions, etc. Topics specifically covered in 36-235 include basic probability, random variables, univariate and multivariate distribution functions, point and interval estimation, hypothesis testing, and regression, with the discussion being supplemented with computer-based examples and exercises (e.g., visualization and simulation). Given its organization, the course is only appropriate for those taking the full two-semester sequence, and thus it is currently open only to statistics majors (primary, additional, dual) and minors. (Check with the statistics advisors for the exact declaration deadline.) Non-majors/minors requiring a probability course are directed to take 36-225 or one of its analogues. A grade of C or better in 36-235 is required in order to advance to 36-236 (or 36-226) and/or 36-410. This course is not open to students who have received credit for 36-217, 36-218, 36-219, or 36-700, or for 21-325 or 15-259.
36-236\tProbability and Statistical Inference II\tThis class is the second half of a two-semester, calculus-based course sequence that introduces theoretical aspects of probability and statistical inference to students. The material in this course and in 36-235 (Probability and Statistical Inference I) is organized so as to provide repeated exposure to essential concepts: the courses cover specific probability distributions and their inferential applications one after another, starting with the normal distribution and continuing with the binomial and Poisson distributions, etc. Topics specifically covered in 36-236 include the binomial and related distributions, the Poisson and related distributions, and the uniform distribution, and how they are used in point and interval estimation, hypothesis testing, and regression. Also covered in 36-236 are topics related to multivariate distributions: marginal and conditional distributions, covariance, and conditional distribution moments. All discussion is supplemented with computer-based examples and exercises (e.g., visualization and simulation). Given its organization, the course is only appropriate for those who first take 36-235, and thus it is currently open only to statistics majors (primary, additional, dual) and minors, as well as to CS majors using both 36-235 and 36-236 to complete their probability requirement. All others are directed to take 36-226. A grade of C or better in 36-236 is required in order to advance to 36-401.
";

fn main() {
    let mut indexbuilder = courses_data::IndexBuilder::new();
    for (id, line) in DATA
        .strip_suffix("\n")
        .expect("trailing newline should exist, hardcoded above")
        .split("\n")
        .enumerate()
    {
        let mut number = "";
        let mut name = "";
        let mut descr = "";

        for (i, col) in line.split("\t").enumerate() {
            match (i, col) {
                (0, col) => number = col,
                (1, col) => name = col,
                (2, col) => descr = col,
                _ => unreachable!(),
            }
        }

        indexbuilder.add_course(id, number, name, descr);
    }

    let index = indexbuilder.build();

    // We would then bincode index and ship it to our client as a static asset.
    // Client side wasm would run `index.query` whenever it needs, and tell the
    // db to fetch the resulting id order, after applying filters.

    // Since this is just an example, let's query our index with the command line.
    // Remember to skip the first command line arg, which is just the binary name.
    for query in std::env::args().skip(1) {
        println!(
            "query \"{}\" returned index ordering {:?}",
            &query,
            index.query(&query)
        );
    }
}
