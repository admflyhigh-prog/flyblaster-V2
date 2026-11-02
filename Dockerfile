# Fly Blaster — static frontend (nginx)
# Build context: repository root. Only `frontend/` is copied into the image;
# everything else is excluded via .dockerignore (never expose backend/ or secrets).
FROM nginx:alpine

# Static assets only
COPY frontend/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
