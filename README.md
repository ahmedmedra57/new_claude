# Industrial Energy Management System

A comprehensive React-based web application for monitoring and controlling industrial energy systems including Energy Storage Systems (ESS), Thermal Gas Systems (TGS), Thermal Electric Systems (TES), and Heating Platforms (HP).

## Overview

This application provides a sophisticated dashboard and control interface for managing multiple types of industrial energy systems. It features real-time monitoring, telemetry visualization, master control capabilities, fault tracking, audit trails, and comprehensive settings management.

### Key Features

- **Real-time Monitoring**: Live data updates via WebSocket connections
- **Multi-System Support**: Manage ESS, TGS, TES, and HP systems from a single interface
- **Master Control**: Centralized control system for all connected devices
- **Telemetry Visualization**: Comprehensive data visualization with charts and graphs
- **Role-Based Access Control**: 16 distinct user roles with granular permissions
- **Internationalization**: Full support for English and French languages
- **Audit Trail**: Complete logging of all user actions and system changes
- **Fault Management**: Real-time fault tracking and alerting
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Report Generation**: Comprehensive reporting capabilities

## Technology Stack

### Core Technologies
- **React** - UI framework
- **Redux Toolkit** - State management with persistence
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling

### Data Management
- **React Query** - Server state management and caching
- **Axios** - HTTP client with authentication interceptors
- **Socket.io** - Real-time WebSocket communication
- **Redux Persist** - State persistence to localStorage

### Internationalization
- **i18next** - Translation framework
- **i18next-browser-languagedetector** - Automatic language detection

### Additional Libraries
- **react-responsive** - Responsive design utilities
- **qs** - Query string parsing
- **history** - Browser history management

## Project Structure

```
/
├── src/
│   ├── index.js                 # Application entry point
│   ├── App.js                   # Root component with providers
│   ├── Mainpage.js              # Main routing logic
│   ├── axiosConfig.js           # HTTP client configuration
│   │
│   ├── components/              # React components
│   │   ├── store/               # Redux store and slices (40+)
│   │   ├── context/             # React Context providers
│   │   ├── styles/              # Shared styled components
│   │   ├── globalOverview/      # Dashboard overview
│   │   ├── masterControl/       # Control system components
│   │   ├── telemetry/           # Data visualization
│   │   ├── heatingPlatform/     # HP system components
│   │   ├── faults/              # Fault tracking
│   │   ├── auditTrail/          # Audit logging
│   │   ├── settings/            # Settings management
│   │   ├── tes/, tgs/, ess/     # System-specific components
│   │   └── ...                  # Additional feature components
│   │
│   ├── hooks/                   # Custom React hooks (25+)
│   ├── services/                # API service layer (17 services)
│   ├── providers/               # Custom providers
│   ├── constants/               # Application constants
│   ├── utils/                   # Utility functions
│   ├── helpers/                 # Helper functions
│   └── i18n/                    # Internationalization
│       ├── config.js            # i18next configuration
│       └── locales/             # Translation files
│           ├── en.json          # English translations
│           └── fr.json          # French translations
│
├── docs/                        # Documentation
│   ├── README.md                # This file
│   ├── ARCHITECTURE.md          # System architecture
│   ├── COMPONENTS.md            # Component documentation
│   ├── API_SERVICES.md          # API services reference
│   ├── HOOKS_REFERENCE.md       # Custom hooks documentation
│   ├── STATE_MANAGEMENT.md      # Redux and Context guide
│   ├── DEVELOPMENT.md           # Development guidelines
│   └── DEPLOYMENT.md            # Deployment guide
│
└── components/                  # Shared components (legacy structure)
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to the backend API server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new_claude
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file in the root directory
REACT_APP_BASE_URL=<your-api-base-url>
REACT_APP_AMAZON_S3_URL=<your-s3-url>
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

## User Roles and Permissions

The application supports 16 distinct user roles:

### Administrative Roles
- **Administrator** - Full system access
- **Sub_Admin** - Administrative access with limitations
- **Manager** - Management-level access

### System Control Roles
- **ESS_Employee** - ESS system control
- **TGS_Employee** - TGS system control
- **TES_Employee** - TES system control
- **HP_Employee** - Heating Platform control
- **ATE_Employee** - ATE system control

### Guest Roles (Read-Only)
- **ESS_Guest** - ESS monitoring only
- **TGS_Guest** - TGS monitoring only
- **TES_Guest** - TES monitoring only
- **HP_Guest** - HP monitoring only
- **ATE_Guest** - ATE monitoring only

### Special Roles
- **Winter_Disk** - Special access with 15-minute auto-logout
- **Night_Shift** - Night shift operations
- **Day_Shift** - Day shift operations

## Main Features

### Global Overview
Dashboard providing real-time status of all connected systems with key metrics and alerts.

### Master Control
Centralized control interface for managing all system devices:
- Device activation/deactivation
- Program scheduling
- Zone management
- Temperature control
- SSR (Solid State Relay) management

### Telemetry
Real-time data visualization with:
- Historical data charts
- Live data graphs
- Configurable time ranges
- Multi-system comparison

### System Views (ESS/TGS/TES)
Dedicated views for each system type with:
- System-specific controls
- Real-time status monitoring
- Configuration management

### Heating Platform
Specialized interface for heating system management with zone control and temperature monitoring.

### Settings
Comprehensive settings management:
- User preferences
- Admin configurations
- System parameters
- Notification settings
- Display options
- Language selection

### Audit Trail
Complete logging of all user actions and system events with:
- Searchable history
- Filterable by user, action type, and date
- Export capabilities

### Fault Management
Real-time fault tracking and management:
- Active fault monitoring
- Historical fault log
- Fault acknowledgment
- Alert notifications

## Authentication

The application uses Bearer token authentication:
- Tokens are stored in localStorage
- Automatic token injection via Axios interceptors
- Auto-redirect on 401 (unauthorized) responses
- Session timeout for Winter_Disk role (15 minutes)

## Internationalization

The application supports English and French:
- Automatic language detection based on browser settings
- Manual language selection in settings
- All UI text and messages are translated
- Number and date formatting per locale

## Recent Improvements

The codebase has undergone significant refactoring to improve maintainability:
- Removed 787+ lines of dead code
- Created shared hooks to eliminate duplication
- Consolidated component logic
- Improved code organization

See `/docs/CODEBASE_IMPROVEMENTS_SUMMARY.md` for detailed metrics.

## Documentation

For detailed information, see:
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and data flow
- [Component Reference](docs/COMPONENTS.md) - All major components
- [API Services](docs/API_SERVICES.md) - Backend integration
- [Hooks Reference](docs/HOOKS_REFERENCE.md) - Custom hooks documentation
- [State Management](docs/STATE_MANAGEMENT.md) - Redux and Context guide
- [Development Guide](docs/DEVELOPMENT.md) - Development setup and guidelines
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment and configuration

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions, contact the development team or create an issue in the repository.

## License

[Your License Here]
