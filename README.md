# Bank of CLI — Part 2: Frontend

**Revature Training | Full-Stack Development Project**

## Project Overview

Bank of CLI is a banking web application developed as part of the Revature training program. This second phase of the project focuses on transforming a command-line banking system into a modern, responsive Single Page Application (SPA) using Angular, TypeScript, HTML, and CSS.

The application provides an interactive banking interface where users can access account information, view balances, review transaction history, and perform simulated banking operations.

The frontend uses mock JSON data and a service layer to simulate backend interactions, preparing the application for future integration with a REST API and database.

## Features

- **User Authentication:** Login functionality with route protection and authentication handling.
- **Dashboard:** Centralized interface for accessing banking features and account information.
- **Account Overview:** Displays account balances, user information, and account summaries.
- **Financial Analytics:** Calculates total money in, money out, and net transaction activity.
- **Transaction Management:** Supports simulated deposits, withdrawals, and transfers.
- **Transaction History:** Displays previous banking transactions and their details.
- **Responsive Interface:** Custom HTML and CSS styling for different screen sizes.
- **Error Handling:** Provides user feedback for invalid operations and application errors.
- **Mock API Integration:** Simulates banking operations using local JSON data and Angular services.

## Technology Stack

Visual Studio Code • Angular 22 • TypeScript • HTML5 • CSS3 • Angular Material • RxJS • Node.js • npm • JSON • Git • GitHub • GitHub Actions • GitHub Pages

## Project Architecture

The application follows Angular's component-based architecture, separating the user interface, business logic, data models, and mock API functionality.

```text
frontend/
├── src/
│   └── app/
│       ├── components/
│       │   ├── account-overview/
│       │   ├── analytics/
│       │   ├── dashboard/
│       │   ├── error-message/
│       │   ├── history/
│       │   ├── home/
│       │   ├── login/
│       │   ├── navbar/
│       │   ├── not-found/
│       │   ├── spinner/
│       │   └── transaction/
│       ├── contracts/
│       ├── guards/
│       ├── mock/
│       └── service/
├── angular.json
└── package.json
```

### Architecture Overview

- **Components:** Manage the application's interface and user interactions.
- **Services:** Centralize banking operations, application state, and shared functionality.
- **Contracts:** Define TypeScript interfaces for accounts and transactions.
- **Mock API:** Simulates backend responses using local JSON datasets.
- **Guards:** Restrict access to protected application routes.
- **Routing:** Enables navigation between application views without full-page reloads.

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Angular CLI
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Paribesh101/bank-of-cli-frontend.git
```

### 2. Navigate to the Angular Project

```bash
cd bank-of-cli-frontend/frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

Open your browser and navigate to:

```text
http://localhost:4200/
```

### 5. Build for Production

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

## Deployment

The application is deployed using **GitHub Pages**, with automated builds and deployments configured through GitHub Actions.

**Live Application:**  
https://padmeaicaza.github.io/bank-of-cli-frontend/#/

## Future Improvements

- Integrate the frontend with a Spring Boot REST API.
- Replace mock JSON data with persistent database storage.
- Implement backend authentication and authorization.
- Expand financial analytics and reporting capabilities.
- Improve accessibility and mobile responsiveness.
- Add comprehensive unit and integration testing.

## Project Context

This project was developed for educational purposes during Revature training. Banking operations currently use simulated data and do not involve real financial transactions.

**Bank of CLI — Revature Training Project**
