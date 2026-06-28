import { describe, it, expect } from 'vitest';
import { validateRow } from './csv-validator';
import { SourceSchema } from '@/features/source-management/types/schema';

describe('CSV Validator', () => {
  const basicSchema: SourceSchema = {
    columns: [
      {
        name: 'date',
        type: 'date',
        required: true,
      },
      {
        name: 'region',
        type: 'enum',
        required: true,
        allowed_values: ['Abidjan', 'Bouaké', 'Daloa'],
      },
      {
        name: 'montant',
        type: 'integer',
        required: true,
        min: 0,
        max: 10000,
      },
      {
        name: 'client_id',
        type: 'string',
        required: true,
        pattern: '^CLI-\\d{6}$',
      },
      {
        name: 'optional_field',
        type: 'string',
        required: false,
      },
    ],
  };

  describe('Required field validation', () => {
    it('should return error for missing required field', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        // client_id is missing
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'client_id',
        message: 'Required value missing',
      });
    });

    it('should return error for empty required field', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: '', // empty string
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].columnName).toBe('client_id');
    });

    it('should accept missing optional field', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
        // optional_field is missing
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(0);
    });
  });

  describe('Date validation', () => {
    it('should accept valid date', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid date', () => {
      const row = {
        date: 'invalid-date',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'date',
        message: 'Invalid date',
      });
    });
  });

  describe('Integer validation', () => {
    it('should accept valid integer', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(0);
    });

    it('should reject non-integer', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000.5',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'montant',
        message: 'Must be an integer',
      });
    });

    it('should reject integer below minimum', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '-1',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'montant',
        message: 'Value must be at least 0',
      });
    });

    it('should reject integer above maximum', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '15000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'montant',
        message: 'Value must be at most 10000',
      });
    });
  });

  describe('Enum validation', () => {
    it('should accept valid enum value', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid enum value', () => {
      const row = {
        date: '2024-01-15',
        region: 'Paris', // Not in allowed_values
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'region',
        message: 'Value must be one of the allowed options',
      });
    });
  });

  describe('Pattern validation', () => {
    it('should accept value matching pattern', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'CLI-123456',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(0);
    });

    it('should reject value not matching pattern', () => {
      const row = {
        date: '2024-01-15',
        region: 'Abidjan',
        montant: '5000',
        client_id: 'INVALID-ID',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        rowNumber: 1,
        columnName: 'client_id',
        message: 'Value does not match required pattern',
      });
    });
  });

  describe('Multiple errors in single row', () => {
    it('should return all validation errors', () => {
      const row = {
        date: 'invalid-date',
        region: 'Paris',
        montant: 'not-a-number',
        client_id: 'INVALID',
      };

      const errors = validateRow(row, 1, basicSchema);
      
      expect(errors.length).toBeGreaterThan(1);
      expect(errors.some(e => e.columnName === 'date')).toBe(true);
      expect(errors.some(e => e.columnName === 'region')).toBe(true);
      expect(errors.some(e => e.columnName === 'montant')).toBe(true);
      expect(errors.some(e => e.columnName === 'client_id')).toBe(true);
    });
  });

  describe('Orange CI Sales schema validation', () => {
    const orangeSchema: SourceSchema = {
      columns: [
        {
          name: 'date_vente',
          type: 'date',
          required: true,
        },
        {
          name: 'agence_code',
          type: 'string',
          required: true,
          pattern: '^AG-[A-Z]{3}-\\d{4}$',
        },
        {
          name: 'region',
          type: 'enum',
          required: true,
          allowed_values: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa', 'San-Pédro', 'Korhogo', 'Man', 'Gagnoa'],
        },
        {
          name: 'type_forfait',
          type: 'enum',
          required: true,
          allowed_values: ['prepaid', 'postpaid', 'data_only', 'fiber'],
        },
        {
          name: 'quantite',
          type: 'integer',
          required: true,
          min: 1,
          max: 10000,
        },
        {
          name: 'montant_fcfa',
          type: 'integer',
          required: true,
          min: 0,
        },
      ],
    };

    it('should validate a correct Orange CI sales row', () => {
      const row = {
        date_vente: '2024-01-15',
        agence_code: 'AG-ABI-1234',
        region: 'Abidjan',
        type_forfait: 'prepaid',
        quantite: '100',
        montant_fcfa: '50000',
      };

      const errors = validateRow(row, 1, orangeSchema);
      
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid agence_code format', () => {
      const row = {
        date_vente: '2024-01-15',
        agence_code: 'INVALID-CODE',
        region: 'Abidjan',
        type_forfait: 'prepaid',
        quantite: '100',
        montant_fcfa: '50000',
      };

      const errors = validateRow(row, 1, orangeSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].columnName).toBe('agence_code');
    });

    it('should reject quantity below minimum', () => {
      const row = {
        date_vente: '2024-01-15',
        agence_code: 'AG-ABI-1234',
        region: 'Abidjan',
        type_forfait: 'prepaid',
        quantite: '0',
        montant_fcfa: '50000',
      };

      const errors = validateRow(row, 1, orangeSchema);
      
      expect(errors).toHaveLength(1);
      expect(errors[0].columnName).toBe('quantite');
    });
  });
});
