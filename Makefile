.PHONY: all clean down

all: clean dist

clean:
	rm --force --recursive \
	  'dist' \
	  'element-web/webapp'

dist: dist/.sentinel dist/config.json dist/embedded-pages/.sentinel

dist/.sentinel: element-web/webapp
	rsync --itemize-changes --recursive --times \
	  --exclude '/config.json' \
	  'element-web/webapp/' \
	  'dist/'
	touch 'dist/.sentinel'

dist/config.json: static/config.json
	cp --verbose 'static/config.json' 'dist/config.json'

dist/embedded-pages/.sentinel: $(shell find 'static/embedded-pages' -type 'f')
	rsync --delete --itemize-changes --recursive --times \
	  'static/embedded-pages/' \
	  'dist/embedded-pages/'
	touch 'dist/embedded-pages/.sentinel'

down: clean
	mkdir --verbose 'dist'
	cp --verbose 'static/down.html' 'dist/index.html'

element-web/node_modules: element-web/yarn.lock
	cd 'element-web' && yarn install --frozen-lockfile

element-web/webapp: element-web/node_modules $(shell find 'element-web/src' -type 'f')
	cd 'element-web' && yarn build
