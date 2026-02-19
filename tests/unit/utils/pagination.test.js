const { calculatePagination, formatPaginatedResponse } = require('../../../src/utils/pagination');

describe('Pagination Utils', () => {
  describe('calculatePagination', () => {
    it('should calculate correct offset for page 1', () => {
      const result = calculatePagination(1, 10);

      expect(result.offset).toBe(0);
      expect(result.limit).toBe(10);
    });

    it('should calculate correct offset for page 2', () => {
      const result = calculatePagination(2, 10);

      expect(result.offset).toBe(10);
      expect(result.limit).toBe(10);
    });

    it('should handle page 0 as page 1', () => {
      const result = calculatePagination(0, 10);

      expect(result.offset).toBe(0);
    });

    it('should cap limit at 100', () => {
      const result = calculatePagination(1, 500);

      expect(result.limit).toBe(100);
    });

    it('should handle minimum limit of 1', () => {
      const result = calculatePagination(1, 0);

      expect(result.limit).toBe(1);
    });

    it('should use defaults when no parameters provided', () => {
      const result = calculatePagination();

      expect(result.offset).toBe(0);
      expect(result.limit).toBe(10);
    });
  });

  describe('formatPaginatedResponse', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('should format response with correct pagination data', () => {
      const result = formatPaginatedResponse(mockData, 1, 10, 25);

      expect(result.data).toEqual(mockData);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasMore: true,
        hasPrevious: false
      });
    });

    it('should indicate no more pages on last page', () => {
      const result = formatPaginatedResponse(mockData, 3, 10, 25);

      expect(result.pagination.hasMore).toBe(false);
      expect(result.pagination.hasPrevious).toBe(true);
    });

    it('should handle single page correctly', () => {
      const result = formatPaginatedResponse(mockData, 1, 10, 3);

      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasMore).toBe(false);
      expect(result.pagination.hasPrevious).toBe(false);
    });
  });
});