/**
 * Async handler wrapper to eliminate try-catch boilerplate
 * 
 * Technical decision: Instead of wrapping every async function in try-catch,
 * this wrapper automatically catches rejected promises and forwards them
 * to Express error handling middleware. This keeps controller code clean.
 * 
 * Usage: asyncHandler(async (req, res) => { ... })
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;