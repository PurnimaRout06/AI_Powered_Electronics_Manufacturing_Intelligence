// Wraps an async Express route handler so thrown errors/rejected promises
// are forwarded to next(err) instead of crashing the process.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
