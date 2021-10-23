.PHONY: all clean element-web static

all: clean element-web static

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

clean:
	rm --force --recursive \
		'dist' \
		'element-web/webapp'
