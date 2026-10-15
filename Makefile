MODE ?= up

.PHONY: all clean dist element-web-dev

all: clean dist

%.hash: %
	@digest="$$(cksum --algorithm 'crc32b' --raw $<)"; \
	test -f "$@" -a "$$(cat $@)" = "$$digest" || echo "$$digest" > $@

clean:
	rm --force --recursive \
	  'dist' \
	  'element-web/apps/web/webapp'

dist: dist/.$(MODE).sentinel

dist/.down.sentinel: $(shell find 'down' -type 'f')
	rsync --delete --itemize-changes --recursive --times \
	  --exclude '.down.sentinel' \
	  'down/' \
	  'dist/'
	sed --in-place "s/__CURRENT_YEAR__/$$(date +%Y)/g" 'dist/index.html'
	touch 'dist/.down.sentinel'

dist/.up.sentinel: element-web/apps/web/webapp/.sentinel $(shell find 'static' -type 'f')
	rsync --delete --itemize-changes --recursive --times \
	  --exclude '.up.sentinel' \
	  'static/' \
	  'element-web/apps/web/webapp/' \
	  'dist/'
	touch 'dist/.up.sentinel'

element-web/apps/web/webapp/.sentinel: element-web/node_modules/.sentinel $(shell find 'element-web/apps/web/src' -type 'f')
	cd 'element-web/apps/web' && pnpm build
	touch element-web/apps/web/webapp/.sentinel

element-web/node_modules/.sentinel: element-web/pnpm-lock.yaml.hash
	cd 'element-web/apps/web' && pnpm install
	touch 'element-web/node_modules/.sentinel'

element-web-dev: element-web/node_modules/.sentinel
	cd 'element-web/apps/web' && pnpm start
