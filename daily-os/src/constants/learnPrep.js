export const SKILLS = {
  playwright: { label:'Playwright',   color:'#6c47ff' },
  typescript: { label:'TypeScript',   color:'#3b82f6' },
  javascript: { label:'JavaScript',   color:'#f59e0b' },
  api:        { label:'API Testing',  color:'#22c55e' },
  cicd:       { label:'CI/CD',        color:'#ef4444' },
  selenium:   { label:'Selenium',     color:'#06b6d4' },
  python:     { label:'Python',       color:'#8b5cf6' },
  docker:     { label:'Docker',       color:'#0ea5e9' },
  sql:        { label:'SQL',          color:'#d97706' },
  jira:       { label:'Jira',         color:'#1d4ed8' },
  azure:      { label:'Azure',        color:'#0284c7' },
  git:        { label:'Git/GitHub',   color:'#374151' },
  general:    { label:'General/HR',   color:'#6b7280' },
}

export const PREP_TYPES = [
  { id:'selfintro',    label:'👤 Self Intro'       },
  { id:'hr',           label:'💼 HR Behavioral'    },
  { id:'technical',    label:'🔧 Technical'        },
  { id:'experience',   label:'📖 Experience Based' },
  { id:'project',      label:'🏗 Project Based'    },
  { id:'hypothetical', label:'🤔 Hypothetical'     },
  { id:'salary',       label:'💰 Salary / Offer'   },
]

