FROM node:22-trixie

RUN apt-get update \
  && apt-get install --no-install-recommends --yes \
    'rsync' \
  && apt-get clean \
  && rm --recursive '/var/lib/apt/lists/'*
RUN npm install --global 'pnpm@12'

USER 'node'
WORKDIR '/mnt/attend.seagl.org'
ENV NX_DAEMON='false'
CMD ["make", "element-web-dev"]
