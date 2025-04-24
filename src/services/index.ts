/**
 * Service layer index file
 * 
 * Exports all service interfaces and implementations
 * for use throughout the application.
 */

// Service interfaces
export * from './interfaces/wordpress';
export { wordPressService };

// Import service implementations
import wordPressServiceImpl from './implementations/WordPressService';

// Re-export the service implementation
const wordPressService = wordPressServiceImpl;

