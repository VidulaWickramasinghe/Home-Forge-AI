FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package.json ./
COPY scripts ./scripts
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
