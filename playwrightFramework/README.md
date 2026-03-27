# Playwright Automation Framework
## Web UI + API | POM | QA & Staging | Data-Driven

---

## 📁 Project Structure

```
PlaywrightFramework/
├── playwright.config.ts          ← Main config (env, browsers, timeouts)
├── package.json                  ← Scripts and dependencies
├── tsconfig.json
├── .env.qa                       ← QA environment variables
├── .env.stage                    ← Staging environment variables
│
├── config/
│   └── envConfig.ts              ← Loads .env.qa or .env.stage
│
├── pages/                        ← Page Object Model
│   ├── BasePage.ts               ← Common actions (click, fill, assert)
│   ├── LoginPage.ts              ← Login POM
│   ├── DashboardPage.ts          ← Dashboard POM
│   └── LeavePage.ts              ← Leave module POM
│
├── fixtures/
│   └── index.ts                  ← Custom Playwright fixtures (POM injection)
│
├── utils/
│   ├── DataReader.ts             ← Read JSON + Excel test data
│   ├── ApiHelper.ts              ← Playwright API request wrapper
│   └── Logger.ts                 ← Console logger with timestamps
│
├── data/
│   ├── web/
│   │   ├── loginData.json        ← Login test data per env
│   │   ├── leaveData.json        ← Leave test data per env
│   │   └── leaveData.xlsx        ← Excel data (optional)
│   └── api/
│       └── usersData.json        ← API test data per env
│
├── tests/
│   ├── web/
│   │   ├── login.spec.ts         ← Login UI tests + data driven
│   │   ├── dashboard.spec.ts     ← Dashboard tests
│   │   └── leave.spec.ts         ← Leave tests (JSON + Excel driven)
│   └── api/
│       ├── users.spec.ts         ← Users API tests
│       └── auth.spec.ts          ← Auth API tests
│
└── reports/
    ├── html-report/              ← Playwright HTML report
    └── results.json              ← JSON results
```

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Update environment files
# Edit .env.qa and .env.stage with your actual URLs and credentials
```

---

## ▶️ Run Commands

### QA Environment
```bash
npm run test:qa:web       # Web UI tests on QA
npm run test:qa:api       # API tests on QA
npm run test:qa:all       # All tests on QA
```

### Staging Environment
```bash
npm run test:stage:web    # Web UI tests on Staging
npm run test:stage:api    # API tests on Staging
npm run test:stage:all    # All tests on Staging
```

### By Tag
```bash
npm run test:smoke        # @smoke tests only
npm run test:regression   # @regression tests only
```

### Headed (see browser)
```bash
npm run test:headed
```

### View Report
```bash
npm run report
```

---

## 🌍 Environment Config

Edit `.env.qa` or `.env.stage`:
```
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
USERNAME=your_user
PASSWORD=your_pass
```

---

## 📊 Adding Excel Test Data

Create `data/web/leaveData.xlsx` with sheet `LeaveData`:

| Environment | LeaveType    | FromDate   | ToDate     | Comment     |
|-------------|-------------|------------|------------|-------------|
| qa          | Annual Leave | 2026-03-20 | 2026-03-22 | Team outing |
| stage       | Annual Leave | 2026-03-25 | 2026-03-27 | Stage test  |
