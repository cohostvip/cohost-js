import { describe, it, expect, beforeEach } from 'vitest';
import { createStorage, MemoryStorage } from '../storage';

describe('Storage', () => {
  describe('MemoryStorage', () => {
    let storage: MemoryStorage;

    beforeEach(() => {
      storage = new MemoryStorage();
    });

    it('should store and retrieve access token', () => {
      storage.setAccessToken('test-access-token');
      expect(storage.getAccessToken()).toBe('test-access-token');
    });

    it('should return null for unset access token', () => {
      expect(storage.getAccessToken()).toBeNull();
    });

    it('should store and retrieve refresh token', () => {
      storage.setRefreshToken('test-refresh-token');
      expect(storage.getRefreshToken()).toBe('test-refresh-token');
    });

    it('should return null for unset refresh token', () => {
      expect(storage.getRefreshToken()).toBeNull();
    });

    it('should store and retrieve token expiry', () => {
      const expiry = Math.floor(Date.now() / 1000) + 3600;
      storage.setTokenExpiry(expiry);
      expect(storage.getTokenExpiry()).toBe(expiry);
    });

    it('should return null for unset token expiry', () => {
      expect(storage.getTokenExpiry()).toBeNull();
    });

    it('should store and retrieve user object', () => {
      const user = { uid: '123', email: 'test@example.com', emailVerified: true };
      storage.setUser(user);
      expect(storage.getUser()).toEqual(user);
    });

    it('should return null for unset user', () => {
      expect(storage.getUser()).toBeNull();
    });

    it('should clear all stored values', () => {
      storage.setAccessToken('test-access-token');
      storage.setRefreshToken('test-refresh-token');
      storage.setTokenExpiry(12345);
      storage.setUser({ uid: '123' });

      storage.clear();

      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(storage.getTokenExpiry()).toBeNull();
      expect(storage.getUser()).toBeNull();
    });
  });

  describe('createStorage', () => {
    it('should create MemoryStorage for "memory" type', () => {
      const storage = createStorage('memory');
      expect(storage).toBeInstanceOf(MemoryStorage);
    });

    it('should fall back to MemoryStorage when not in browser', () => {
      // In Node.js test environment, localStorage is not available
      // so it should fall back to MemoryStorage
      const storage = createStorage('localStorage');
      expect(storage).toBeInstanceOf(MemoryStorage);
    });
  });
});
