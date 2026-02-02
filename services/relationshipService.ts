
import { USE_MOCKS } from '../mocks';
import { relationshipService as RealRelationshipService } from './real/relationshipService';
import { relationshipService as MockRelationshipService } from './mocks/relationshipService';

export const relationshipService = USE_MOCKS ? MockRelationshipService : RealRelationshipService;
