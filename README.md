# attend.seagl.org

A curated web interface to the virtual half of SeaGL 2026; one of the options offered to attendees at [seagl.org/attend](https://seagl.org/attend).

This is structured as a monorepo which outputs a single static site containing:

- a lightly customized fork of [Element Web]
- a conventional [Element Web configuration] file and supporting assets

## Build

### Dependencies

- [Make] with [coreutils], [diffutils], [findutils], [rsync]
- [Node.js] ([latest LTS](https://github.com/element-hq/element-web/blob/v1.12.29/apps/web/README.md?plain=1#L60), i.e. [≥22](https://github.com/element-hq/element-web/blob/v1.12.29/apps/web/package.json#L228))
- [pnpm]

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
make 'element-web-dev'
```

### Updating

To update Element Web, reapply our customizations to the new upstream. For minor updates this might be accomplished by merging the update or rebasing our commits, but if Element Web’s features have changed substantially, further development may be necessary. You must consider the _intent_ of each of our commits; even if it applies cleanly, achieving our desired result may require further modifications in the newer Element Web.

[coreutils]: https://www.gnu.org/software/coreutils/
[diffutils]: https://www.gnu.org/software/diffutils/
[Element Web]: https://github.com/element-hq/element-web
[Element Web configuration]: https://github.com/element-hq/element-web/blob/v1.12.29/docs/config.md
[Element Web development]: https://github.com/element-hq/element-web/blob/v1.12.29/developer_guide.md
[findutils]: https://www.gnu.org/software/findutils/
[http.server]: https://docs.python.org/3/library/http.server.html
[Make]: https://www.gnu.org/software/make/
[Node.js]: https://nodejs.org/
[pnpm]: https://pnpm.io/
[rsync]: https://rsync.samba.org/
