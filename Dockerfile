# Use the official lightweight Nginx Alpine image
FROM nginx:alpine

# Copy all static website assets to the default Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
