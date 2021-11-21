.PHONY: all clean down element-web static widgets

all: clean element-web widgets static

down:
	make clean \
	&& mkdir --parents 'dist' \
	&& cp 'static/down.html' 'dist/index.html'

element-web:
	cd 'element-web' \
	&& yarn install --frozen-lockfile \
	&& yarn build \
	&& mkdir --parents '../dist' \
	&& rsync --checksum --itemize-changes --recursive \
		'webapp/' '../dist/'

static:
	rsync --checksum --itemize-changes --recursive \
		'static/' 'dist/'

widgets:
	cd 'widgets' \
	&& yarn install --frozen-lockfile \
	&& yarn build \
	&& mkdir --parents '../dist' \
	&& rsync --checksum --itemize-changes --recursive \
		'dist/' '../dist/widgets/'

clean:
	rm --force --recursive \
		'dist' \
		'element-web/webapp' \
		'widgets/dist'
