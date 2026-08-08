.PHONY: all clean down element-web-dev widgets-dev

all: clean dist

clean:
	rm --force --recursive \
	  'dist' \
	  'element-web/webapp' \
	  'widgets/dist'

.git/modules/seagl.org/HEAD: .gitmodules
	git submodule update 'seagl.org'

dist: dist/.sentinel dist/config.json dist/embedded-pages/.sentinel dist/widgets/seagl/.sentinel

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

dist/widgets/seagl/.sentinel: widgets/dist
	rsync --delete --itemize-changes --recursive --times \
	  --exclude '/element-call' \
	  'widgets/dist/' \
	  'dist/widgets/seagl/'
	touch 'dist/widgets/seagl/.sentinel'

down: clean
	mkdir --verbose 'dist'
	cp --verbose 'static/down.html' 'dist/index.html'

element-web-dev: element-web/node_modules widgets/dist
	cd 'element-web' && yarn start

element-web/node_modules: element-web/yarn.lock
	cd 'element-web' && yarn install --frozen-lockfile

element-web/webapp: element-web/node_modules $(shell find 'element-web/src' -type 'f')
	cd 'element-web' && yarn build

widgets-dev: .git/modules/seagl.org/HEAD widgets/node_modules
	cd 'widgets' && yarn start

widgets/dist: .git/modules/seagl.org/HEAD widgets/node_modules $(shell find 'widgets' \( -path 'widgets/dist' -o -path 'widgets/node_modules' \) -prune -o -type 'f' -print)
	cd 'widgets' && yarn build

widgets/node_modules: widgets/yarn.lock
	cd 'widgets' && yarn install --frozen-lockfile
