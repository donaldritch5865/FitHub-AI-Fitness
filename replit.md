# Overview

This is a fitness web application called "BodyType Blueprint" that uses AI to classify body types (Ectomorph, Mesomorph, Endomorph) from uploaded photos and provides personalized workout recommendations. The application features a modern, responsive design with a React frontend, Express.js backend, and PostgreSQL database integration via Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **State Management**: React Context for authentication state, TanStack Query for server state management
- **Routing**: React Router for client-side navigation with protected routes
- **File Upload**: React Dropzone for drag-and-drop image uploads
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Development Server**: Custom Vite integration for hot module replacement in development
- **API Structure**: RESTful API with `/api` prefix for all endpoints
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware

## Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: User management with username/password authentication
- **Storage Interface**: Abstracted storage layer supporting both in-memory (development) and PostgreSQL (production)
- **Migrations**: Drizzle Kit for database schema management

## Authentication & Authorization
- **Strategy**: Custom JWT-like authentication with localStorage persistence
- **Protection**: Protected routes using React Router guards
- **Session Management**: Client-side session storage with context provider
- **User Management**: Username/password registration and login system

## External Dependencies
- **Database Hosting**: Neon Database (PostgreSQL serverless)
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Styling**: PostCSS with Autoprefixer for CSS processing
- **Development**: Replit-specific plugins for deployment and error handling
- **Build Tool**: ESBuild for production bundling
- **Image Processing**: Planned integration with AI/ML services for body type classification