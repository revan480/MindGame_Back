# Development stage
FROM node:16.14.2-alpine3.14 AS development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "npm", "run", "dev" ]

# Production stage
FROM development AS production

# Run the build script
RUN npm run build

# Expose the port
EXPOSE 3000

RUN npx prisma generate

CMD [ "node", "dist/main" ]
