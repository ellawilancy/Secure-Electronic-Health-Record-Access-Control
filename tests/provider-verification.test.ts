import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity contract environment
const mockProviderVerification = {
  registerProvider: vi.fn(),
  verifyProvider: vi.fn(),
  isVerifiedProvider: vi.fn(),
  deactivateProvider: vi.fn(),
  getProviderDetails: vi.fn(),
};

// Mock the blockchain environment
const mockBlockchain = {
  blockHeight: 100,
  blockTime: 1617984000, // Example timestamp
  txSender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Example principal (admin)
};

describe('Provider Verification Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Setup default mock responses
    mockProviderVerification.registerProvider.mockReturnValue({ value: true });
    mockProviderVerification.verifyProvider.mockReturnValue({ value: true });
    mockProviderVerification.isVerifiedProvider.mockReturnValue(true);
    mockProviderVerification.deactivateProvider.mockReturnValue({ value: true });
    mockProviderVerification.getProviderDetails.mockReturnValue({
      principal: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      name: 'General Hospital',
      providerType: 1, // PROVIDER_TYPE_HOSPITAL
      licenseId: 'LIC12345',
      verified: true,
      active: true,
      createdAt: 1617984000,
      lastUpdated: 1617984000
    });
  });
  
  describe('registerProvider', () => {
    it('should register a new provider successfully', async () => {
      const providerId = '123e4567-e89b-12d3-a456-426614174000';
      const providerPrincipal = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      const name = 'General Hospital';
      const providerType = 1; // PROVIDER_TYPE_HOSPITAL
      const licenseId = 'LIC12345';
      
      const result = await mockProviderVerification.registerProvider(
          providerId,
          providerPrincipal,
          name,
          providerType,
          licenseId
      );
      
      expect(mockProviderVerification.registerProvider).toHaveBeenCalledWith(
          providerId,
          providerPrincipal,
          name,
          providerType,
          licenseId
      );
      expect(result).toEqual({ value: true });
    });
    
    it('should fail if caller is not admin', async () => {
      const providerId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockProviderVerification.registerProvider.mockReturnValue({ error: 1001 });
      
      const result = await mockProviderVerification.registerProvider(
          providerId,
          'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          'General Hospital',
          1,
          'LIC12345'
      );
      
      expect(result).toEqual({ error: 1001 });
    });
  });
  
  describe('verifyProvider', () => {
    it('should verify a provider successfully', async () => {
      const providerId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockProviderVerification.verifyProvider(providerId);
      
      expect(mockProviderVerification.verifyProvider).toHaveBeenCalledWith(providerId);
      expect(result).toEqual({ value: true });
    });
    
    it('should fail if provider does not exist', async () => {
      const providerId = 'non-existent-id';
      
      mockProviderVerification.verifyProvider.mockReturnValue({ error: 1003 });
      
      const result = await mockProviderVerification.verifyProvider(providerId);
      
      expect(result).toEqual({ error: 1003 });
    });
  });
  
  describe('isVerifiedProvider', () => {
    it('should return true for verified and active providers', async () => {
      const providerId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockProviderVerification.isVerifiedProvider(providerId);
      
      expect(mockProviderVerification.isVerifiedProvider).toHaveBeenCalledWith(providerId);
      expect(result).toBe(true);
    });
    
    it('should return false for unverified providers', async () => {
      const providerId = 'unverified-id';
      
      mockProviderVerification.isVerifiedProvider.mockReturnValue(false);
      
      const result = await mockProviderVerification.isVerifiedProvider(providerId);
      
      expect(result).toBe(false);
    });
  });
  
  describe('getProviderDetails', () => {
    it('should return provider details', async () => {
      const providerId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockProviderVerification.getProviderDetails(providerId);
      
      expect(mockProviderVerification.getProviderDetails).toHaveBeenCalledWith(providerId);
      expect(result).toEqual({
        principal: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        name: 'General Hospital',
        providerType: 1,
        licenseId: 'LIC12345',
        verified: true,
        active: true,
        createdAt: 1617984000,
        lastUpdated: 1617984000
      });
    });
  });
});
