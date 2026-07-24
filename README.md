# attend.seagl.org

A curated web interface to the virtual half of SeaGL 2025; one of the options offered to attendees at [seagl.org/attend](https://seagl.org/attend).

This is structured as a monorepo which outputs a single static site containing:

- a lightly customized fork of [Element Web]
- a conventional [Element Web configuration] file and supporting assets
- miscellaneous pages embeddable as [widgets]

## Build

### Dependencies

- [Node.js] ([≥20](https://github.com/element-hq/element-web/blob/v1.12.2/package.json#L314), e.g. [Active LTS](https://nodejs.org/en/about/previous-releases))
- [Yarn] ([1](https://github.com/element-hq/element-web/issues/28146))
- [Make]
- [find]
- [rsync]

### Procedures

Build all components into a single static site:

```bash
make 'dist'
```

## Development

### Dependencies

- build dependencies
- a local web server, e.g. Python’s [`http.server`][http.server]

### Procedures

Locally serve the built static site:

```bash
python -m 'http.server' --directory 'dist'
```

Run an [Element Web development] server:

```bash
make 'element-web/node_modules'
env --chdir 'element-web' yarn start
```

Run a [widgets development] server

```bash
git submodule update 'seagl.org'
make 'widgets/node_modules'
env --chdir 'widgets' yarn start
```

### Updating

To update Element Web, reapply our customizations to the new upstream. For minor updates this might be accomplished by merging the update or rebasing our commits, but if Element Web’s features have changed substantially, further development may be necessary. You must consider the _intent_ of each of our commits; even if it applies cleanly, achieving our desired result may require further modifications in the newer Element Web.

## Decommissioning

Build a static placeholder:

```bash
make 'down'
```

The [`down.yml` workflow](https://github.com/SeaGL/attend.seagl.org/blob/main/.github/workflows/down.yml) can be run manually in order to automatically deploy the "down" page.

[Element Web]: https://github.com/element-hq/element-web
[Element Web configuration]: https://github.com/element-hq/element-web/blob/v1.12.2/docs/config.md
[Element Web development]: https://github.com/element-hq/element-web/blob/v1.12.2/developer_guide.md
[find]: https://www.gnu.org/software/findutils/
[http.server]: https://docs.python.org/3/library/http.server.html
[Make]: https://www.gnu.org/software/make/
[Node.js]: https://nodejs.org/
[rsync]: https://rsync.samba.org/
[widgets]: https://matrix.org/blog/2017/08/23/introducing-matrix-widgets/
[widgets development]: https://parceljs.org/features/development/
[Yarn]: https://classic.yarnpkg.com/
