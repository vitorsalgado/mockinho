# Build Stage
# ---
FROM node:14 AS builder

WORKDIR /opt/app

COPY . .

RUN npm i && \
    npm run bootstrap && \
    npm run build

# Run Stage
# ---
FROM gcr.io/distroless/nodejs:14

USER nobody

COPY --from=builder /opt/app /mockapp

WORKDIR /mockapp
VOLUME /mockapp

ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV
ENV PATH /mockapp/node_modules/.bin:/mockapp/http/node_modules/.bin:$PATH

EXPOSE 8080 8443

ENTRYPOINT ["/nodejs/bin/node", "/mockapp/http/dist/cli/index.js"]
