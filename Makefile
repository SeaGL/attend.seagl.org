.PHONY: all clean

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

element-web/node_modules: element-web/yarn.lock
	cd 'element-web' && yarn install --frozen-lockfile

element-web/webapp: element-web/node_modules $(shell find 'element-web/src' -type 'f')
	cd 'element-web' && yarn build
