# My Project (NCLEX Preparation)

## 🔧 Project Structure
- `frontend/` – Next.js frontend
- `backend/` – NestJS backend
- `Database` - PostgreSQL

## 🚀 Getting Started

### Frontend
```bash```
cd frontend
npm install
npm run dev

### Backend
```bash```
cd backend
npm install
npm run start:dev



## 📌 Technology Summary

| Layer / Feature           | Technology Choice               | Reason                                                       |
|---------------------------|----------------------------------|-------------------------------------------------------------|
| **Frontend**              | Next.js + Tailwind CSS           | SEO-friendly, responsive, modern UI                         |
| **Backend**               | NestJS (Node.js)                 | Structured API, scalable, maintainable                      |
| **Database**              | PostgreSQL                       | Relational data for subscriptions, progress tracking        |
| **Authentication**        | JWT                              | Stateless, secure                                           |
| **Payments**              | Stripe                           | Global support, subscription handling, webhooks             |
| **Recorded Video Hosting**| AWS S3 + CloudFront CDN          | Reliable, scalable, fast streaming                          |
| **Live Streaming**        | AWS IVS / Mux / Agora            | Low-latency streaming, easy integration                     |
| **Chat**                  | Socket.IO                        | Real-time communication                                     |
| **Email Notifications**   | SendGrid / AWS SES               | Automated expiry alerts                                     |
| **Video Player**          | Video.js / Plyr + HLS.js         | Resume feature, adaptive bitrate                            |
| **Analytics**             | Backend API + PostgreSQL         | Track and show progress                                     |
