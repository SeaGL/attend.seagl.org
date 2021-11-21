.PHONY: all clean down element-web matrix-react-sdk static

all: clean matrix-react-sdk element-web static

down:
	make clean \
	&& mkdir --parents 'dist' \
	&& cp 'static/down.html' 'dist/index.html'

element-web:
	cd 'element-web' \
	&& yarn link 'matrix-react-sdk' \
	&& yarn install --frozen-lockfile \
	&& yarn build \
	&& mkdir --parents '../dist' \
	&& rsync --checksum --itemize-changes --recursive \
		'webapp/' '../dist/'

matrix-react-sdk:
	cd 'matrix-react-sdk' \
	&& yarn link --relative \
	&& yarn install --frozen-lockfile

static:
	rsync --checksum --itemize-changes --recursive \
		'static/' 'dist/'

clean:
	rm --force --recursive \
		'dist' \
		'element-web/webapp'
