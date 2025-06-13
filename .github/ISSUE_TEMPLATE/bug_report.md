---
name: Bug report
about: Create a report to help us improve the SDK
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Bug Description

A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce

Steps to reproduce the behavior:

1. Initialize client with '...'
2. Call method '...'
3. Pass parameters '...'
4. See error

## ✅ Expected Behavior

A clear and concise description of what you expected to happen.

## ❌ Actual Behavior

A clear and concise description of what actually happened.

## 📋 Environment

**SDK Version:** [e.g. 0.1.0]
**Node.js Version:** [e.g. 18.16.0]
**NPM Version:** [e.g. 9.5.1]
**Operating System:** [e.g. macOS 13.4, Ubuntu 20.04, Windows 11]
**TypeScript Version:** [e.g. 5.0.4]

## 📝 Code Sample

```typescript
// Minimal code sample that reproduces the issue
import { TesouroClient } from '@tesouro/tesouro-sdk-for-node';

const client = new TesouroClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

// Your code that causes the issue
```

## 📄 Error Output

```
Paste any error messages, stack traces, or console output here
```

## 🔍 Additional Context

Add any other context about the problem here:

- Are you using any specific GraphQL operations?
- Is this related to authentication/token management?
- Does this happen consistently or intermittently?
- Any workarounds you've found?

## 🛠️ Possible Solution

If you have ideas on how to fix the issue, please share them here.

---

### Checklist

Please confirm the following:

- [ ] I have searched existing issues to make sure this is not a duplicate
- [ ] I have provided a minimal code sample that reproduces the issue
- [ ] I have included the complete error message/stack trace
- [ ] I have specified my environment details
- [ ] I am using the latest version of the SDK