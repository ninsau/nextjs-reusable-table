# 🔒 Security Policy

## 📋 **Supported Versions**

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 3.7.x   | :white_check_mark: |
| 3.6.x   | :white_check_mark: |
| < 3.6.0 | :x:                |

## 🚨 **Reporting Vulnerabilities**

If you discover a security vulnerability in nextjs-reusable-table, please report it to us as follows:

### **Contact Information**

- **Email**: cassidyblay@gmail.com
- **Response Time**: We will acknowledge your report within 48 hours
- **Updates**: We will provide regular updates every 7 days on the status

### **How to Report**

Please include the following information in your report:

1. **Description**: A clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Potential impact and severity of the vulnerability
4. **Environment**: Your environment details (OS, Node.js version, etc.)
5. **Proof of Concept**: If possible, include a proof of concept

### **What to Expect**

1. **Acknowledgment**: We will acknowledge receipt within 48 hours
2. **Investigation**: We will investigate the report and determine its validity
3. **Updates**: We will provide regular updates on our progress
4. **Resolution**: We will work to resolve valid vulnerabilities
5. **Disclosure**: We will coordinate disclosure with you

## 🛡️ **Security Best Practices**

### **For Users**

- Always use the latest version of the library
- Validate and sanitize all user inputs
- Implement proper authentication and authorization
- Keep your dependencies up to date
- Monitor for security advisories

### **For Contributors**

- Follow secure coding practices
- Implement input validation and sanitization
- Use parameterized queries for database operations
- Implement proper error handling
- Avoid exposing sensitive information in logs

## 🔍 **Security Considerations**

### **Client-Side Security**

- The library renders content on the client side
- Ensure proper input sanitization before passing data to the table
- Be cautious with user-generated content
- Implement Content Security Policy (CSP) headers

### **Data Protection**

- The library itself does not store or transmit data
- All data handling is the responsibility of the implementing application
- Ensure proper data encryption for sensitive information
- Implement proper access controls

## 📊 **Vulnerability Classification**

We use the following severity levels:

- **Critical**: Immediate threat to data confidentiality, integrity, or availability
- **High**: Significant security risk with potential for exploitation
- **Medium**: Security weakness with limited exploitation potential
- **Low**: Minor security improvements needed
- **Info**: Informational findings or recommendations

## 🔄 **Security Updates**

- Security updates will be released as patch versions (e.g., 3.7.2 → 3.7.3)
- Critical security fixes may warrant a minor version bump (e.g., 3.7.x → 3.8.0)
- All security updates will be documented in the CHANGELOG.md
- Users will be notified through GitHub Security Advisories

## 📞 **Contact**

For security-related questions or concerns:

- **Security Issues**: security@nextjs-reusable-table.dev
- **General Support**: https://github.com/ninsau/nextjs-reusable-table/issues
- **Discussions**: https://github.com/ninsau/nextjs-reusable-table/discussions

## 🙏 **Acknowledgments**

We appreciate the security research community for helping keep our project safe. Security researchers who report valid vulnerabilities will be acknowledged in our security advisory unless they request otherwise.

## 📝 **Legal Notice**

This security policy is subject to change. Please check this page regularly for updates. By using this software, you agree to follow responsible disclosure practices.
