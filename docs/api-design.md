# QuickNotes API Design

## Overview

This document describes the REST API that should be built for the QuickNotes platform. The API allows users to create, read, update, delete, search and tag notes.

Base URL:

```text
/api
```

---

# Endpoints

| Method | Path | Description | Success Status |
|----------|---------|----------------|----------------|
| GET | /notes | List notes | 200 OK |
| GET | /notes/{id} | Get one note | 200 OK |
| POST | /notes | Create a note | 201 Created |
| PUT | /notes/{id} | Update a note | 200 OK |
| DELETE | /notes/{id} | Delete a note | 204 No Content |
| GET | /notes?tag=work | Search notes by tag | 200 OK |
| GET | /users/{id}/notes | List notes owned by a user | 200 OK |

---

# GET /notes

Returns a list of notes.

## Request

```http
GET /api/notes
```

## Success Response

Status:

```http
200 OK
```

Body:

```json
[
  {
    "id": 1,
    "title": "Project meeting",
    "body": "Review sprint tasks.",
    "userId": 12,
    "createdAt": "2026-10-15T09:00:00Z"
  }
]
```

---

# GET /notes/{id}

Returns one note.

## Request

```http
GET /api/notes/1
```

## Success Response

Status:

```http
200 OK
```

Body:

```json
{
  "id": 1,
  "title": "Project meeting",
  "body": "Review sprint tasks.",
  "userId": 12,
  "createdAt": "2026-10-15T09:00:00Z"
}
```

---

# POST /notes

Creates a new note.

## Request

Status Expected:

```http
201 Created
```

Request Body:

```json
{
  "title": "Architecture notes",
  "body": "Prepare scaling plan."
}
```

## Success Response

```json
{
  "id": 101,
  "title": "Architecture notes",
  "body": "Prepare scaling plan.",
  "userId": 12,
  "createdAt": "2026-10-15T10:30:00Z"
}
```

---

# PUT /notes/{id}

Updates an existing note.

## Request

```http
PUT /api/notes/101
```

Body:

```json
{
  "title": "Updated architecture notes",
  "body": "Prepare scaling plan and diagrams."
}
```

## Success Response

Status:

```http
200 OK
```

Body:

```json
{
  "id": 101,
  "title": "Updated architecture notes",
  "body": "Prepare scaling plan and diagrams."
}
```

---

# DELETE /notes/{id}

Deletes a note.

## Request

```http
DELETE /api/notes/101
```

## Success Response

Status:

```http
204 No Content
```

No response body is returned.

---

# GET /notes?tag=work

Returns notes matching a tag.

## Request

```http
GET /api/notes?tag=work
```

## Success Response

Status:

```http
200 OK
```

Body:

```json
[
  {
    "id": 15,
    "title": "Quarterly report",
    "body": "Review financial summary.",
    "tag": "work"
  }
]
```

---

# GET /users/{id}/notes

Returns notes belonging to one user.

## Request

```http
GET /api/users/12/notes
```

## Success Response

Status:

```http
200 OK
```

Body:

```json
[
  {
    "id": 1,
    "title": "Project meeting",
    "body": "Review sprint tasks."
  }
]
```

---

# Error Status Codes

## 400 Bad Request

Returned when the request is invalid.

Example:

```json
{
  "error": "Title is required."
}
```

---

## 401 Unauthorized

Returned when the user is not authenticated.

Example:

```json
{
  "error": "Authentication required."
}
```

---

## 403 Forbidden

Returned when the user does not have permission.

Example:

```json
{
  "error": "Access denied."
}
```

---

## 404 Not Found

Returned when a note cannot be found.

Example:

```json
{
  "error": "Note not found."
}
```

---

## 500 Internal Server Error

Returned when an unexpected server error occurs.

Example:

```json
{
  "error": "An unexpected error occurred."
}
```