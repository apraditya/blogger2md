# blogger2md

Convert Blogger backup blog posts or Blogger atom feed to Hugo-compatible
markdown files.

## About the Project

I needed a simple tool to import posts from a Blogger site to markdown files.
Among the tools listed in [Hugo doc](https://gohugo.io/tools/migrations/#blogger),
The only feasible option for me is [blog2md](https://github.com/palaniraja/blog2md).
However, it didn't work well for my Blogger backup file. After debugging for a
while, I'm thinking of writing a simpler tool myself. It's a good excuse for me to
explore [Vitest](https://vitest.dev/).

## Getting Started

### Prerequisites

- [NodeJS](https://nodejs.org/en/) or [Yarn](https://yarnpkg.com/)

### Installation

Install as a system command with npm:

```sh
npm install -g blogger2md
```

or with yarn

```sh
yarn global add blogger2md
```

### Usage

```sh
blogger2md <xml-file> <output-dir>
```

where:

- `xml-file` can be a Blogger backup file or its Atom feed.
- `output-dir` is optional, if it's not provided, `md-output` will be created
  to store the markdown files.

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
