#!/bin/bash

# Install dependencies
npm install

# Run database migrations if needed
npm run db:migrate || true

# Build Next.js application
npm run build

echo "Build completed successfully!"
