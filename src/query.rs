/// The three possible season-based semesters a course can be in.
pub enum Semester {
    Fall,
    Spring,
    Summer,
}

/// The level of a course, split into four types.
pub enum CourseLevel {
    UnderGrad0xx2xx,
    UnderGrad3xx4xx,
    Grad5xx6xx,
    Grad7xx9xx,
}

/// A query the user submits for courses.
///
/// We assume the data is correct even though this doesn't perfectly type the data.
/// Making this more pedantically correct can be discussed.
///
/// In its current form, Wade just yoinked it from the cmucourses.com website.
/// Hopefully it isn't off.
pub struct Query {
    /// The main string search query.
    pub search: String,
    /// Any departments to filter by (i.e. `15` is SCS).
    pub departments: Vec<u8>,
    /// `(min, max)` unit range to filter by.
    ///
    /// Must be within `[0, 24]` inclusive.
    pub units: Option<(u8, u8)>,
    /// Which semesters and years to filter by.
    ///
    /// e.g. `(Semester::Fall, 2024)`.
    pub offered_semesters: Vec<(Semester, u16)>,
    /// Which course levels to filter by.
    pub levels: Vec<CourseLevel>,
    /// Number of semesters to look backward.
    pub num_semesters: u32,
    /// Whether to include spring courses.
    pub show_spring: bool,
    /// Whether to include summer courses.
    pub show_summer: bool,
    /// Whether to include fall courses.
    pub show_fall: bool,
}
