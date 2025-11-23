# Development Guide

This document provides comprehensive guidelines for developing and contributing to the Industrial Energy Management System.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Component Development](#component-development)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling Guidelines](#styling-guidelines)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

**Required Software**:
- Node.js (v14 or higher)
- npm or yarn
- Git
- Code editor (VS Code recommended)

**Recommended VS Code Extensions**:
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- Auto Import
- GitLens
- styled-components syntax highlighting

### Initial Setup

1. **Clone the repository**:
```bash
git clone <repository-url>
cd new_claude
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
# Create .env file
cat > .env << EOF
REACT_APP_BASE_URL=http://localhost:8000
REACT_APP_AMAZON_S3_URL=https://your-bucket.s3.amazonaws.com
NODE_ENV=development
EOF
```

4. **Start development server**:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Verify Installation

Check that everything is working:

```bash
# Run build (should complete without errors)
npm run build

# Check for outdated dependencies
npm outdated
```

## Development Environment

### Environment Variables

**Required Variables**:
```bash
REACT_APP_BASE_URL        # Backend API base URL
REACT_APP_AMAZON_S3_URL   # Amazon S3 bucket URL
```

**Optional Variables**:
```bash
NODE_ENV                  # 'development' or 'production'
REACT_APP_ENABLE_LOGGING  # Enable console logging
REACT_APP_WEBSOCKET_URL   # WebSocket server URL (defaults to API URL)
```

### Development vs Production

**Development Mode**:
- Hot module reloading
- Source maps enabled
- Redux DevTools enabled
- Verbose error messages
- Mock data available

**Production Mode**:
- Minified bundles
- No source maps
- DevTools disabled
- Error tracking enabled

### Browser Support

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Not Supported**:
- Internet Explorer

## Project Structure

### Directory Organization

```
src/
├── index.js              # Application entry point
├── App.js                # Root component
├── Mainpage.js           # Main routing
├── axiosConfig.js        # HTTP client setup
│
├── components/           # React components
│   ├── feature1/         # Feature-based organization
│   ├── feature2/
│   ├── store/            # Redux store & slices
│   ├── context/          # React Context providers
│   └── styles/           # Shared styled components
│
├── hooks/                # Custom React hooks
├── services/             # API service layer
├── providers/            # Custom providers
├── constants/            # Application constants
├── utils/                # Utility functions
├── helpers/              # Helper functions
└── i18n/                 # Internationalization
    ├── config.js
    └── locales/
        ├── en.json
        └── fr.json
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MasterControl.js` |
| Hooks | camelCase with 'use' prefix | `useSwitchData.js` |
| Services | camelCase with '.service' | `auth.service.js` |
| Slices | camelCase with 'Slice' suffix | `userSlice.js` |
| Styles | camelCase or PascalCase | `commonStyles.js` |
| Constants | UPPER_SNAKE_CASE | `USER_ROLES.js` |
| Utils | camelCase | `temperatureValidation.js` |

## Coding Standards

### JavaScript Style Guide

**General Rules**:
- Use ES6+ syntax
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Destructure props and objects
- Use template literals for string interpolation

**Example**:
```javascript
// ✅ Good
const MyComponent = ({ name, age }) => {
  const greeting = `Hello, ${name}!`;
  return <div>{greeting}</div>;
};

// ❌ Bad
function MyComponent(props) {
  var greeting = 'Hello, ' + props.name + '!';
  return <div>{greeting}</div>;
}
```

### React Best Practices

#### 1. Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Title } from './styles';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 */
const MyComponent = ({ title, onAction }) => {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [localState, setLocalState] = useState(null);
  const dispatch = useDispatch();
  const data = useSelector(state => state.data);

  // 2. Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);

  // 3. Event handlers
  const handleClick = () => {
    onAction();
  };

  // 4. Render helpers (if needed)
  const renderItem = (item) => {
    return <div key={item.id}>{item.name}</div>;
  };

  // 5. Conditional renders
  if (!data) return <Loading />;
  if (error) return <Error message={error} />;

  // 6. Main render
  return (
    <Container>
      <Title>{title}</Title>
      {/* Component JSX */}
    </Container>
  );
};

export default MyComponent;
```

#### 2. PropTypes or TypeScript

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object)
};

MyComponent.defaultProps = {
  onAction: () => {},
  items: []
};
```

#### 3. Hooks Rules

```javascript
// ✅ Good - hooks at top level
const MyComponent = () => {
  const [state, setState] = useState(null);
  const data = useCustomHook();

  if (!data) return null;

  return <div>{state}</div>;
};

// ❌ Bad - conditional hooks
const MyComponent = () => {
  if (condition) {
    const [state, setState] = useState(null); // Error!
  }
};
```

### Import Organization

```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// 2. Internal absolute imports
import { apiService } from '../services';
import { useCustomHook } from '../hooks';

// 3. Relative imports
import { Container } from './styles';
import SubComponent from './SubComponent';

// 4. Constants and types
import { USER_ROLES } from '../constants';
```

### Code Formatting

**Prettier Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always"
}
```

**ESLint Configuration** (`.eslintrc`):
```json
{
  "extends": ["react-app", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react/prop-types": "warn"
  }
}
```

## Component Development

### Creating a New Component

1. **Create component directory**:
```bash
mkdir -p src/components/myFeature
cd src/components/myFeature
```

2. **Create component files**:
```bash
touch index.js           # Main component
touch styles.js          # Styled components
touch MyFeature.test.js  # Tests
```

3. **Component template**:
```javascript
// index.js
import React from 'react';
import { Container } from './styles';

