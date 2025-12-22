# Node SDK Roadmap

This roadmap outlines planned features and improvements for the Cohost Node.js SDK. Priorities may shift based on community feedback and API stability.

## Current Status

### ✅ Completed (v0.1.x)
- Core `CohostClient` with token authentication
- **Events API**: List, fetch, search events and attendees
- **Orders API**: Fetch order details and attendees
- **Cart Sessions API**: Full checkout flow (create, update, payment, place order)
- Pagination support
- TypeScript definitions
- Error handling with `CohostError`

---

## Roadmap

### 🎯 Phase 1: Complete Core CRUD (Next Release)
**Goal**: Enable full event and ticket management

**Events Module Expansion**
- [ ] `POST /v1/events` - Create events
- [ ] `PATCH /v1/events/:id` - Update events
- [ ] `POST /v1/events/:id/tickets` - Create tickets
- [ ] `PATCH /v1/events/:id/tickets/:ticketId` - Update tickets
- [ ] `DELETE /v1/events/:id/tickets/:ticketId` - Delete tickets

**Orders Module Expansion**
- [ ] `POST /v1/orders/:id/send-confirmation` - Send order confirmation emails

**Why**: Completing write operations for existing modules provides the most value with lowest risk.

---

### 🎯 Phase 2: Coupon Management
**Goal**: Complete checkout workflow with promotional features

**New Module: `client.coupons`**
- [ ] `GET /v1/coupons` - List coupons
- [ ] `POST /v1/coupons` - Create coupons
- [ ] `PATCH /v1/coupons/:id` - Update coupons
- [ ] `DELETE /v1/coupons/:id` - Delete coupons

**Why**: Cart sessions already support applying coupons. Adding management completes the feature.

---

### 🎯 Phase 3: Workflows Integration
**Goal**: Enable workflow automation visibility and testing

**New Module: `client.workflows`**
- [ ] `GET /v1/workflows` - List workflows with pagination
- [ ] `GET /v1/workflows/:id` - Get workflow details
- [ ] `GET /v1/workflows/:id/runs` - Get workflow execution history
- [ ] `GET /v1/workflows/runs/:runId` - Get specific run details
- [ ] `POST /v1/workflows/:id/trigger` - Manually trigger workflows

**Why**: Workflows provide automation. Read operations enable monitoring, trigger enables testing.

---

## Future Considerations

### Quality & Developer Experience
- [ ] Comprehensive integration tests
- [ ] Enhanced TypeScript documentation
- [ ] Request/response examples in docs
- [ ] Webhook validation helpers
- [ ] Retry logic and rate limiting

### Advanced Features
Additional API modules will be evaluated based on:
- Community demand
- API stability
- Clear use cases for SDK consumers

---

## How to Contribute

We welcome community contributions! Here's how you can help:

1. **Report Issues**: Found a bug? [Open an issue](https://github.com/your-repo/issues)
2. **Request Features**: Need a specific endpoint? Let us know via discussions
3. **Submit PRs**: Check roadmap items marked "help wanted"
4. **Improve Docs**: Documentation improvements are always appreciated

### Contribution Guidelines
- All PRs should include tests
- Follow existing code style and patterns
- Update TypeScript definitions for new endpoints
- Add JSDoc comments for public methods

---

## Version History

### v0.1.0 (Current)
- Initial release with Events, Orders, and Cart Sessions support
- Full TypeScript support
- Basic error handling

---

**Note**: This roadmap is subject to change based on API updates, community feedback, and project priorities. Check back regularly for updates.
