.PHONY: all clean down element-web-dev

all: clean dist

%.hash: %
	@digest="$$(cksum --algorithm 'crc32b' --raw $<)"; \
	test -f "$@" -a "$$(cat $@)" = "$$digest" || echo "$$digest" > $@

clean:
	rm --force --recursive \
	  'dist' \
	  'element-web/apps/web/webapp'

dist: dist/.sentinel

dist/.sentinel: element-web/apps/web/webapp
	rsync --itemize-changes --recursive --times \
	  'element-web/apps/web/webapp/' \
	  'dist/'
	touch 'dist/.sentinel'

down: clean
	mkdir --verbose 'dist'
	cp --verbose 'static/down.html' 'dist/index.html'

element-web/apps/web/webapp: element-web/node_modules/.sentinel $(shell find 'element-web/apps/web/src' -type 'f' ! -name 'modules.js')
	cd 'element-web/apps/web' && pnpm build

element-web/node_modules/.sentinel: element-web/pnpm-lock.yaml.hash
	cd 'element-web/apps/web' && pnpm install
	touch 'element-web/node_modules/.sentinel'

element-web-dev: element-web/node_modules/.sentinel
	cd 'element-web/apps/web' && pnpm start
