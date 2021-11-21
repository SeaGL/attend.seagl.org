.PHONY: all clean down

all: clean dist

clean:
	rm --force --recursive \
	  'dist' \
	  'element-web/webapp'

dist: dist/.sentinel

dist/.sentinel: element-web/webapp
	rsync --itemize-changes --recursive --times \
	  'element-web/webapp/' \
	  'dist/'
	touch 'dist/.sentinel'

down: clean
	mkdir --verbose 'dist'
	cp --verbose 'static/down.html' 'dist/index.html'

element-web/node_modules: element-web/yarn.lock
	cd 'element-web' && yarn install --frozen-lockfile

element-web/webapp: element-web/node_modules $(shell find 'element-web/src' -type 'f')
	cd 'element-web' && yarn build
