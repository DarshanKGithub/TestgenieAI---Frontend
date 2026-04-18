# TestGenie AI Frontend

## Stack
- Next.js 16
- TypeScript
- Tailwind CSS
- Material UI

## Run
1. Install dependencies:
   npm install
2. Copy env file:
   cp .env.example .env.local
3. Start frontend:
   npm run dev

Frontend runs on http://localhost:3000

## Implemented UI Features
- JWT login/register UI
- Generated test case workflow from user flow text
- Real run execution request with target URL + path checks
- Dashboard summary cards
- Pass/fail trend chart (bar)
- Duration trend chart (line)
- Test runs table with pagination and filtering
