// manual edits from https://github.com/shunichironomura/iac-typst-template. Was "MIT No Attribution License".

#let project(
  title: [],
  abstract: [],
  authors: (),
  header: [],
  body,
) = {
  // Set the document's basic properties.
  set document(author: authors, title: title)
  set page(
    paper: "us-letter",
    header: align(center, text(8pt, header)),
    footer: align(right)[
      Page
      #context counter(page).display(
        "1 of 1",
        both: true,
      )
    ],
  )
  let font-size = 10pt
  set text(size: font-size)
  show heading: set text(size: font-size)

  let vspacing-intro = 1.3em // vertical spacing in intro section

  // Title
  if title != [] [
    #align(center)[
      = #title
      #v(vspacing-intro, weak: true)
    ]
  ]

  // Authors
  if authors != () {
    align(center)[
      #authors.map(author => [*#author*]).join(", ")
      #v(vspacing-intro, weak: true)
    ]
  }

  // Abstract.
  if abstract != [] {
    align(center)[== Abstract]
    set par(justify: true, first-line-indent: 0.5cm)
    abstract
    v(vspacing-intro, weak: true)
  }

  // Main body.
  set heading(numbering: (..numbers) => if numbers.pos().len() <= 2 {
    numbers.pos().map(str).join(".") + "."
  } else {
    numbers.pos().map(str).join(".")
  })

  show heading.where(level: 1): it => {
    {
      set text(size: font-size)
      set heading(numbering: "1.1.1")
      it
    }
    let a = par(box())
    a
    v(-0.45 * measure(2 * a).width)
  }
  show heading.where(level: 2): it => {
    {
      set text(size: font-size, weight: "regular", style: "italic")
      it
    }
    let a = par(box())
    a
    v(-0.45 * measure(2 * a).width)
  }
  show heading.where(level: 3): it => {
    {
      set text(size: font-size, weight: "regular", style: "italic")
      it
    }
    let a = par(box())
    a
    v(-0.45 * measure(2 * a).width)
  }

  // Media show rules
  set figure.caption(separator: [. ])
  show figure: it => align(center)[
    #v(0.65em)
    #it
    #v(0.65em)
  ]

  show figure.where(kind: image): set figure(supplement: [Fig.])
  show figure.where(kind: table): set figure.caption(position: top)

  set par(
    spacing: 0.65em,
    justify: true,
    first-line-indent: 0.5cm,
  )
  show: columns.with(2, gutter: 1.3em)
  set math.equation(numbering: "(1)")

  body
}
