import { EngineDataJSON } from './types';
import { EngineError } from '../errors';

export class Validator {
    static isValidId (id: string) {
        return /^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id);
    }

    static isValidData (data: EngineDataJSON) {
        return typeof data.id === 'string'
            && this.isValidId(data.id)
            && data.nodes instanceof Map;
    }

    static validate (id: string, data: EngineDataJSON) {
        if (!this.isValidData(data)) {
            return { success: false, error: EngineError.InvalidEngineData };
        }

        if (id !== data.id) {
            return { success: false, error: EngineError.EngineDataIDsUnequal };
        }

        return { success: true, error: undefined };
    }
}