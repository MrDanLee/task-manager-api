/**
 * In-memory data store
 * 
 * Production note: This uses in-memory storage for demonstration.
 * In a real application, this would be replaced with:
 * - PostgreSQL/MySQL for relational data
 * - MongoDB for document-oriented data
 * - Redis for caching layer
 * 
 * The repository pattern used in this app makes swapping
 * data sources trivial without changing business logic.
 */

const db = {
  users: [],
  tasks: [],
  counters: {
    userId: 1,
    taskId: 1
  }
};

module.exports = db;