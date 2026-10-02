FROM node:22-trixie AS build

# Dependencies
RUN apt-get update \
  && apt-get install --no-install-recommends --yes \
    'rsync' \
  && apt-get clean \
  && rm --recursive '/var/lib/apt/lists/'*
RUN npm install --global 'pnpm@12'

# Source
COPY --chown='node:node' 'element-web' '/home/node/attend.seagl.org/element-web'
COPY --chown='node:node' 'static' '/home/node/attend.seagl.org/static'
COPY --chown='node:node' 'Makefile' '/home/node/attend.seagl.org/Makefile'

# Build
USER 'node'
WORKDIR '/home/node/attend.seagl.org'
ENV NX_DAEMON='false'
RUN make 'dist'

FROM scratch AS static-site

# Build artifacts
COPY --from=build '/home/node/attend.seagl.org/dist' '/'
