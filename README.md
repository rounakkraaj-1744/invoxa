# Invoxa

Invoxa is a modern, full-stack invoicing and billing management platform designed for businesses to streamline their financial operations. It features a robust backend for managing invoices, clients, payments, and automation, coupled with a high-performance, aesthetically pleasing frontend.

## 🚀 Key Features

- **Invoicing System**: Generate, manage, and track professional invoices with custom PDF templates.
- **Client Management**: Maintain a central database of clients and their billing history.
- **Payments Integration**: Support for global and local payment gateways (Stripe, Razorpay).
- **Authentication**: Secure multi-method authentication (Email/Password, Google OAuth) powered by Better Auth.
- **API Access**: Developer-friendly API with API Key management and rate limiting.
- **Automation**: Background workers for PDF generation, recurring invoices, and webhooks using BullMQ.
- **Monitoring & Analytics**: Built-in analytics for tracking business performance.
- **Enterprise Ready**: Structured with security (Helmet, CORS), logging (Pino), and error tracking (Sentry).

## 🛠 Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: PostgreSQL with [Neon](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Queue System**: [BullMQ](https://docs.bullmq.io/) with Redis
- **Email**: [Resend](https://resend.com/)
- **PDF Generation**: Puppeteer with Handlebars templates
- **API Docs**: [Scalar](https://scalar.com/) (OpenAPI/Zod)
- **Logging**: Pino & Pino-Pretty

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)

## ⚙️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/docs/installation) installed
- Redis instance (local or hosted)
- Neon (PostgreSQL) database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rounakkraaj-1744/invoxa.git
   cd invoxa
   ```

2. Install dependencies:
   ```bash
   # Root directory install
   cd backend && bun install
   cd ../frontend && bun install
   ```

3. Environment Setup:
   Create a `.env` file in the `backend` directory based on `.env.example`.

   ```env
   # Essential Variables
   DATABASE_URL="your_neon_url"
   REDIS_URL="redis://localhost:6379"
   BETTER_AUTH_SECRET="your_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   RESEND_API_KEY="your_resend_key"
   ```

4. Database Migration:
   ```bash
   cd backend
   bun db:migrate
   bun db:generate
   ```

### Running the App

- **Backend**: `cd backend && bun dev`
- **Workers**: `cd backend && bun worker`
- **Frontend**: `cd frontend && bun dev`

## 📂 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration (DB, Redis, Sentry)
│   │   ├── lib/          # External service clients (Auth, Resend, Stripe)
│   │   ├── middleware/   # Express middlewares (Auth, Validation)
│   │   ├── modules/      # Domain-driven features (Invoices, Clients, etc.)
│   │   ├── queues/       # BullMQ queue definitions
│   │   ├── workers/      # background job processors
│   │   └── templates/    # Handlebars email/PDF templates
│   └── prisma/           # Database schema
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # UI components
│   │   └── lib/          # Frontend utilities and hooks
```

## 📜 License

This project is licensed under the MIT License.
