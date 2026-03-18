# Scalability Notes

## Current Architecture
Monolithic Node.js/Express + MongoDB, single process, JWT-stateless. Suitable for MVP.

## Horizontal Scaling
- JWT is stateless → multiple server instances can run behind a load balancer (NGINX / AWS ALB)
- MongoDB Atlas supports replica sets + sharding automatically
- Use PM2 cluster mode for multi-core usage immediately: `pm2 start server.js -i max`

## Caching with Redis
```js
// Example: cache /tasks per user
const cached = await redis.get(`tasks:${userId}`);
if (cached) return res.json(JSON.parse(cached));
const tasks = await Task.find({ owner: userId });
await redis.setex(`tasks:${userId}`, 60, JSON.stringify(tasks));
```
Also use Redis for: JWT blocklist (logout), rate-limit counters, session storage.

## Microservices Split
| Service            | Responsibility                  |
|--------------------|---------------------------------|
| Auth Service       | Register, login, JWT, users     |
| Task Service       | CRUD for tasks                  |
| Notification Svc   | Email/push on task updates      |
| API Gateway        | Rate limiting, routing, auth    |

Services communicate via RabbitMQ or Kafka event bus.

## Docker + Kubernetes
```yaml
# docker-compose.yml
services:
  server:
    build: ./server
    ports: ["5000:5000"]
    environment:
      - MONGO_URI=mongodb://mongo:27017/intern_db
  mongo:
    image: mongo:7
    volumes: [mongo_data:/data/db]
  redis:
    image: redis:alpine
volumes:
  mongo_data:
```
Deploy to Kubernetes with Horizontal Pod Autoscaler (HPA) on CPU/request metrics.

## API Gateway
Add Kong or AWS API Gateway in front for:
- Centralized rate limiting
- Auth token verification
- Request logging and tracing
- Clean v1 → v2 versioning without downstream changes

## Database Indexing
Already added: `taskSchema.index({ owner: 1, createdAt: -1 })`
Add more as query patterns grow.