export const DEFAULT_QA = {
  playwright: [
    { q:'What is Playwright and why use it over Selenium?', a:'Playwright is a modern browser automation library by Microsoft. Supports Chromium, Firefox, WebKit with a single API. Faster than Selenium, built-in auto-wait, supports async/await natively, no WebDriver needed. Better TypeScript integration.' },
    { q:'Explain Page Object Model (POM) in Playwright.', a:'POM separates page UI elements and actions from test logic. Each page has its own class with locators and methods. Tests call page methods instead of raw locators. Makes tests readable, maintainable, reusable. In Playwright: extend BasePage class, define locators in constructor, expose action methods.' },
    { q:'How do you handle flaky tests in Playwright?', a:'Use stable locators (data-testid over CSS/XPath), avoid hard waits (page.waitForTimeout), use expect with timeout, leverage retries in playwright.config.ts, use test.fixme for known flaky tests, isolate test state with fixtures, clear cookies/storage between tests.' },
    { q:'What are fixtures in Playwright and how do you use them?', a:'Fixtures set up and tear down test dependencies. Built-in: page, browser, context. Custom: define with test.extend(). Run before/after each test automatically. Enable shared state (e.g. authenticated page) across tests without repeating setup code.' },
    { q:'How do you run Playwright tests in CI/CD?', a:'Add playwright to package.json. In GitHub Actions: install Node, run npm ci, run npx playwright install --with-deps, then npx playwright test. Use --reporter=html for reports. Upload test-results as artifact. Can use sharding for parallel execution across workers.' },
    { q:'Explain Playwright APIRequestContext for API testing.', a:'Playwright can test APIs directly via request fixture. request.get/post/put/delete return APIResponse. Check response.status(), response.json(). Useful for seeding test data before UI tests or validating backend calls. Same auth context as browser if needed.' },
  ],
  typescript: [
    { q:'What is TypeScript and why use it for test automation?', a:'TypeScript is JavaScript with static types. For automation: catches type errors at compile time, better IDE autocomplete, self-documenting code, easier refactoring. Playwright has first-class TypeScript support — no extra setup needed.' },
    { q:'What are interfaces vs types in TypeScript?', a:'Interfaces: define shape of objects, extendable with extends, can be merged (declaration merging). Types: more flexible, support unions/intersections, cannot be merged. For test data models use interfaces. For union types (status:"pass"|"fail") use type aliases.' },
    { q:'What is async/await and why is it important in Playwright?', a:'async/await handles Promises (async operations) synchronously-looking. await pauses execution until Promise resolves. Critical in Playwright because all browser actions are async. Without await: tests proceed before elements load, causing failures. Always await page.click(), page.fill(), expect() etc.' },
    { q:'What are generics in TypeScript?', a:'Generics create reusable components that work with any type. Example: function getValue<T>(arr: T[]): T returns typed value. In test helpers: createTestData<UserProfile>() returns properly typed object. Avoids any type while keeping flexibility.' },
  ],
  javascript: [
    { q:'What is the difference between var, let, and const?', a:'var: function-scoped, hoisted, can re-declare. let: block-scoped, not hoisted, cannot re-declare. const: block-scoped, must initialize, cannot reassign (but object properties can change). Use const by default, let when reassignment needed, avoid var.' },
    { q:'Explain Promises and async/await.', a:'Promise: object representing eventual completion/failure of async operation. States: pending, fulfilled, rejected. .then()/.catch() chains. async/await: syntactic sugar over Promises. await pauses function until Promise resolves. Makes async code look synchronous. try/catch handles errors.' },
    { q:'What is closure in JavaScript?', a:'Closure: function that remembers variables from its outer scope even after outer function returns. Example: counter function returns inner function that increments count variable. Inner function closes over count. Common in callbacks, module pattern, memoization.' },
  ],
  api: [
    { q:'What HTTP methods do you use in API testing?', a:'GET: retrieve data. POST: create resource. PUT: replace resource. PATCH: partial update. DELETE: remove resource. HEAD: like GET but no body. Test all methods for a resource. Verify correct status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.' },
    { q:'What is API contract testing?', a:'Verifying API response matches agreed schema/contract between provider and consumer. Tools: Pact (consumer-driven), JSON Schema validation. Catches breaking changes before deployment. In Playwright: validate response shape with zod or ajv schema validation.' },
    { q:'How do you test authentication in APIs?', a:'Test: valid token returns 200, expired token returns 401, no token returns 401, wrong role returns 403. For OAuth: test token refresh flow. For API keys: rotate and verify old key rejected. In Playwright: pass Authorization header in request context, store token in fixture for reuse.' },
    { q:'What do you check in an API test response?', a:'Status code correctness, response time (performance), response body schema, specific field values, headers (Content-Type, Cache-Control), error messages for bad requests, empty vs null fields, pagination correctness, idempotency for PUT/DELETE.' },
  ],
  cicd: [
    { q:'What is CI/CD and why does QA care about it?', a:'CI: merge code frequently, run automated tests on every commit. CD: automatically deploy passing builds. QA role: tests must run in pipeline, failures block deployment, test results visible to team. Fast feedback loop catches bugs early, reduces manual testing need.' },
    { q:'How do you configure Playwright in GitHub Actions?', a:'Create .github/workflows/playwright.yml. Steps: checkout code, setup-node, npm ci, npx playwright install --with-deps, npx playwright test. Set env vars as secrets. Upload test-results/ and playwright-report/ as artifacts. Use matrix strategy for parallel test runs across browsers.' },
    { q:'What is test sharding in Playwright CI?', a:'Splits test suite across multiple machines/workers for faster execution. --shard=1/4 runs first quarter of tests. Combine with GitHub Actions matrix. Use playwright merge-reports to combine sharded results. Reduces CI time from 20min to 5min for large suites.' },
  ],
  selenium: [
    { q:'What is the difference between Selenium and Playwright?', a:'Selenium: WebDriver protocol, external browser drivers, older, wide language support, slower, manual waits needed. Playwright: direct browser protocol, no external drivers, faster, built-in auto-wait, TypeScript-first, better parallel support. Playwright preferred for new projects.' },
    { q:'How do you handle waits in Selenium?', a:'Implicit wait: global timeout for all element finds. Explicit wait: WebDriverWait for specific condition (element visible, clickable). Fluent wait: custom polling. Avoid Thread.sleep() — brittle. Best: explicit waits with ExpectedConditions. Similar to Playwright waitForSelector but manual.' },
  ],
  python: [
    { q:'Why use Python for test automation?', a:'Readable syntax, large library ecosystem (pytest, requests, selenium). pytest: powerful fixtures, plugins (pytest-html, allure), parametrize for data-driven tests. requests: clean HTTP API testing. Slower than Node for Playwright but excellent for backend/API testing and data scripts.' },
    { q:'What is pytest and what are its key features?', a:'pytest: Python testing framework. Features: fixture system (dependency injection), parametrize decorator (data-driven), marks (skip, xfail), plugins ecosystem, detailed failure reports, test discovery. Run: pytest tests/ -v --html=report.html. Conftest.py for shared fixtures.' },
  ],
  docker: [
    { q:'How does Docker help in QA?', a:'Consistent test environment across local/CI. Run Playwright in Docker: mcr.microsoft.com/playwright image has all browsers pre-installed. No "works on my machine" issues. Spin up test databases in containers. Run Selenium Grid in Docker for parallel cross-browser testing.' },
  ],
  sql: [
    { q:'What SQL queries do you write for QA?', a:'Verify test data: SELECT * FROM orders WHERE user_id=123. Check state after action: SELECT status FROM payments WHERE transaction_id=\'xyz\'. Data setup: INSERT INTO test_users VALUES(...). Cleanup: DELETE FROM test_orders WHERE created_at > \'2026-01-01\'. JOIN for cross-table verification.' },
    { q:'What is a JOIN and what types exist?', a:'JOIN combines rows from two tables. INNER JOIN: only matching rows. LEFT JOIN: all from left + matching right. RIGHT JOIN: all from right + matching left. FULL OUTER JOIN: all rows from both. In QA: JOIN orders o ON o.user_id = u.id to verify order-user relationship.' },
  ],
  jira: [
    { q:'How do you use Jira in your QA workflow?', a:'Track test execution in sprints. Create bugs with steps to reproduce, expected vs actual, severity, screenshot, environment. Link bugs to user stories. Use test cycles in Zephyr/Xray plugin. Update test case status (Pass/Fail/Blocked). Query with JQL: project=PROJ AND issuetype=Bug AND status!=Done.' },
  ],
  azure: [
    { q:'What Azure services have you used in testing?', a:'Azure DevOps Pipelines for CI/CD. Azure Test Plans for manual test cases. Azure Repos for Git. Azure Boards for work items. In pipelines: YAML-based, stages for build/test/deploy, publish test results task, download artifacts between stages.' },
  ],
  general: [
    { q:'Tell me about yourself.', a:'I\'m Soma Sai Dinesh Cheviti, an SDET with 1 year 7 months experience at Echno Technologies in Bengaluru. I built end-to-end Playwright+TypeScript automation for fintech payment flows across 10+ merchant sites. I specialize in API testing, CI/CD pipelines with GitHub Actions, and I\'m passionate about Agentic QA using Playwright MCP + Claude. I\'m an immediate joiner looking for SDET roles in product companies.' },
    { q:'Why are you leaving your current company?', a:'I completed my engagement at Echno Technologies and I\'m now seeking a role where I can work with a larger product team, contribute to scalable test infrastructure, and grow into more complex automation challenges.' },
    { q:'What is your expected salary?', a:'Based on my experience and the market for SDET roles with Playwright+TypeScript expertise, I\'m targeting 8.5 to 9.5 LPA depending on the company profile. I\'m an immediate joiner so there\'s no cost from notice period.' },
    { q:'Where do you see yourself in 3 years?', a:'Leading test automation strategy for a product — designing the framework from scratch, mentoring junior SDETs, integrating AI-assisted testing into the pipeline, and contributing to shift-left quality practices.' },
    { q:'Describe a challenging bug you found.', a:'At Echno, I found a race condition in payment confirmation flow — UI showed "Payment Successful" but backend hadn\'t confirmed. Found it by writing API-level Playwright tests that validated backend state after each UI action.' },
    { q:'How do you handle pressure and deadlines?', a:'I prioritize ruthlessly — identify which tests cover highest-risk areas, automate those first. Communicate early if timeline is at risk. I stay calm under pressure by breaking big tasks into small checkboxes.' },
  ],
}
