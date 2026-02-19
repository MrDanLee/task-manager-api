/**
 * Pagination utilities
 * 
 * Design considerations:
 * - Limit capped at 100 to prevent database overload
 * - Page numbers are 1-indexed for better UX (most users expect page 1, not 0)
 * - Returns hasMore/hasPrevious flags for frontend pagination UI
 */

const calculatePagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  return { offset, limit: limitNum };
};

const formatPaginatedResponse = (data, page, limit, total) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const totalPages = Math.ceil(total / limitNum);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasMore: pageNum < totalPages,
      hasPrevious: pageNum > 1
    }
  };
};

module.exports = {
  calculatePagination,
  formatPaginatedResponse
};