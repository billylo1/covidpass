# Install dependencies only when needed
FROM node:14-alpine AS deps

#Creates directories
RUN mkdir -p /usr/src/app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /usr/src/app

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /usr/src/app/next.config.js ./next.config.js
COPY --from=builder /usr/src/app/next-i18next.config.js ./next-i18next.config.js
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT [ "yarn" ]
