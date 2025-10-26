#import "./stellar-iac.typ": project

#show: project.with(
  title: [courses-data: An Experiment in Client-Side Search Through a Medium-Sized Corpus],
  authors: ("courses-data team",),
  abstract: [This is left to-do. #lorem(120)],
)

#import "@preview/zero:0.5.0": zi, ztable
#import "@preview/booktabs:0.0.4": *
#show: booktabs-default-table-style

#show figure.where(kind: table): set figure.caption(position: top)

#let MB = zi.declare("MB")
#let s = zi.declare("s")

== Introduction

Scottylabs is a student-run software development organization at Carnegie Mellon. One of our projects is CMUCourses, an online course catalog that tries to provide a good course search experience as one of its keystone features. This project, `courses-data`, was started the fall 2025 semester to look into improving search. In particular, as defined in the project description slidedeck: // https://docs.google.com/presentation/d/1T6jBIC6lUMhOKR6CuuOfstqgiSb0pKyK0sp4sdvn7ks/edit?slide=id.g348e8675946_0_14#slide=id.g348e8675946_0_14

- Figure out the most performant way to process and render data
- Optimize search and sorting

The scope of this article and the current work is to make search faster while adding some goodies like full-text and fuzzy search.

// TODO: should define what this is. not just search speed but going to different "pages" of the search ig

== Motivating an alternative implementation

We first describe some features that we'd like to add to the search. Then, we describe at a high level how the search is implemented before our experiments. This will imply an alternative implementation that we will investigate in this article.

=== Additional Features

As a quality-of-life feature, our team wanted to add full-text search. Previously, the search only queried the course names and numbers, and adding the ability to search the course description could be helpful.

Also, we want fuzzy search because the current implementation isn't typo-tolerant.

=== Review of incumbent implementation

The incumbent implementation architecture is common among web applications, involving repeatedly sending requests to the server and getting responses. Naming these processes pings and pongs, we have:

+ (ping!) a user visits cmucourses.com
+ (pong!) the server sends that user some data that defines how the frontend should look
+ (ping!) that user triggers a search using the frontend
+ (pong!) the server runs the search query and sends back the result
+ the user's frontend renders that result
+ repeated from step 3, as desired

It should also be noted that the frontend (queried in steps 1 and 2) is cached onto the user's device by standard browser technology, so a ping-pong when visiting the site actually happens relatively infrequently. However, triggering a search (subsequent steps) must always trigger a ping-pong. This is a common quality of web applications: on top of the time it takes for the server to actually compute the result of a query, user actions also have to wait for the query to travel across the internet to the server before that computation can run in the first place, before finally getting a response that also needs to travel all the way back. Contrast this with a fully client-side application like a music player or a text editor. While they might still need to wait for IO, reads and writes from the physical disk connected to the computer are much faster than responses from and queries to a disk located somewhere else.

=== Key idea

This naturally leads to the thought: well, why don't we send the data to the client and have them do that search locally? This will make the initial step take longer, because we will have to send whatever data is needed to run searches. However, we entirely remove the need to make network requests when we search!

Is this feasible for our dataset? Many web applications are not able to implement this idea, because the data is simply too bulky to be stored by an end user. It would be a terrible idea for Google to send over the entirety of the internet to any user who wants to submit a query#footnote[As an aside, there are at least two other valid reasons for forgoing this method. The remote server might be so fast compared to the user's computer that the net speed is faster if the server hosts it. Or, it's just more convenient to have a cloud-synced service where you don't have to think about how your data is stored.]. 

Well, we've been working with a sample dataset that would contain roughly the same distribution of characters as whatever the modern true set of courses is. We want to run full-text-search on course name, number, and description, so how does our data look in this context?

// #figure(
//   caption: [screenshot of #link("cmucourses.com") on #datetime(year: 2025, month: 10, day: 13).display()],
//   placement: bottom,
//   scope: "parent",
//   image("media/courses_screenshot.png")
// )


#figure(
  caption: [benchmarking search engine compression strategies],
  placement: bottom,
  scope: "parent",
)[
  #ztable(
    columns: 7,
    align: center,
    column-gutter: 0.5em,
    format: (none, auto, auto, auto, auto, auto, auto),

    toprule(),

    [],
    [],
    table.cell(colspan: 5)[duration of action],
    cmidrule(start: 2, end: -1),
    [compression],
    [file size\ (#MB())],
    [receive\ (#s())],
    [decompress\ (#s())],
    [deserialize\ (#s())],
    [total\ (#s())\ (cache hit)],
    [total\ (#s())\ (cache miss)],

    midrule(),

    ..csv("media/merged_compression_benchmarks.csv").flatten().slice(7),

    bottomrule(),
  )]
