# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of TaskHub seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Reporting Process

1. **DO NOT** create a public GitHub issue for the vulnerability.
2. Email your findings to [icham.mmadi@outlook.fr](mailto:icham.mmadi@outlook.fr).
3. Include detailed steps to reproduce the issue.
4. Include any potential implications of the vulnerability.

### What to Include in Your Report

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Process

1. Your email will be acknowledged within 48 hours.
2. We will provide a detailed response within 72 hours.
3. We will follow up with a plan for resolution and disclosure.

### Disclosure Policy

- Security vulnerabilities will be handled promptly and transparently
- Updates will be published once a patch is ready
- Credit will be given to the reporter if desired

## Security Measures Implemented

- JWT Authentication
- Password Hashing (bcrypt)
- CORS Protection
- Input Validation
- XSS Prevention
- SQL Injection Protection
- Rate Limiting
- Secure Headers

## Contact

For any security concerns, please contact:
- Icham M'MADI
- Email: icham.mmadi@outlook.fr
