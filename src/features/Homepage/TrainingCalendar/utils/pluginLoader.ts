/**
 * FullCalendar Dynamic Plugin Loader
 * 
 * Enhanced plugin loader that uses the FullCalendarPluginRegistry
 * for optimized plugin management and caching
 */

import { pluginRegistry, type PluginLoadStats } from './pluginRegistry';

export interface PluginLoadResult {
  plugins: any[];
  view: string;
  loadTime: number;
  stats: PluginLoadStats[];
  totalSize: number;
}

/**
 * Load plugins dynamically based on calendar view using the registry
 * 
 * @param view - The calendar view that needs plugins
 * @returns Promise resolving to loaded plugins with enhanced stats
 */
export const loadCalendarPlugins = async (view: string): Promise<PluginLoadResult> => {
  try {
    const result = await pluginRegistry.loadPluginsForView(view);
    
    return {
      plugins: result.plugins,
      view,
      loadTime: result.totalLoadTime,
      stats: result.stats,
      totalSize: result.totalSize
    };

  } catch (error) {
    console.error('❌ Failed to load FullCalendar plugins:', error);
    throw new Error(`Failed to load plugins for view: ${view}`);
  }
};

/**
 * Get cached plugins for a view if available (synchronous)
 * 
 * @param view - The calendar view
 * @returns Cached plugins or null if not available
 */
export const getCachedPlugins = (view: string): any[] | null => {
  return pluginRegistry.getCachedPluginsForView(view);
};

/**
 * Preload plugins for common views
 * 
 * @param views - Array of view names to preload
 */
export const preloadPlugins = async (views: string[] = ['dayGridMonth', 'timeGridWeek']): Promise<void> => {
  await pluginRegistry.preloadCommonViews(views);
};

/**
 * Clear plugin cache and reset registry
 */
export const clearPluginCache = (): void => {
  pluginRegistry.reset();
};

/**
 * Get plugin loading statistics
 */
export const getPluginStats = () => {
  return pluginRegistry.getStats();
};

/**
 * Get performance report for plugin loading
 */
export const getPerformanceReport = () => {
  return pluginRegistry.getPerformanceReport();
};

/**
 * Get estimated bundle size for a view
 */
export const getEstimatedSizeForView = (view: string): number => {
  return pluginRegistry.getEstimatedSizeForView(view);
};

/**
 * Get cache statistics (legacy compatibility)
 */
export const getCacheStats = () => {
  const stats = pluginRegistry.getStats();
  return {
    cachedPlugins: stats.cachedPlugins,
    cacheSize: stats.cachedPlugins,
    memoryUsage: stats.totalSize // Size in KB
  };
}; 