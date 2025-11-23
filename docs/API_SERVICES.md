# API Services Reference

This document provides comprehensive documentation for all API service modules used in the Industrial Energy Management System.

## Table of Contents

- [Overview](#overview)
- [Service Architecture](#service-architecture)
- [Authentication Services](#authentication-services)
- [Zone Services](#zone-services)
- [Control Services](#control-services)
- [Telemetry Services](#telemetry-services)
- [Master Control Services](#master-control-services)
- [Settings Services](#settings-services)
- [User Management Services](#user-management-services)
- [Audit Services](#audit-services)
- [Fault Services](#fault-services)
- [File Upload Services](#file-upload-services)
- [Error Handling](#error-handling)

## Overview

All API services are located in `src/services/` and provide a clean abstraction layer between components and the backend API.

### Key Principles

1. **Separation of Concerns**: All HTTP logic isolated in services
2. **Consistent Error Handling**: Standardized error format across all services
3. **Type Safety**: Consistent request/response patterns
4. **Reusability**: Services used by multiple components
5. **Centralized Configuration**: Axios instance configured once

### Service Index

**Location**: `src/services/index.js`

All services are exported from a central index file:

```javascript
export * from "./auth.service";
export * from "./zones.service";
export * from "./sendCommand.service";
export * from "./ssrs.service";
export * from "./freezeDevice.service";
export * from "./userProfile.service";
export * from "./updateSetting.service";
export * from "./systemIdentification.service";
export * from "./masterControl.service";
export * from "./auditTrail.service";
export * from "./bulkUpdateDevice.service";
export * from "./faults.service";
export * from "./graphs.service";
export * from "./telemetry.service";
export * from "./schedule.service";
export * from "./uploadS3File.service";
```

## Service Architecture

### Axios Configuration

**Location**: `src/axiosConfig.js`

Centralized Axios configuration with interceptors:

```javascript
import axios from 'axios';

// Set base URL from environment
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Request interceptor - Add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && !config.url.includes('amazonaws')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Pattern

All services follow this pattern:

```javascript
import axios from 'axios';

export const serviceName = async (params) => {
  try {
    const response = await axios.method('/endpoint', params);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
```

## Authentication Services

**Location**: `src/services/auth.service.js`

### loginService

Authenticate user and receive access token.

**Function**: `loginService({ username, password, remember })`

**Parameters**:
```javascript
{
  username: string,  // User email
  password: string,  // User password
  remember: boolean  // Remember me checkbox
}
```

**Returns**: User object with access token
```javascript
{
  user: {
    id: string,
    email: string,
    role: string,
    name: string
  },
  access_token: string
}
```

**Endpoint**: `POST /login`

**Example**:
```javascript
import { loginService } from '../services';

try {
  const result = await loginService({
    username: 'user@example.com',
    password: 'password123',
    remember: true
  });

  localStorage.setItem('access_token', result.access_token);
  // Redirect to dashboard
} catch (error) {
  console.error('Login failed:', error);
}
```

---

### logoutService

Log out current user.

**Function**: `logoutService()`

**Parameters**: None

**Returns**: Success message

**Endpoint**: `POST /logout`

**Example**:
```javascript
import { logoutService } from '../services';

try {
  await logoutService();
  localStorage.removeItem('access_token');
  // Redirect to login
} catch (error) {
  console.error('Logout failed:', error);
}
```

---

### resetPasswordService

Request password reset email.

**Function**: `resetPasswordService(userName)`

**Parameters**:
```javascript
userName: string  // User email address
```

**Returns**: Success message

**Endpoint**: `POST https://api.dev.umb-360.com/api/forget-password`

**Note**: Uses separate axios instance with hardcoded base URL.

**Example**:
```javascript
import { resetPasswordService } from '../services';

try {
  await resetPasswordService('user@example.com');
  // Show success message
} catch (error) {
  console.error('Password reset failed:', error);
}
```

---

### contactUsService

Submit contact form.

**Function**: `contactUsService({ name, email, phone, message })`

**Parameters**:
```javascript
{
  name: string,
  email: string,
  phone: string,
  message: string
}
```

**Returns**: Success message

**Endpoint**: `POST https://api.dev.umb-360.com/api/contact-us`

**Example**:
```javascript
import { contactUsService } from '../services';

try {
  await contactUsService({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    message: 'Need help with...'
  });
} catch (error) {
  console.error('Contact form failed:', error);
}
```

## Zone Services

**Location**: `src/services/zones.service.js`

### getEssZones

Retrieve ESS zone data.

**Function**: `getEssZones(params)`

**Parameters**:
```javascript
{
  location?: string,
  // ... other query params
}
```

**Returns**: Array of ESS zones

**Endpoint**: `GET /get-zones/switches`

**Example**:
```javascript
import { getEssZones } from '../services';

const zones = await getEssZones({ location: 'building-1' });
```

---

### getTgsZones

Retrieve TGS zone data.

**Function**: `getTgsZones(params)`

**Parameters**: Query parameters object

**Returns**: Array of TGS zones

**Endpoint**: `GET /get-zones/blowers`

**Example**:
```javascript
import { getTgsZones } from '../services';

const zones = await getTgsZones({ location: 'building-1' });
```

---

### getTesZones

Retrieve TES zone data.

**Function**: `getTesZones(params)`

**Parameters**: Query parameters object

**Returns**: Array of TES zones

**Endpoint**: `GET /get-zones/blowers?type=TES`

**Example**:
```javascript
import { getTesZones } from '../services';

const zones = await getTesZones({ location: 'building-1' });
```

---

### uploadSiteMapService

Upload site map for a zone.

**Function**: `uploadSiteMapService(zoneId, switchType, siteMapArray, specificZoneId)`

**Parameters**:
```javascript
{
  zoneId: string,           // Zone ID
  switchType: 'ess'|'tgs'|'tes',  // System type
  siteMapArray: Array,      // Site map data
  specificZoneId: string    // Specific zone identifier
}
```

**Returns**: Updated zone object

**Endpoint**: `PATCH /zones/{zoneId}`

**Request Body**:
```javascript
{
  site_maps_ESS: Array,  // If switchType === 'ess'
  site_maps_TGS: Array,  // If switchType === 'tgs'
  site_maps_TES: Array   // If switchType === 'tes'
}
```

**Example**:
```javascript
import { uploadSiteMapService } from '../services';

await uploadSiteMapService(
  'zone-123',
  'ess',
  [{ x: 10, y: 20, device: 'device-1' }],
  'specific-zone-1'
);
```

## Control Services

### sendCommand Service

**Location**: `src/services/sendCommand.service.js`

Send control commands to devices.

**Common Functions**:
- `sendDeviceCommand(deviceId, command, params)` - Send command to device
- `activateDevice(deviceId)` - Activate device
- `deactivateDevice(deviceId)` - Deactivate device
- `setTemperature(deviceId, temperature)` - Set device temperature

**Endpoint**: `POST /devices/{deviceId}/command`

**Request Body**:
```javascript
{
  command: string,
  parameters: object
}
```

**Example**:
```javascript
import { sendDeviceCommand } from '../services';

await sendDeviceCommand('device-123', 'SET_TEMP', {
  temperature: 25.5
});
```

---

### freezeDevice Service

**Location**: `src/services/freezeDevice.service.js`

Freeze/unfreeze device operations.

**Functions**:
- `freezeDevice(deviceId)` - Freeze device
- `unfreezeDevice(deviceId)` - Unfreeze device

**Endpoint**: `POST /devices/{deviceId}/freeze`

**Example**:
```javascript
import { freezeDevice } from '../services';

await freezeDevice('device-123');
```

## Telemetry Services

### telemetry Service

**Location**: `src/services/telemetry.service.js`

Retrieve telemetry data.

**Functions**:
- `getTelemetryData(params)` - Get telemetry data
- `getTelemetryHistory(deviceId, startDate, endDate)` - Get historical data

**Endpoint**: `GET /telemetry`

**Query Parameters**:
```javascript
{
  deviceId?: string,
  startDate?: string,  // ISO 8601 format
  endDate?: string,
  parameter?: string   // Temperature, pressure, etc.
}
```

**Returns**:
```javascript
{
  data: [
    {
      timestamp: string,
      value: number,
      unit: string,
      parameter: string
    }
  ]
}
```

**Example**:
```javascript
import { getTelemetryData } from '../services';

const data = await getTelemetryData({
  deviceId: 'device-123',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  parameter: 'temperature'
});
```

---

### graphs Service

**Location**: `src/services/graphs.service.js`

Retrieve graph data for visualization.

**Functions**:
- `getGraphData(params)` - Get graph data
- `getMultiParameterGraph(params)` - Get multi-parameter data

**Endpoint**: `GET /graphs`

**Query Parameters**:
```javascript
{
  devices: string[],
  parameters: string[],
  startDate: string,
  endDate: string,
  interval?: string  // 'minute' | 'hour' | 'day'
}
```

**Returns**: Formatted graph data

**Example**:
```javascript
import { getGraphData } from '../services';

const graphData = await getGraphData({
  devices: ['device-1', 'device-2'],
  parameters: ['temperature', 'pressure'],
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  interval: 'hour'
});
```

## Master Control Services

**Location**: `src/services/masterControl.service.js`

Master control operations.

**Functions**:
- `getMasterControlData(systemType)` - Get MC data
- `updateMasterControl(systemType, data)` - Update MC settings
- `activateProgram(programId)` - Activate program
- `deactivateProgram(programId)` - Deactivate program

**Endpoints**:
- `GET /master-control/{systemType}`
- `PUT /master-control/{systemType}`
- `POST /master-control/programs/{programId}/activate`
- `POST /master-control/programs/{programId}/deactivate`

**Example**:
```javascript
import { getMasterControlData, activateProgram } from '../services';

const mcData = await getMasterControlData('ess');
await activateProgram('program-123');
```

---

### ssrs Service

**Location**: `src/services/ssrs.service.js`

SSR (Solid State Relay) management.

**Functions**:
- `getSSRs(params)` - Get SSR list
- `updateSSR(ssrId, data)` - Update SSR settings
- `toggleSSR(ssrId, state)` - Toggle SSR on/off

**Endpoints**:
- `GET /ssrs`
- `PUT /ssrs/{ssrId}`
- `POST /ssrs/{ssrId}/toggle`

**Example**:
```javascript
import { getSSRs, toggleSSR } from '../services';

const ssrs = await getSSRs({ zoneId: 'zone-123' });
await toggleSSR('ssr-456', true);
```

---

### schedule Service

**Location**: `src/services/schedule.service.js`

Program scheduling.

**Functions**:
- `getSchedules(params)` - Get schedules
- `createSchedule(data)` - Create new schedule
- `updateSchedule(scheduleId, data)` - Update schedule
- `deleteSchedule(scheduleId)` - Delete schedule

**Endpoints**:
- `GET /schedules`
- `POST /schedules`
- `PUT /schedules/{scheduleId}`
- `DELETE /schedules/{scheduleId}`

**Schedule Object**:
```javascript
{
  id: string,
  name: string,
  programId: string,
  startTime: string,
  endTime: string,
  daysOfWeek: number[],  // 0 = Sunday, 6 = Saturday
  isActive: boolean
}
```

**Example**:
```javascript
import { createSchedule } from '../services';

await createSchedule({
  name: 'Morning Program',
  programId: 'program-123',
  startTime: '06:00',
  endTime: '18:00',
  daysOfWeek: [1, 2, 3, 4, 5],  // Mon-Fri
  isActive: true
});
```

## Settings Services

### updateSetting Service

**Location**: `src/services/updateSetting.service.js`

Update user and system settings.

**Functions**:
- `updateUserSettings(userId, settings)` - Update user preferences
- `updateSystemSettings(settings)` - Update system settings
- `updateAdminSettings(settings)` - Update admin settings

**Endpoints**:
- `PUT /users/{userId}/settings`
- `PUT /settings/system`
- `PUT /settings/admin`

**User Settings Object**:
```javascript
{
  language: 'en' | 'fr',
  notifications: boolean,
  displayPreferences: object,
  // ... other user preferences
}
```

**Example**:
```javascript
import { updateUserSettings } from '../services';

await updateUserSettings('user-123', {
  language: 'fr',
  notifications: true
});
```

---

### bulkUpdateDevice Service

**Location**: `src/services/bulkUpdateDevice.service.js`

Bulk update multiple devices.

**Function**: `bulkUpdateDevices(updates)`

**Parameters**:
```javascript
{
  deviceIds: string[],
  updates: object
}
```

**Endpoint**: `POST /devices/bulk-update`

**Example**:
```javascript
import { bulkUpdateDevices } from '../services';

await bulkUpdateDevices({
  deviceIds: ['device-1', 'device-2', 'device-3'],
  updates: {
    temperature: 25,
    mode: 'auto'
  }
});
```

## User Management Services

**Location**: `src/services/userProfile.service.js`

User profile and management.

**Functions**:
- `getUserProfile(userId)` - Get user profile
- `updateUserProfile(userId, data)` - Update profile
- `changePassword(userId, oldPassword, newPassword)` - Change password
- `getUsers()` - Get all users (admin only)
- `createUser(userData)` - Create new user (admin only)
- `updateUser(userId, userData)` - Update user (admin only)
- `deleteUser(userId)` - Delete user (admin only)

**Endpoints**:
- `GET /users/{userId}`
- `PUT /users/{userId}`
- `POST /users/{userId}/change-password`
- `GET /users`
- `POST /users`
- `PUT /users/{userId}`
- `DELETE /users/{userId}`

**User Object**:
```javascript
{
  id: string,
  email: string,
  name: string,
  role: string,
  phone: string,
  createdAt: string,
  lastLogin: string
}
```

**Example**:
```javascript
import { getUserProfile, updateUserProfile } from '../services';

const profile = await getUserProfile('user-123');
await updateUserProfile('user-123', {
  name: 'John Doe',
  phone: '123-456-7890'
});
```

## Audit Services

**Location**: `src/services/auditTrail.service.js`

Audit trail logging and retrieval.

**Functions**:
- `getAuditLogs(params)` - Get audit logs
- `createAuditLog(data)` - Create audit entry

**Endpoint**: `GET /audit-trail`

**Query Parameters**:
```javascript
{
  userId?: string,
  action?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number
}
```

**Returns**:
```javascript
{
  data: [
    {
      id: string,
      timestamp: string,
      userId: string,
      userName: string,
      action: string,
      target: string,
      details: object,
      result: 'success' | 'failure'
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number
  }
}
```

**Example**:
```javascript
import { getAuditLogs } from '../services';

const logs = await getAuditLogs({
  userId: 'user-123',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  page: 1,
  limit: 50
});
```

## Fault Services

**Location**: `src/services/faults.service.js`

Fault management and tracking.

**Functions**:
- `getFaults(params)` - Get faults
- `acknowledgeFault(faultId, userId)` - Acknowledge fault
- `clearFault(faultId)` - Clear fault

**Endpoints**:
- `GET /faults`
- `POST /faults/{faultId}/acknowledge`
- `POST /faults/{faultId}/clear`

**Query Parameters**:
```javascript
{
  severity?: 'critical' | 'warning' | 'info',
  system?: 'ess' | 'tgs' | 'tes' | 'hp',
  acknowledged?: boolean,
  startDate?: string,
  endDate?: string
}
```

**Fault Object**:
```javascript
{
  id: string,
  timestamp: string,
  severity: 'critical' | 'warning' | 'info',
  system: string,
  device: string,
  message: string,
  acknowledged: boolean,
  acknowledgedBy: string | null,
  acknowledgedAt: string | null,
  cleared: boolean,
  clearedAt: string | null
}
```

**Example**:
```javascript
import { getFaults, acknowledgeFault } from '../services';

const faults = await getFaults({
  severity: 'critical',
  acknowledged: false
});

await acknowledgeFault('fault-123', 'user-456');
```

## File Upload Services

**Location**: `src/services/uploadS3File.service.js`

Upload files to Amazon S3.

**Function**: `uploadToS3(file, folder)`

**Parameters**:
```javascript
{
  file: File,        // File object from input
  folder: string     // S3 folder path
}
```

**Returns**:
```javascript
{
  url: string,       // Public URL of uploaded file
  key: string        // S3 object key
}
```

**Process**:
1. Get pre-signed URL from backend
2. Upload file directly to S3
3. Return public URL

**Endpoint**: `GET /upload/presigned-url`

**Example**:
```javascript
import { uploadToS3 } from '../services';

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  try {
    const result = await uploadToS3(file, 'site-maps');
    console.log('File uploaded:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## System Identification Service

**Location**: `src/services/systemIdentification.service.js`

Identify and retrieve system information.

**Functions**:
- `getSystemInfo()` - Get system information
- `identifyDevice(deviceId)` - Identify specific device

**Endpoints**:
- `GET /system/info`
- `GET /devices/{deviceId}/identify`

**Example**:
```javascript
import { getSystemInfo } from '../services';

const systemInfo = await getSystemInfo();
```

## Error Handling

All services use consistent error handling:

### Error Format

```javascript
{
  message: string,
  code: string,
  details?: object
}
```

### Error Handling Pattern

```javascript
import { serviceName } from '../services';

try {
  const result = await serviceName(params);
  // Handle success
} catch (error) {
  // Error is already formatted by service
  console.error(error.message);

  // Display user-friendly message
  if (error.code === 'NETWORK_ERROR') {
    showMessage('Network error. Please check your connection.');
  } else if (error.code === 'UNAUTHORIZED') {
    // Already handled by interceptor - redirect to login
  } else {
    showMessage(error.message || 'An error occurred');
  }
}
```

### Common Error Codes

| Code | Description | Handling |
|------|-------------|----------|
| `UNAUTHORIZED` | Invalid/expired token | Auto-redirect to login |
| `FORBIDDEN` | Insufficient permissions | Show error message |
| `NOT_FOUND` | Resource not found | Show error message |
| `VALIDATION_ERROR` | Invalid input data | Show validation errors |
| `NETWORK_ERROR` | Network failure | Retry or show error |
| `SERVER_ERROR` | Internal server error | Show generic error |

### Axios Interceptor Error Handling

The axios configuration automatically handles:

1. **401 Unauthorized**: Clears token and redirects to login
2. **Network Errors**: Propagates to service catch block
3. **Server Errors**: Formats error response

## Best Practices

### 1. Always Use Services

```javascript
// ❌ Don't call axios directly in components
const response = await axios.get('/api/zones');

// ✅ Use service functions
const zones = await getEssZones();
```

### 2. Handle Errors Gracefully

```javascript
try {
  const data = await serviceCall();
  // Handle success
} catch (error) {
  // Handle error with user-friendly message
  showErrorMessage(error.message);
}
```

### 3. Use React Query for Caching

```javascript
// ✅ Use React Query for data fetching
const { data, isLoading, error } = useQuery(
  ['zones', location],
  () => getEssZones({ location }),
  { staleTime: 60000 }
);
```

### 4. Provide Loading States

```javascript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await serviceCall();
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Cancel Requests on Unmount

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

## Testing Services

### Unit Testing Example

```javascript
import { loginService } from './auth.service';
import axios from 'axios';

jest.mock('axios');

describe('loginService', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        data: {
          user: { id: '123', email: 'test@example.com' },
          access_token: 'token123'
        }
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await loginService({
      username: 'test@example.com',
      password: 'password123',
      remember: true
    });

    expect(result.access_token).toBe('token123');
  });

  it('should handle login error', async () => {
    axios.post.mockRejectedValue({
      response: {
        data: { message: 'Invalid credentials' }
      }
    });

    await expect(loginService({ username: 'test', password: 'wrong' }))
      .rejects.toEqual({ message: 'Invalid credentials' });
  });
});
```

## API Endpoints Summary

### Base URL
`process.env.REACT_APP_BASE_URL`

### Endpoints

| Method | Endpoint | Service | Description |
|--------|----------|---------|-------------|
| POST | /login | auth | User login |
| POST | /logout | auth | User logout |
| POST | /api/forget-password | auth | Password reset |
| POST | /api/contact-us | auth | Contact form |
| GET | /get-zones/switches | zones | Get ESS zones |
| GET | /get-zones/blowers | zones | Get TGS/TES zones |
| PATCH | /zones/{id} | zones | Update zone |
| POST | /devices/{id}/command | sendCommand | Send device command |
| POST | /devices/{id}/freeze | freezeDevice | Freeze device |
| GET | /telemetry | telemetry | Get telemetry data |
| GET | /graphs | graphs | Get graph data |
| GET | /master-control/{type} | masterControl | Get MC data |
| PUT | /master-control/{type} | masterControl | Update MC |
| GET | /ssrs | ssrs | Get SSRs |
| PUT | /ssrs/{id} | ssrs | Update SSR |
| GET | /schedules | schedule | Get schedules |
| POST | /schedules | schedule | Create schedule |
| PUT | /schedules/{id} | schedule | Update schedule |
| DELETE | /schedules/{id} | schedule | Delete schedule |
| GET | /users | userProfile | Get all users |
| GET | /users/{id} | userProfile | Get user profile |
| POST | /users | userProfile | Create user |
| PUT | /users/{id} | userProfile | Update user |
| DELETE | /users/{id} | userProfile | Delete user |
| POST | /users/{id}/change-password | userProfile | Change password |
| GET | /audit-trail | auditTrail | Get audit logs |
| GET | /faults | faults | Get faults |
| POST | /faults/{id}/acknowledge | faults | Acknowledge fault |
| POST | /faults/{id}/clear | faults | Clear fault |
| POST | /devices/bulk-update | bulkUpdateDevice | Bulk update |
| GET | /upload/presigned-url | uploadS3File | Get S3 upload URL |
| GET | /system/info | systemIdentification | Get system info |

## Conclusion

The service layer provides:
- **Clean Abstraction**: Components don't need to know HTTP details
- **Consistent Error Handling**: Standardized error format
- **Reusability**: Services used across multiple components
- **Testability**: Easy to mock for unit tests
- **Maintainability**: Centralized API logic

For more information:
- [Architecture Guide](ARCHITECTURE.md)
- [Component Reference](COMPONENTS.md)
- [Hooks Reference](HOOKS_REFERENCE.md)
