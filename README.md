This is a quick demo that manages Session Records in real time to a network of operators.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Java 17 or higher
- Node.js and npm
- An IDE that supports Maven (e.g., IntelliJ IDEA, Eclipse)

### Backend Setup

1. **Importing the Maven Project**:
    - Import the backend Maven project into your preferred IDE.

2. **Configuration**:
    - Navigate to the following path:
      ```
      /demo-backend/src/main/resources/application.properties
      ```
    - Modify the database configurations according to your environment:
      ```properties
      spring.datasource.username=YOUR_DATABASE_USERNAME
      spring.datasource.password=YOUR_DATABASE_PASSWORD
      ```
    - Replace `YOUR_DATABASE_USERNAME` and `YOUR_DATABASE_PASSWORD` with your specific database credentials.

3. **Running the Application**:
    - Once the above setup is complete, hit the run button in your IDE to start the backend server.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd demo-frontend

2. Install the required npm packages.
   If you haven't done this before:
   ```bash
   npm install

3. Start the frontend application:
   ```bash
   npm start

4. The application should now be running on http://localhost:3000
---

This project was created by **Thu Trang Dong**.


