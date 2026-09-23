/**
 * Strict Schema Validation Engine
 * Validates request bodies, queries, and params against strict rules (type, length, format, enums, disallowed unknown keys)
 * Rejects invalid requests with HTTP 400 Bad Request
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,25}$/;
const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validate a single value against a field specification
 */
function validateField(fieldName, value, spec) {
  const errors = [];

  // Check required
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    if (spec.required) {
      errors.push(`'${fieldName}' is required.`);
    }
    return errors;
  }

  // Type check
  if (spec.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`'${fieldName}' must be a string, received ${typeof value}.`);
      return errors;
    }
    const val = spec.trim !== false ? value.trim() : value;

    if (spec.minLength !== undefined && val.length < spec.minLength) {
      errors.push(`'${fieldName}' must be at least ${spec.minLength} characters long.`);
    }
    if (spec.maxLength !== undefined && val.length > spec.maxLength) {
      errors.push(`'${fieldName}' cannot exceed ${spec.maxLength} characters.`);
    }

    // Format checks
    if (spec.format === 'email' && !EMAIL_REGEX.test(val)) {
      errors.push(`'${fieldName}' must be a valid email address.`);
    }
    if (spec.format === 'phone' && val.length > 0 && !PHONE_REGEX.test(val)) {
      errors.push(`'${fieldName}' must be a valid phone number.`);
    }
    if (spec.format === 'url' && val.length > 0 && !URL_REGEX.test(val)) {
      errors.push(`'${fieldName}' must be a valid HTTP or HTTPS URL.`);
    }
    if (spec.format === 'slug' && !SLUG_REGEX.test(val)) {
      errors.push(`'${fieldName}' must be a valid URL slug (lowercase alphanumeric and hyphens).`);
    }
    if (spec.pattern && !spec.pattern.test(val)) {
      errors.push(`'${fieldName}' format is invalid.`);
    }
    if (spec.enum && !spec.enum.includes(val)) {
      errors.push(`'${fieldName}' must be one of: [${spec.enum.join(', ')}].`);
    }
  } else if (spec.type === 'number' || spec.type === 'integer') {
    const num = Number(value);
    if (isNaN(num) || (spec.type === 'integer' && !Number.isInteger(num))) {
      errors.push(`'${fieldName}' must be a valid ${spec.type}, received '${value}'.`);
      return errors;
    }
    if (spec.min !== undefined && num < spec.min) {
      errors.push(`'${fieldName}' must be at least ${spec.min}.`);
    }
    if (spec.max !== undefined && num > spec.max) {
      errors.push(`'${fieldName}' cannot exceed ${spec.max}.`);
    }
  } else if (spec.type === 'boolean') {
    if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      errors.push(`'${fieldName}' must be a boolean.`);
    }
  } else if (spec.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`'${fieldName}' must be an array.`);
      return errors;
    }
    if (spec.minItems !== undefined && value.length < spec.minItems) {
      errors.push(`'${fieldName}' must contain at least ${spec.minItems} items.`);
    }
    if (spec.maxItems !== undefined && value.length > spec.maxItems) {
      errors.push(`'${fieldName}' cannot contain more than ${spec.maxItems} items.`);
    }
  }

  return errors;
}

/**
 * Validate an entire object against a schema definition
 */
function validateObject(data, schema) {
  const errors = [];
  const safeData = data || {};

  if (typeof safeData !== 'object' || Array.isArray(safeData)) {
    return [`Request payload must be a JSON object.`];
  }

  // Check for disallowed/unknown fields
  if (schema._disallowUnknown !== false) {
    const allowedKeys = Object.keys(schema).filter(k => !k.startsWith('_'));
    const providedKeys = Object.keys(safeData);
    for (const key of providedKeys) {
      if (!allowedKeys.includes(key)) {
        errors.push(`Unrecognized field '${key}' is not allowed.`);
      }
    }
  }

  // Validate declared fields
  for (const [fieldName, spec] of Object.entries(schema)) {
    if (fieldName.startsWith('_')) continue;
    const value = safeData[fieldName];
    const fieldErrors = validateField(fieldName, value, spec);
    errors.push(...fieldErrors);
  }

  return errors;
}

/**
 * Express middleware factory for validating req.body
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = validateObject(req.body, schema);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    next();
  };
}

/**
 * Express middleware factory for validating req.params
 */
function validateParams(schema) {
  return (req, res, next) => {
    const errors = validateObject(req.params, schema);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Invalid route parameter',
        details: errors
      });
    }
    next();
  };
}

/**
 * Express middleware factory for validating req.query
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const errors = validateObject(req.query, schema);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Invalid query parameter',
        details: errors
      });
    }
    next();
  };
}

// Common parameter schemas
const idParamSchema = {
  id: { type: 'integer', required: true, min: 1 }
};

const slugOrIdParamSchema = {
  slugOrId: { type: 'string', required: true, minLength: 1, maxLength: 120 }
};

module.exports = {
  validateBody,
  validateParams,
  validateQuery,
  validateObject,
  idParamSchema,
  slugOrIdParamSchema
};
