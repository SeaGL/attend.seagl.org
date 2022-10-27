.PHONY: all clean element-web matrix-react-sdk static widgets

all: clean matrix-react-sdk element-web widgets static

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
