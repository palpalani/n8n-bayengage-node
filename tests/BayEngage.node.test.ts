import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BayEngage } from '../nodes/BayEngage/BayEngage.node';

// Mock n8n-workflow
vi.mock('n8n-workflow', () => ({
  IExecuteFunctions: vi.fn(),
  INodeExecutionData: vi.fn(),
  INodeType: vi.fn(),
  INodeTypeDescription: vi.fn(),
  NodeConnectionType: {
    Main: 'main',
  },
  NodeOperationError: class extends Error {
    constructor(node: any, message: string) {
      super(message);
      this.name = 'NodeOperationError';
    }
  },
}));

describe('BayEngage Node', () => {
  let bayEngageNode: BayEngage;

  beforeEach(() => {
    bayEngageNode = new BayEngage();
  });

  describe('node description', () => {
    it('should have correct display name', () => {
      expect(bayEngageNode.description.displayName).toBe('BayEngage');
    });

    it('should have correct name', () => {
      expect(bayEngageNode.description.name).toBe('bayEngage');
    });

    it('should have correct group', () => {
      expect(bayEngageNode.description.group).toEqual(['transform']);
    });

    it('should have correct version', () => {
      expect(bayEngageNode.description.version).toBe(1);
    });

    it('should have required credentials', () => {
      expect(bayEngageNode.description.credentials).toHaveLength(1);
      expect(bayEngageNode.description.credentials[0].name).toBe('bayEngageApi');
      expect(bayEngageNode.description.credentials[0].required).toBe(true);
    });

    it('should have correct inputs and outputs', () => {
      expect(bayEngageNode.description.inputs).toEqual(['main']);
      expect(bayEngageNode.description.outputs).toEqual(['main']);
    });
  });

  describe('properties', () => {
    it('should have resource property', () => {
      const resourceProperty = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'resource'
      );
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty.type).toBe('options');
    });

    it('should have operation properties for each resource', () => {
      const resources = ['contact', 'list', 'campaign', 'template', 'event'];

      resources.forEach(resource => {
        const operationProperty = bayEngageNode.description.properties.find(
          (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes(resource)
        );
        expect(operationProperty).toBeDefined();
        expect(operationProperty.type).toBe('options');
      });
    });

    it('should have contact-specific fields', () => {
      const emailField = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'email'
      );
      expect(emailField).toBeDefined();
      expect(emailField.type).toBe('string');

      const firstNameField = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'firstName'
      );
      expect(firstNameField).toBeDefined();
      expect(firstNameField.type).toBe('string');
    });

    it('should have pagination fields for list operations', () => {
      const limitField = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'limit'
      );
      expect(limitField).toBeDefined();
      expect(limitField.type).toBe('number');

      const pageField = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'page'
      );
      expect(pageField).toBeDefined();
      expect(pageField.type).toBe('number');
    });
  });

  describe('contact operations', () => {
    it('should have create contact operation', () => {
      const contactOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('contact')
      );
      const createOption = contactOperations.options.find(
        (option: any) => option.value === 'create'
      );
      expect(createOption).toBeDefined();
      expect(createOption.name).toBe('Create');
    });

    it('should have get contact operation', () => {
      const contactOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('contact')
      );
      const getOption = contactOperations.options.find(
        (option: any) => option.value === 'get'
      );
      expect(getOption).toBeDefined();
      expect(getOption.name).toBe('Get');
    });

    it('should have list contacts operation', () => {
      const contactOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('contact')
      );
      const listOption = contactOperations.options.find(
        (option: any) => option.value === 'list'
      );
      expect(listOption).toBeDefined();
      expect(listOption.name).toBe('List');
    });

    it('should have upsert contact operation', () => {
      const contactOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('contact')
      );
      const upsertOption = contactOperations.options.find(
        (option: any) => option.value === 'upsert'
      );
      expect(upsertOption).toBeDefined();
      expect(upsertOption.name).toBe('Create or Update');
    });
  });

  describe('list operations', () => {
    it('should have create list operation', () => {
      const listOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('list')
      );
      const createOption = listOperations.options.find(
        (option: any) => option.value === 'create'
      );
      expect(createOption).toBeDefined();
      expect(createOption.name).toBe('Create');
    });

    it('should have add contact to list operation', () => {
      const listOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('list')
      );
      const addContactOption = listOperations.options.find(
        (option: any) => option.value === 'addContact'
      );
      expect(addContactOption).toBeDefined();
      expect(addContactOption.name).toBe('Add Contact');
    });
  });

  describe('campaign operations', () => {
    it('should have send campaign operation', () => {
      const campaignOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('campaign')
      );
      const sendOption = campaignOperations.options.find(
        (option: any) => option.value === 'send'
      );
      expect(sendOption).toBeDefined();
      expect(sendOption.name).toBe('Send');
    });

    it('should have get reports operation', () => {
      const campaignOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('campaign')
      );
      const reportsOption = campaignOperations.options.find(
        (option: any) => option.value === 'getReports'
      );
      expect(reportsOption).toBeDefined();
      expect(reportsOption.name).toBe('Get Reports');
    });
  });

  describe('template operations', () => {
    it('should have create template operation', () => {
      const templateOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('template')
      );
      const createOption = templateOperations.options.find(
        (option: any) => option.value === 'create'
      );
      expect(createOption).toBeDefined();
      expect(createOption.name).toBe('Create');
    });
  });

  describe('event operations', () => {
    it('should have track event operation', () => {
      const eventOperations = bayEngageNode.description.properties.find(
        (prop: any) => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('event')
      );
      const trackOption = eventOperations.options.find(
        (option: any) => option.value === 'track'
      );
      expect(trackOption).toBeDefined();
      expect(trackOption.name).toBe('Track');
    });
  });
});
