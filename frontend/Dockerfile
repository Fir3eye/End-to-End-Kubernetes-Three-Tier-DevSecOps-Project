# Stage 1: Build the React application
FROM node:18 as build

# Set working directory
WORKDIR /app

# Set environment variable to use OpenSSL legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
