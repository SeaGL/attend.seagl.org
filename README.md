# attend.seagl.org

Web interface to the virtual half of SeaGL 2025

## Development

Install dependencies:

- [Node.js] ([≥20](https://github.com/element-hq/element-web/blob/v1.12.2/package.json#L314), e.g. [Active LTS](https://nodejs.org/en/about/previous-releases))
- [Yarn] ([1](https://github.com/element-hq/element-web/issues/28146))
- [Make]
- [find]
- [rsync]
- a local web server, e.g. Python’s [`http.server`][http.server]

Build the static site:

```bash
make 'dist'
```

Serve it at e.g. [`localhost:8000`](http://localhost:8000/):

```bash
python -m 'http.server' --directory 'dist'
```

[find]: https://www.gnu.org/software/findutils/
[http.server]: https://docs.python.org/3/library/http.server.html
[Make]: https://www.gnu.org/software/make/
[Node.js]: https://nodejs.org/
[rsync]: https://rsync.samba.org/
[Yarn]: https://classic.yarnpkg.com/
