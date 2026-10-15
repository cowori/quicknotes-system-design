# QuickNotes System Design

## Description

QuickNotes System Design is a capstone project that demonstrates how a simple browser-based notes application could evolve into a scalable online service supporting one million users. The project contains a working API client built with HTML, CSS and JavaScript, together with API, database and architecture design documents that describe how the production system should be implemented.

---

## Project Structure

```text
quicknotes-system-design/
│
├── index.html
├── style.css
├── api.js
├── README.md
│
└── docs/
    ├── api-design.md
    ├── data-model.md
    └── architecture.md
```

---

## Features

### API Client

- Load notes using GET requests
- Create notes using POST requests
- Delete notes using DELETE requests
- Loading state handling
- Success state handling
- Error state handling
- Empty state handling
- Input validation
- Safe rendering using `textContent`

### System Design Documents

- REST API design
- Database schema and relationships
- Architecture design for 1 million users
- Capacity planning
- Scaling considerations
- Trade-off analysis

---

## Running the API Client Locally

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Start Live Server on `index.html`.
4. Click **Load Notes** to retrieve data from the JSONPlaceholder API.
5. Use the form to create notes.
6. Use the Delete button to remove notes.

---

## Design Documents

### API Design

See:

```text
docs/api-design.md
```

This document defines the REST endpoints, request and response formats, status codes and error handling.

### Data Model

See:

```text
docs/data-model.md
```

This document explains the database entities, relationships, SQL schema and indexing strategy.

### Architecture Design

See:

```text
docs/architecture.md
```

This document describes the system architecture, capacity estimates, scaling strategy, request flows and trade-offs.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- JSONPlaceholder API
- Markdown
- SQL Design

---

## What I Learned

### 1. REST API Design

I learned how REST APIs use HTTP methods such as GET, POST, PUT and DELETE together with status codes to perform CRUD operations.

### 2. Database Modelling

I learned how to model one-to-many and many-to-many relationships using primary keys, foreign keys and join tables.

### 3. System Architecture

I learned how components such as load balancers, caches, databases, read replicas, queues and workers help a large-scale system remain fast and reliable.

### 4. Capacity Planning

I learned how to estimate reads per second, writes per second and storage growth for a growing application.

### 5. Front-End and API Integration

I learned how a browser application communicates with APIs using asynchronous JavaScript and fetch requests.

---

## Author

Mark Owori
