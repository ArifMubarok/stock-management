FROM node:22-alpine

# Create app directory
WORKDIR /app

# Install dependencies based on the preferred package manager
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

# Start the server using the production build
CMD ["ng", "serve", "--host", "0.0.0.0"]
