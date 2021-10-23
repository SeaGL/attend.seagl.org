# attend.seagl.org

Web interface to the SeaGL 2021 virtual conference

## Development

Install dependencies:

- [Node.js] (latest LTS)
- [Yarn]
- [Make]
- [rsync]
- a local web server, such as [serve] or Python’s [`http.server`][http.server]

Build the static site:

```bash
make
```

Serve it at e.g. [`localhost:8000`](http://localhost:8000/):

```bash
python -m 'http.server' --directory 'dist'
```

<!-- TODO
## Deployment

Push the source to [`SeaGL:production`][production]. [GitHub Actions] is
[configured](./.github/workflows/gh-pages.yml) to automatically build and deploy
the site to AWS [S3] and [CloudFront].
-->

[cloudfront]: https://aws.amazon.com/cloudfront/
[github actions]: https://docs.github.com/en/actions
[http.server]: https://docs.python.org/3/library/http.server.html
[make]: https://www.gnu.org/software/make/
[node.js]: https://nodejs.org/
[production]: https://github.com/SeaGL/attend.seagl.org/tree/production
[rsync]: https://rsync.samba.org/
[s3]: https://aws.amazon.com/s3/
[serve]: https://github.com/vercel/serve
[yarn]: https://yarnpkg.com/
