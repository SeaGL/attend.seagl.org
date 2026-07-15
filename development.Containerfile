FROM node:22

RUN apt-get update \
  && apt-get install --no-install-recommends --yes \
    'python-is-python3' \
    'rsync' \
  && apt-get clean \
  && rm --recursive '/var/lib/apt/lists/'*

USER 'node'
WORKDIR '/mnt/attend.seagl.org'
CMD ["bash"]