const MyFeature = ({ prop1, prop2 }) => {
  return (
    <Container>
      {/* Component content */}
    </Container>
  );
};

export default MyFeature;
```

4. **Styles template**:
```javascript
// styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background: #fff;
`;

export const Title = styled.h2`
  color: #333;
  font-size: 24px;
`;
```

### Component Types

#### 1. Container Components (Smart)
```javascript
const MasterControlContainer = ({ location, machine }) => {
  const data = useSwitchData(location, machine, 'ess');
  const controls = useSwitchControls('ess', location, machine);

  return <MasterControlPresenter data={data} controls={controls} />;
};
```

#### 2. Presenter Components (Dumb)
```javascript
const MasterControlPresenter = ({ data, controls }) => {
  return (
    <div>
      <h2>{data.headerTitle}</h2>
      <button onClick={controls.handleShutOff}>Shut Off</button>
    </div>
  );
};
```

## State Management

### When to Create a New Redux Slice

Create a new slice when:
- State needs to be shared across multiple components
- State needs persistence
- State has complex update logic
- State is used in multiple routes

**Don't create a slice for:**
- UI-only state (use `useState`)
- Temporary form state
- Component-specific state

### Creating a New Slice

1. **Create slice file**:
```javascript
// src/components/store/slices/myFeatureSlice.js
import { createSlice } from '@reduxjs/toolkit';

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: {
    data: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setData, setLoading, setError } = myFeatureSlice.actions;
export default myFeatureSlice;
```

2. **Add to store**:
```javascript
// src/components/store/store.js
import myFeatureSlice from './slices/myFeatureSlice';

const store = configureStore({
  reducer: {
    myFeature: myFeatureSlice.reducer,
    // ... other reducers
  }
});
```

3. **Use in component**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../store/slices/myFeatureSlice';

const MyComponent = () => {
  const data = useSelector(state => state.myFeature.data);
  const dispatch = useDispatch();

  const handleUpdate = (newData) => {
    dispatch(setData(newData));
  };
};
```

## API Integration

### Creating a New Service

1. **Create service file**:
```javascript
// src/services/myFeature.service.js
import axios from 'axios';

