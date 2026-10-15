# QuickNotes Architecture Design

# Functional Requirements

The system must allow users to:

- Create notes
- Read notes
- Update notes
- Delete notes
- Search notes
- Organize notes with tags
- Access notes from multiple devices
- View recently created notes

---

# Non-Functional Requirements

The system should:

- Support 1 million registered users
- Remain available if a server fails
- Scale horizontally as traffic grows
- Provide low-latency note retrieval
- Protect data integrity
- Handle traffic spikes
- Support backup and recovery
- Provide secure API access

---

# Assumptions

The assignment specifies 1 million users.

Additional assumptions:

- 10% daily active users
- 100,000 daily active users
- Each active user reads 20 notes per day
- Each active user creates 2 notes per day
- Average note size = 2 KB
- Each note contains metadata and tags

---

# Load Estimates

## Daily Reads

100,000 active users × 20 reads

= 2,000,000 reads/day

Reads per second:

2,000,000 ÷ 86,400

≈ 23 reads/second

Peak traffic (5×):

23 × 5

≈ 115 reads/second

---

## Daily Writes

100,000 active users × 2 writes

= 200,000 writes/day

Writes per second:

200,000 ÷ 86,400

≈ 2.3 writes/second

Peak traffic (5×):

2.3 × 5

≈ 12 writes/second

---

## Storage Per Year

Notes per year:

200,000 × 365

= 73,000,000 notes

Storage:

73,000,000 × 2 KB

= 146,000,000 KB

≈ 146 GB per year

---

# Read vs Write Analysis

QuickNotes is a read-heavy system.

Reads:

- Approximately 23 reads/second average
- Approximately 115 reads/second peak

Writes:

- Approximately 2.3 writes/second average
- Approximately 12 writes/second peak

Because reads significantly exceed writes, caching and read replicas provide significant performance benefits.

---

# Architecture Diagram

```text
                +-------------+
                |   Client    |
                +------+------+ 
                       |
                       v

                +-------------+
                |     DNS     |
                +------+------+
                       |
                       v

                +-------------+
                |     CDN     |
                +------+------+
                       |
                       v

                +-------------+
                | Load Balancer|
                +------+------+
                       |
        +--------------+--------------+
        |                             |
        v                             v

 +--------------+             +--------------+
 | App Server 1 |             | App Server 2 |
 +------+-------+             +------+-------+
        |                            |
        +------------+---------------+
                     |
                     v

              +-------------+
              |    Cache    |
              +------+------+
                     |
          +----------+----------+
          |                     |
          v                     v

    +------------+      +---------------+
    | Primary DB |----->| Read Replica  |
    +------+-----+      +---------------+
           |
           v

       +--------+
       | Queue  |
       +----+---+
            |
            v

      +-----------+
      | Worker(s) |
      +-----------+
```

---

# Component Explanations

## Client

Provides the user interface used to create, view, edit and delete notes.

## DNS

Directs users to the correct QuickNotes infrastructure.

## CDN

Serves static files closer to users to reduce latency.

## Load Balancer

Distributes requests across multiple application servers.

## App Servers

Run application logic, validation, authentication and API endpoints.

## Cache

Stores frequently requested note data to reduce database traffic.

## Primary Database

Stores users, notes, tags and note relationships.

## Read Replica

Handles read traffic without overloading the primary database.

## Queue

Stores asynchronous jobs so that long-running tasks do not block users.

## Workers

Process queued jobs in the background.

---

# GET /notes Request Flow

1. User requests notes.
2. Browser sends request to DNS.
3. DNS routes traffic to the CDN.
4. CDN forwards API traffic to the load balancer.
5. Load balancer selects an application server.
6. Application server checks the cache.
7. If notes exist in cache, cached data is returned.
8. If data is not cached, the application server reads from the read replica.
9. Results are stored in cache.
10. Notes are returned to the user.

---

# POST /notes Request Flow

1. User submits a new note.
2. Request reaches DNS.
3. DNS routes traffic to the load balancer.
4. Load balancer selects an application server.
5. Application server validates the request.
6. Application server writes the note to the primary database.
7. A background event may be placed in the queue.
8. The database confirms the write.
9. Success response is returned.
10. Cache entries related to affected note lists are refreshed or invalidated.

---

# Avoiding Single Points of Failure

A single point of failure is a component whose failure causes the entire system to stop working.

QuickNotes avoids single points of failure by:

- Running multiple application servers
- Using a load balancer
- Maintaining database replication
- Allowing failed servers to be replaced without downtime
- Storing cached data separately from application servers

If one application server fails, traffic can be routed to the remaining servers.

---

# Trade-Offs

## Trade-Off 1: Cache Freshness vs Performance

Caching improves performance and reduces database load.

However, users may occasionally receive slightly outdated note data.

---

## Trade-Off 2: Read Replicas vs Consistency

Read replicas improve scalability for read-heavy workloads.

However, replication delay means a recently created note may not immediately appear on a replica.

---

## Trade-Off 3: Queue Processing vs Simplicity

Background job processing improves responsiveness and scalability.

However, queues and workers introduce additional infrastructure and operational complexity.