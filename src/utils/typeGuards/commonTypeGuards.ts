/**
 * Common Type Guards
 * 
 * Utility functions for checking types at runtime.
 * These are helpful for safely working with data of unknown types.
 */

/**
 * Type guard for non-null and non-undefined values
 * @param value The value to check
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

/**
 * Type guard for checking if a value is an object
 * @param value The value to check
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for checking if a value is an array
 * @param value The value to check
 */
export function isArray<T>(value: unknown): value is Array<T> {
    return Array.isArray(value);
}

/**
 * Type guard for checking if a value is a string
 * @param value The value to check
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Type guard for checking if a value is a number
 * @param value The value to check
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard for checking if a value is a boolean
 * @param value The value to check
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

/**
 * Type guard for checking if a value is a function
 * @param value The value to check
 */
export function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
}

/**
 * Type guard for checking if a value is a date
 * @param value The value to check
 */
export function isDate(value: unknown): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard for checking if a value is a valid ISO date string
 * @param value The value to check
 */
export function isISODateString(value: unknown): value is string {
    if (!isString(value)) return false;
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    return isoDateRegex.test(value) && !isNaN(Date.parse(value));
}

/**
 * Type guard for checking if a value has a specific property
 * @param value The object to check
 * @param prop The property name to check for
 */
export function hasProperty<K extends string>(
    value: unknown,
    prop: K
): value is { [P in K]: unknown } {
    return isObject(value) && prop in value;
}

/**
 * Type guard for checking if a value is a record with string keys and values of a specific type
 * @param value The value to check
 * @param valueGuard A type guard function for the record values
 */
export function isRecord<T>(
    value: unknown,
    valueGuard: (v: unknown) => v is T
): value is Record<string, T> {
    if (!isObject(value)) return false;
    return Object.values(value).every(valueGuard);
}

/**
 * Type guard for checking if a value is an array of a specific type
 * @param value The value to check
 * @param itemGuard A type guard function for the array items
 */
export function isArrayOf<T>(
    value: unknown,
    itemGuard: (v: unknown) => v is T
): value is T[] {
    if (!isArray(value)) return false;
    return value.every(itemGuard);
}

/**
 * Generic type guard for union types
 * @param value The value to check
 * @param guards Array of type guard functions for each possible type
 */
export function isOneOf<T>(
    value: unknown,
    guards: Array<(v: unknown) => v is T>
): value is T {
    return guards.some(guard => guard(value));
}

/**
 * Type guard for checking if a value is a literal string
 * @param value The value to check
 * @param literals Array of possible string literals
 */
export function isLiteralString<T extends string>(
    value: unknown,
    literals: T[]
): value is T {
    return isString(value) && literals.includes(value as T);
}

/**
 * Type guard for checking if a value has all required properties with the correct types
 * @param value The value to check
 * @param schema An object with type guard functions for each required property
 */
export function matchesSchema<T extends Record<string, unknown>>(
    value: unknown,
    schema: { [K in keyof T]: (v: unknown) => boolean }
): value is T {
    if (!isObject(value)) return false;

    return Object.entries(schema).every(([key, validator]) => {
        return key in value && validator(value[key]);
    });
} 