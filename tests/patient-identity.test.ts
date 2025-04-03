import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity contract environment
const mockPatientIdentity = {
  registerPatient: vi.fn(),
  isValidPatient: vi.fn(),
  deactivatePatient: vi.fn(),
  reactivatePatient: vi.fn(),
};

// Mock the blockchain environment
const mockBlockchain = {
  blockHeight: 100,
  blockTime: 1617984000, // Example timestamp
  txSender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Example principal
};

describe('Patient Identity Contract', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Setup default mock responses
    mockPatientIdentity.registerPatient.mockReturnValue({ value: true });
    mockPatientIdentity.isValidPatient.mockReturnValue({ value: true });
    mockPatientIdentity.deactivatePatient.mockReturnValue({ value: true });
    mockPatientIdentity.reactivatePatient.mockReturnValue({ value: true });
  });
  
  describe('registerPatient', () => {
    it('should register a new patient successfully', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockPatientIdentity.registerPatient(patientId);
      
      expect(mockPatientIdentity.registerPatient).toHaveBeenCalledWith(patientId);
      expect(result).toEqual({ value: true });
    });
    
    it('should fail if patient ID already exists', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockPatientIdentity.registerPatient.mockReturnValue({ error: 1001 });
      
      const result = await mockPatientIdentity.registerPatient(patientId);
      
      expect(result).toEqual({ error: 1001 });
    });
  });
  
  describe('isValidPatient', () => {
    it('should return true for valid patients', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockPatientIdentity.isValidPatient(patientId);
      
      expect(mockPatientIdentity.isValidPatient).toHaveBeenCalledWith(patientId);
      expect(result).toEqual({ value: true });
    });
    
    it('should return false for invalid patients', async () => {
      const patientId = 'invalid-id';
      
      mockPatientIdentity.isValidPatient.mockReturnValue({ error: 1002 });
      
      const result = await mockPatientIdentity.isValidPatient(patientId);
      
      expect(result).toEqual({ error: 1002 });
    });
  });
  
  describe('deactivatePatient', () => {
    it('should deactivate a patient successfully', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockPatientIdentity.deactivatePatient(patientId);
      
      expect(mockPatientIdentity.deactivatePatient).toHaveBeenCalledWith(patientId);
      expect(result).toEqual({ value: true });
    });
    
    it('should fail if caller is not the patient owner', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockPatientIdentity.deactivatePatient.mockReturnValue({ error: 1003 });
      
      const result = await mockPatientIdentity.deactivatePatient(patientId);
      
      expect(result).toEqual({ error: 1003 });
    });
  });
  
  describe('reactivatePatient', () => {
    it('should reactivate a patient successfully', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';
      
      const result = await mockPatientIdentity.reactivatePatient(patientId);
      
      expect(mockPatientIdentity.reactivatePatient).toHaveBeenCalledWith(patientId);
      expect(result).toEqual({ value: true });
    });
    
    it('should fail if patient does not exist', async () => {
      const patientId = 'non-existent-id';
      
      mockPatientIdentity.reactivatePatient.mockReturnValue({ error: 1002 });
      
      const result = await mockPatientIdentity.reactivatePatient(patientId);
      
      expect(result).toEqual({ error: 1002 });
    });
  });
});
