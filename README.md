# attend.seagl.org

A curated web interface to the virtual half of SeaGL 2026; one of the options offered to attendees at [seagl.org/attend](https://seagl.org/attend).

This is structured as a monorepo which outputs a single static site containing:

- a lightly customized fork of [Element Web]
- a conventional [Element Web configuration] file and supporting assets

To support seasonal deployment, the entire interface can be replaced with a simple placeholder message.

## Build

### Dependencies

- [Make] with [coreutils], [diffutils], [findutils], [rsync]
- [Node.js] ([latest LTS](https://github.com/element-hq/element-web/blob/v1.12.29/apps/web/README.md?plain=1#L60), i.e. [≥22](https://github.com/element-hq/element-web/blob/v1.12.29/apps/web/package.json#L228))
- [pnpm]

### Procedures

Build all components of the conference interface into a single static site:

```bash
make 'dist'
```

Build a placeholder message for off-season:

```bash
MODE='down' make 'dist'
```

## Development

### Dependencies

- build dependencies

### Procedures

Run an [Element Web development] server:

```bash
make 'element-web-dev'
```

### Updating

To update Element Web, reapply our customizations to the new upstream. For minor updates this might be accomplished by merging the update or rebasing our commits, but if Element Web’s features have changed substantially, further development may be necessary. You must consider the _intent_ of each of our commits; even if it applies cleanly, achieving our desired result may require further modifications in the newer Element Web.

## Deployment

The site is automatically deployed via [GitHub Actions]. To switch the
production site between the conference interface and off-season placeholder
message, edit `MODE` in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

[coreutils]: https://www.gnu.org/software/coreutils/
[diffutils]: https://www.gnu.org/software/diffutils/
[Element Web]: https://github.com/element-hq/element-web
[Element Web configuration]: https://github.com/element-hq/element-web/blob/v1.12.29/docs/config.md
[Element Web development]: https://github.com/element-hq/element-web/blob/v1.12.29/developer_guide.md
[findutils]: https://www.gnu.org/software/findutils/
[GitHub Actions]: https://github.com/features/actions
[Make]: https://www.gnu.org/software/make/
[Node.js]: https://nodejs.org/
[pnpm]: https://pnpm.io/
[rsync]: https://rsync.samba.org/
