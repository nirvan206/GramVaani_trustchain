# Contributing to TrustChain

Thank you for your interest in contributing to TrustChain! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Submitting Changes](#submitting-changes)
7. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion, or sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ installed
- Git installed
- MetaMask browser extension
- Basic knowledge of JavaScript, React, Solidity
- Familiarity with blockchain concepts

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/trustchain.git
   cd trustchain
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/trustchain.git
   ```

### Set Up Development Environment

Follow the [SETUP_GUIDE.md](SETUP_GUIDE.md) to set up your local development environment.

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Commit Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add loan approval notification feature"
```

**Commit message format:**
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add multi-language support for Tamil

fix: resolve wallet connection issue on mobile

docs: update API documentation for loan endpoints

refactor: optimize reputation score calculation

test: add unit tests for loan contract
```

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
```

---

## Coding Standards

### JavaScript/TypeScript

**Style Guide:**
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string concatenation
- Use async/await instead of callbacks
- Add JSDoc comments for functions

**Example:**
```javascript
/**
 * Calculate total loan amount including interest
 * @param {number} principal - Principal loan amount
 * @param {number} interestRate - Interest rate in basis points
 * @returns {number} Total amount due
 */
const calculateTotalDue = (principal, interestRate) => {
  const interest = (principal * interestRate) / 10000;
  return principal + interest;
};
```

**Formatting:**
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Trailing commas in objects/arrays

### React

**Component Guidelines:**
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names (PascalCase)
- Extract reusable logic into custom hooks
- Use prop-types or TypeScript for type checking

**Example:**
```javascript
import { useState, useEffect } from 'react';

function LoanCard({ loan, onApprove }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(loan.id);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{loan.purpose}</h3>
      <p>Amount: ₹{loan.amount}</p>
      <button onClick={handleApprove} disabled={loading}>
        {loading ? 'Processing...' : 'Approve'}
      </button>
    </div>
  );
}

export default LoanCard;
```

### Solidity

**Smart Contract Guidelines:**
- Follow Solidity style guide
- Use latest stable version (0.8.x)
- Add NatSpec comments
- Use OpenZeppelin contracts when possible
- Implement access control
- Add events for important state changes
- Use modifiers for common checks

**Example:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title LoanContract
 * @dev Manages loan creation and repayment
 */
contract LoanContract is AccessControl {
    /// @notice Emitted when a new loan is created
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);

    /**
     * @notice Create a new loan request
     * @param _amount Loan amount in wei
     * @param _duration Loan duration in days
     * @return loanId The ID of the created loan
     */
    function createLoan(uint256 _amount, uint256 _duration) 
        external 
        returns (uint256 loanId) 
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        
        // Implementation...
    }
}
```

### CSS/Tailwind

**Guidelines:**
- Use Tailwind utility classes
- Keep custom CSS minimal
- Use semantic class names
- Follow mobile-first approach
- Ensure accessibility (ARIA labels, keyboard navigation)

---

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Utility functions
- Business logic
- Smart contract functions

**Example (Jest):**
```javascript
describe('calculateTotalDue', () => {
  it('should calculate correct total with interest', () => {
    const principal = 10000;
    const interestRate = 1200; // 12%
    const expected = 11200;
    
    const result = calculateTotalDue(principal, interestRate);
    
    expect(result).toBe(expected);
  });

  it('should handle zero interest rate', () => {
    const principal = 10000;
    const interestRate = 0;
    
    const result = calculateTotalDue(principal, interestRate);
    
    expect(result).toBe(principal);
  });
});
```

### Smart Contract Tests

**Example (Hardhat):**
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoanContract", function () {
  let loanContract;
  let owner, borrower, lender;

  beforeEach(async function () {
    [owner, borrower, lender] = await ethers.getSigners();
    
    const LoanContract = await ethers.getContractFactory("LoanContract");
    loanContract = await LoanContract.deploy();
  });

  it("should create a loan", async function () {
    const amount = ethers.parseEther("1");
    const interestRate = 1200;
    const duration = 90;

    await expect(
      loanContract.connect(borrower).createLoan(amount, interestRate, duration, "Business", "")
    ).to.emit(loanContract, "LoanCreated");
  });

  it("should reject loan with zero amount", async function () {
    await expect(
      loanContract.connect(borrower).createLoan(0, 1200, 90, "Business", "")
    ).to.be.revertedWith("Amount must be greater than 0");
  });
});
```

### Integration Tests

Test complete user flows:
- User registration → Loan application → Approval → Repayment
- Dispute creation → Resolution

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Smart contract tests
cd contracts
npx hardhat test

# Coverage
npm run test:coverage
```

---

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Update API documentation
   - Add inline code comments

2. **Run Tests**
   ```bash
   npm test
   ```

3. **Lint Code**
   ```bash
   npm run lint
   ```

4. **Create Pull Request**
   - Go to GitHub and create a PR
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

---

## Issue Reporting

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check if it's already fixed in the latest version
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- MetaMask version: [e.g., 11.5.0]

**Additional context**
Any other relevant information
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want to happen

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context or screenshots
```

---

## Development Tips

### Debugging

**Backend:**
```javascript
// Use Winston logger
logger.debug('Loan data:', { loanId, amount });
logger.error('Error processing loan:', error);
```

**Frontend:**
```javascript
// Use React DevTools
console.log('Component state:', state);
```

**Smart Contracts:**
```javascript
// Use Hardhat console
console.log("Loan amount:", amount);
```

### Common Issues

**Issue:** MetaMask not connecting
**Solution:** Check network configuration, clear cache

**Issue:** Transaction failing
**Solution:** Check gas limits, ensure sufficient balance

**Issue:** MongoDB connection error
**Solution:** Verify connection string, check network access

---

## Community

### Communication Channels

- **GitHub Issues:** Bug reports and feature requests
- **GitHub Discussions:** General questions and discussions
- **Discord:** Real-time chat (link in README)
- **Email:** support@trustchain.io

### Getting Help

If you need help:
1. Check the documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Join our Discord community

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Recognized in the community

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to TrustChain! Together, we're building financial inclusion for rural India.** 🚀
