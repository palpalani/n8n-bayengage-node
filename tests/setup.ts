// Test setup file for vitest
import { vi } from 'vitest';

// Mock global fetch if not available
if (!global.fetch) {
  global.fetch = vi.fn();
}

// Mock crypto for webhook signature generation
if (!global.crypto) {
  global.crypto = {
    createHmac: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn(() => 'mock-signature'),
    })),
  } as any;
}

// Mock setTimeout for testing
global.setTimeout = vi.fn((fn: any) => {
  fn();
  return {} as any;
});
