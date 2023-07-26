FROM node:10 as base

ARG NODE_OPTIONS="--max_old_space_size=3584"
ENV NODE_OPTIONS="${NODE_OPTIONS}"

# TODO do not run as root
# RUN useradd --user-group --create-home --shell /bin/false app
# ENV HOME=/home/app
# USER app
# WORKDIR $HOME/app
WORKDIR /app

FROM base as build

# TODO bring back package-lock.json
# COPY package.json package-lock.json ./
COPY package.json ./
COPY package-lock.json ./

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install

COPY . .

ARG PRISMA_HOST
ARG PRISMA_STAGE
ARG PRISMA_MANAGEMENT_API_SECRET

ARG POSTGRES_SCHEMA

ARG NAMECHEAP_API_KEY
ARG NAMECHEAP_API_USER
ARG NAMECHEAP_CLIENT_IP
ARG NAMECHEAP_URL
ARG NAMECHEAP_USERNAME

ARG SENDGRID_KEY
ARG SENDGRID_FROM
ARG SENDGRID_TEMPLATE_ID
ARG SENDGRID_TEMPLATE_NEW_USER
ARG SENDGRID_TEMPLATE_SPLIT_PAYMENT_FINALIZE

ARG GCLOUD_KEY_BASE64
RUN mkdir -p build
RUN sh -c 'echo "${GCLOUD_KEY_BASE64}" | base64 -d | tee build/gcloud-key.json'

RUN npm run build:prod

CMD ["npm", "run", "start"]
