# ── Build stage ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /workspace

# Shared tsconfig — services extend ../../config/tsconfig.base.json
COPY config/ config/

# Install dependencies first (cache layer)
COPY services/node-backend-generator/package*.json services/node-backend-generator/
WORKDIR /workspace/services/node-backend-generator
RUN npm install

# Copy source and build
# postbuild automatically copies templates to dist/templates
COPY services/node-backend-generator/ .
RUN npm run build
# cpx postbuild copies to the correct location for node-backend-generator (dist/templates)
# Just in case, ensure it's there
RUN cp -r src/templates dist/templates || true

# ── Runtime stage ──────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Compiled output + embedded templates
COPY --from=builder /workspace/services/node-backend-generator/dist ./dist

# Production dependencies only
COPY services/node-backend-generator/package*.json ./
RUN npm install --omit=dev

EXPOSE 3015

CMD ["node", "dist/index.js"]