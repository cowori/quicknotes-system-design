# QuickNotes Data Model

## Overview

QuickNotes allows users to create notes and organize them using tags. The database contains four entities:

- Users
- Notes
- Tags
- Note_Tags

This design supports note ownership, note categorization and efficient searching by tags.

---

# Entity Definitions

## Users

Stores application users.

| Column | Type | Description |
|----------|----------|----------|
| id | INTEGER | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Encrypted password |
| created_at | TIMESTAMP | Account creation date |

Primary Key:

```sql
id
```

---

## Notes

Stores notes belonging to users.

| Column | Type | Description |
|----------|----------|----------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Owner of the note |
| title | VARCHAR(100) | Note title |
| body | TEXT | Note content |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

Primary Key:

```sql
id
```

Foreign Key:

```sql
user_id → users.id
```

---

## Tags

Stores available tags.

| Column | Type | Description |
|----------|----------|----------|
| id | INTEGER | Primary key |
| name | VARCHAR(50) | Tag name |

Primary Key:

```sql
id
```

---

## Note_Tags

Join table linking notes and tags.

| Column | Type | Description |
|----------|----------|----------|
| note_id | INTEGER | References notes |
| tag_id | INTEGER | References tags |

Primary Key:

```sql
(note_id, tag_id)
```

Foreign Keys:

```sql
note_id → notes.id
tag_id → tags.id
```

---

# Relationships

## Users → Notes

Relationship:

```text
One-to-Many
```

Reason:

One user can create many notes.

Each note belongs to exactly one user.

---

## Notes → Tags

Relationship:

```text
Many-to-Many
```

Reason:

A note can have many tags.

A tag can be attached to many notes.

Because relational databases cannot represent many-to-many relationships directly, a join table is required.

That join table is:

```text
note_tags
```

---

# CREATE TABLE Statements

## Users

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

## Notes

```sql
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);
```

## Tags

```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
```

## Note_Tags

```sql
CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (
        note_id,
        tag_id
    ),

    FOREIGN KEY (note_id)
        REFERENCES notes(id),

    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
);
```

---

# Example SQL Queries

## 1. Get all notes belonging to one user

```sql
SELECT
    id,
    title,
    body
FROM notes
WHERE user_id = 1;
```

---

## 2. Get all tags attached to a note

```sql
SELECT
    t.id,
    t.name
FROM tags t
JOIN note_tags nt
    ON nt.tag_id = t.id
WHERE nt.note_id = 10;
```

This query uses a JOIN.

---

## 3. Count notes created by each user

```sql
SELECT
    u.username,
    COUNT(n.id) AS note_count
FROM users u
LEFT JOIN notes n
    ON n.user_id = u.id
GROUP BY
    u.username;
```

---

# Recommended Index

```sql
CREATE INDEX idx_notes_user_id
ON notes(user_id);
```

Reason:

Many queries need to find all notes owned by a specific user.

Indexing `user_id` improves filtering and JOIN performance. Indexes on frequently joined foreign-key columns are a common optimization because they speed lookups and joins. 【1-1d3ad0】

---

# SQL vs NoSQL Decision

I would choose SQL for QuickNotes.

Reasons:

- Users and notes have clear relationships.
- Tags create a many-to-many relationship that is naturally modelled with a join table. Many-to-many relationships are typically implemented through a separate join table containing foreign keys to both sides. 【2-6fc4c4】【3-cb0f38】
- Foreign keys provide data integrity.
- SQL supports joins efficiently.
- The schema is structured and predictable.

NoSQL could work for very large-scale document storage, but the relationship between users, notes and tags makes SQL the better choice for this system.