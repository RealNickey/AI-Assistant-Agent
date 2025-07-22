# Test Suite Documentation

This repository includes a comprehensive test suite covering all major components and functionality of the AI Assistant Agent.

## Test Structure

```
test/
├── utils.test.ts              # Utility functions tests
├── button.test.tsx            # Button component tests
├── input.test.tsx             # Input component tests
├── label.test.tsx             # Label component tests
├── icons.test.tsx             # Icon components tests
├── project-overview.test.tsx  # Project overview component tests
├── resources-schema.test.ts   # Database schema tests
├── embeddings-schema.test.ts  # Embeddings schema tests
├── embedding.test.ts          # AI embedding functions tests
├── resources-actions.test.ts  # Server actions tests
├── chat-api.test.ts           # API route tests
├── env.test.ts                # Environment configuration tests
└── integration.test.ts        # End-to-end integration tests
```

## Test Categories

### 1. Unit Tests

#### Utility Functions (`utils.test.ts`)

- Tests the `cn()` function for class merging
- Tests the `nanoid()` function for ID generation
- Validates conditional class handling
- Tests Tailwind CSS class merging

#### UI Components

- **Button Component (`button.test.tsx`)**

  - Tests all variants (default, destructive, outline, secondary, ghost, link)
  - Tests all sizes (default, sm, lg, icon)
  - Tests click handling and disabled states
  - Tests accessibility features and ref forwarding

- **Input Component (`input.test.tsx`)**

  - Tests basic rendering and props
  - Tests event handling (onChange, onFocus, onBlur)
  - Tests controlled and uncontrolled states
  - Tests disabled state and custom styling

- **Label Component (`label.test.tsx`)**

  - Tests basic rendering and association with form controls
  - Tests accessibility with htmlFor attribute
  - Tests custom styling and event handling

- **Icons Components (`icons.test.tsx`)**

  - Tests VercelIcon with size customization
  - Tests InformationIcon rendering
  - Tests LoadingIcon with animation states
  - Tests accessibility and color inheritance

- **Project Overview Component (`project-overview.test.tsx`)**
  - Tests complete component rendering
  - Tests all external links and their targets
  - Tests responsive design classes
  - Tests dark mode styling

### 2. Database Tests

#### Schema Tests

- **Resources Schema (`resources-schema.test.ts`)**

  - Tests table structure and column definitions
  - Tests validation schema for input data
  - Tests data type constraints and requirements

- **Embeddings Schema (`embeddings-schema.test.ts`)**
  - Tests vector embeddings table structure
  - Tests foreign key relationships
  - Tests indexing for vector similarity search

### 3. AI/ML Tests

#### Embedding Functions (`embedding.test.ts`)

- Tests text chunking and embedding generation
- Tests single and batch embedding creation
- Tests similarity search functionality
- Tests error handling for AI API failures
- Tests database integration for embeddings

### 4. Server-Side Tests

#### Actions (`resources-actions.test.ts`)

- Tests resource creation workflow
- Tests input validation and sanitization
- Tests database integration
- Tests embedding generation pipeline
- Tests comprehensive error handling

#### API Routes (`chat-api.test.ts`)

- Tests chat endpoint functionality
- Tests tool integration (addResource, getInformation, understandQuery)
- Tests streaming response handling
- Tests request validation and error handling

### 5. Configuration Tests

#### Environment (`env.test.ts`)

- Tests environment variable validation
- Tests required vs optional configurations
- Tests type safety and runtime mapping
- Tests different environment modes

### 6. Integration Tests

#### End-to-End Workflows (`integration.test.ts`)

- Tests complete resource creation and retrieval flow
- Tests chat API with all tools integration
- Tests error handling across system boundaries
- Tests data consistency and performance
- Tests concurrent operations

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

### Test-Specific Commands

```bash
# Run specific test file
npm test utils.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="Button Component"

# Run tests for a specific directory
npm test test/

# Run tests with verbose output
npm test -- --verbose
```

## Test Configuration

### Jest Configuration (`jest.config.ts`)

- Uses Next.js Jest configuration
- Configured for jsdom environment for React component testing
- Includes module path mapping for TypeScript aliases
- Setup file for global test configuration

### Test Setup (`jest.setup.ts`)

- Configures testing-library/jest-dom matchers
- Mocks external dependencies (nanoid, next/navigation)
- Sets up environment variables for testing
- Provides global test utilities

## Mocking Strategy

### External Dependencies

- **AI SDK**: Mocked to prevent API calls during testing
- **Database**: Mocked to avoid database dependencies
- **Next.js**: Mocked navigation and routing functions
- **Environment**: Controlled test environment variables

### Component Dependencies

- **Framer Motion**: Simplified motion components
- **Radix UI**: Mocked to focus on component logic
- **Icons**: Simplified test representations

## Coverage Goals

The test suite aims for:

- **90%+ Line Coverage**: Most code paths tested
- **85%+ Branch Coverage**: Decision points covered
- **100% Function Coverage**: All functions tested
- **Critical Path Coverage**: Key user workflows fully tested

## Best Practices

### Test Organization

- One test file per source file when possible
- Grouped related tests in describe blocks
- Clear, descriptive test names
- Focused, single-responsibility tests

### Assertions

- Use specific matchers for better error messages
- Test both positive and negative cases
- Include edge cases and error conditions
- Verify both behavior and state

### Maintenance

- Update tests when functionality changes
- Remove obsolete tests for removed features
- Keep mocks up to date with real implementations
- Regular review of test coverage reports

## Continuous Integration

Tests run automatically on:

- Pull request creation and updates
- Merge to main branch
- Scheduled nightly builds
- Manual workflow triggers

## Debugging Tests

### Common Issues

- **Import Errors**: Check module path mapping in Jest config
- **Mock Issues**: Verify mock implementations match real APIs
- **Timing Issues**: Use proper async/await patterns
- **Environment Issues**: Check test environment setup

### Debug Commands

```bash
# Run specific test with debug output
npm test -- --verbose --no-coverage utils.test.ts

# Run tests with Node.js debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Generate detailed coverage report
npm run test:coverage -- --verbose
```

This comprehensive test suite ensures the reliability, maintainability, and quality of the AI Assistant Agent codebase.
