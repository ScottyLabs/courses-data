use courses_data::query::Query;

fn main() {
    println!("This is a rust example binary.");
    println!("");
    println!("It gets compiled as if it's a user of its library.");
    println!("For example, let's make a dummy query for funsies.");

    // making a query

    println!("\n(see the code: ./examples/someexample.rs)\n");
    let _ = Query {
        search: String::from("15122"),
        departments: vec![],
        units: None,
        offered_semesters: vec![],
        levels: vec![],
        num_semesters: 100,
        show_spring: false,
        show_summer: false,
        show_fall: false,
    };

    println!("Short, localizable examples are often in docstrings.");
    println!("Examples in this folder are usually more like minimal but working apps.");
    println!("e.g. we would show off how frontend CMUCourses would use our library,");
    println!("maybe via some CLI.");
}