export const getFeatureData = async (params) => {
  try {
    const response = await axios.get('/feature', { params });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const updateFeatureData = async (id, data) => {
  try {
    const response = await axios.put(`/feature/${id}`, data);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
```

2. **Export from index**:
```javascript
// src/services/index.js
export * from './myFeature.service';
```

3. **Use with React Query**:
```javascript
import { useQuery, useMutation } from 'react-query';
import { getFeatureData, updateFeatureData } from '../services';

const MyComponent = () => {
  const { data, isLoading } = useQuery(
    ['featureData'],
    getFeatureData
  );

  const updateMutation = useMutation(updateFeatureData);

  const handleUpdate = async (newData) => {
    await updateMutation.mutateAsync({ id: '123', data: newData });
  };
};
```

## Styling Guidelines

### Styled Components Patterns

#### 1. Component-Scoped Styles
```javascript
// In component file or separate styles.js
const Container = styled.div`
  padding: 20px;
  background: ${props => props.highlighted ? '#f0f0f0' : '#fff'};
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

#### 2. Shared Styles
```javascript
// src/components/styles/commonStyles.js
import styled, { css } from 'styled-components';

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

#### 3. Theme Variables
```javascript
// Use consistent values
const colors = {
  primary: '#007bff',
  danger: '#dc3545',
  warning: '#ffc107',
  success: '#28a745'
};

const Button = styled.button`
  background: ${props => colors[props.variant] || colors.primary};
`;
```

### Responsive Design
```javascript
const Container = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    padding: 5px;
  }
`;

// Or use react-responsive
import { useMediaQuery } from 'react-responsive';

const MyComponent = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return isMobile ? <MobileView /> : <DesktopView />;
};
```

## Testing

### Unit Testing

**Test Structure**:
```javascript
// MyComponent.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(<MyComponent isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Testing Hooks
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSwitchData } from './useSwitchData';

test('useSwitchData returns correct data', () => {
  const { result } = renderHook(() =>
    useSwitchData('loc1', 'machine1', 'ess', false, false)
  );

  expect(result.current.systemType).toBe('ess');
});
```

### Testing Redux
```javascript
import { configureStore } from '@reduxjs/toolkit';
import userSlice, { setUser } from './userSlice';

test('setUser updates state correctly', () => {
  const store = configureStore({
    reducer: { user: userSlice.reducer }
  });

  store.dispatch(setUser({ id: '123', name: 'John' }));

  expect(store.getState().user.id).toBe('123');
  expect(store.getState().user.name).toBe('John');
});
```

## Git Workflow

### Branch Naming

```
feature/feature-name      # New features
bugfix/bug-description    # Bug fixes
hotfix/critical-fix       # Critical production fixes
refactor/component-name   # Code refactoring
docs/documentation-update # Documentation changes
```

### Commit Messages

Follow conventional commits:

```
feat: add user authentication
fix: resolve temperature conversion bug
refactor: extract shared hooks
docs: update API documentation
style: format code with prettier
test: add tests for MasterControl
chore: update dependencies
```

**Detailed commit example**:
```
feat: add real-time fault notifications

- Implement WebSocket listener for fault events
- Add notification component with severity colors
- Update FaultsSlice with new fault actions
- Add unit tests for fault notifications

Closes #123
```

### Pull Request Process

1. **Create feature branch**:
```bash
git checkout -b feature/my-feature
```

2. **Make changes and commit**:
```bash
git add .
git commit -m "feat: add my feature"
```

3. **Push to remote**:
```bash
git push origin feature/my-feature
```

4. **Create PR with description**:
- Describe what changed
- Reference related issues
- Include screenshots if UI changes
- List testing done

5. **Code review**:
- Address reviewer comments
- Update code as needed
- Re-request review

6. **Merge**:
- Squash commits if needed
- Delete branch after merge

## Common Tasks

### Adding a New Route

1. **Update Mainpage.js**:
```javascript
import NewFeature from './components/newFeature';

// In Routes component
<Route path="/new-feature" element={<NewFeature />} />
```

2. **Add to sidebar navigation**:
```javascript
// In sidebar component
const navItems = [
  // ...
  { path: '/new-feature', label: 'New Feature', icon: <Icon /> }
];
```

### Adding Translations

1. **Add to English**:
```json
// src/i18n/locales/en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Feature description"
  }
}
```

2. **Add to French**:
```json
// src/i18n/locales/fr.json
{
  "newFeature": {
    "title": "Nouvelle fonctionnalité",
    "description": "Description de la fonctionnalité"
  }
}
```

3. **Use in component**:
```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('newFeature.title')}</h1>;
};
```

### Adding a New User Role

1. **Add to constants**:
```javascript
// src/constants/index.js
export const USER_ROLES = {
  // ...
  NEW_ROLE: 'New_Role'
};
```

2. **Define permissions**:
```javascript
export const ROLE_PERMISSIONS = {
  [USER_ROLES.NEW_ROLE]: {
    canControlESS: true,
    canViewAudit: false,
    // ...
  }
};
```

3. **Use in components**:
```javascript
const canAccess = permissions.canControlESS;

{canAccess && <ControlPanel />}
```

## Troubleshooting

### Common Issues

#### Issue: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

#### Issue: Redux state not persisting
```bash
# Clear localStorage
localStorage.clear();

# Check persist configuration in store.js
```

#### Issue: Styling not applied
```bash
# Restart dev server
# Check styled-components version compatibility
# Verify import paths
```

### Debugging Tips

1. **Use React DevTools**: Inspect component props and state
2. **Use Redux DevTools**: Track state changes and actions
3. **Console logging**: Add strategic console.logs (remove before commit)
4. **Debugger statements**: Use `debugger;` to pause execution
5. **Network tab**: Check API calls and responses

### Performance Issues

1. **Use React.memo() for expensive components**
2. **Implement useMemo() for expensive calculations**
3. **Use useCallback() for stable function references**
4. **Code-split large components with React.lazy()**
5. **Optimize images and assets**

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [styled-components](https://styled-components.com/)
- [React Query](https://tanstack.com/query/latest)

### Project Documentation
- [Architecture Guide](ARCHITECTURE.md)
- [Component Reference](COMPONENTS.md)
- [API Services](API_SERVICES.md)
- [Hooks Reference](HOOKS_REFERENCE.md)
- [State Management](STATE_MANAGEMENT.md)

## Conclusion

Following these guidelines will help maintain:
- **Code Quality**: Consistent, readable code
- **Maintainability**: Easy to update and extend
- **Performance**: Optimized user experience
- **Collaboration**: Clear patterns for team development
- **Documentation**: Well-documented codebase

Happy coding!
