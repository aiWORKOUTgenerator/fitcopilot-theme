/**
 * FullCalendar Plugin Registry
 * 
 * Centralized registry for managing FullCalendar plugins with advanced optimization features
 * Implements view-based loading, preloading strategies, and performance monitoring
 */

export interface PluginDefinition {
  name: string;
  views: string[];
  priority: number;
  size: number; // Estimated size in KB
  loader: () => Promise<any>;
  dependencies?: string[];
}

export interface PluginLoadStats {
  pluginName: string;
  loadTime: number;
  cacheHit: boolean;
  size: number;
  timestamp: number;
}

export interface RegistryStats {
  totalPlugins: number;
  loadedPlugins: number;
  cachedPlugins: number;
  totalLoadTime: number;
  totalSize: number;
  cacheHitRate: number;
}

/**
 * Plugin cache with TTL support
 */
class PluginCache {
  private cache = new Map<string, { plugin: any; timestamp: number; size: number }>();
  private readonly TTL = 30 * 60 * 1000; // 30 minutes

  set(name: string, plugin: any, size: number): void {
    this.cache.set(name, {
      plugin,
      timestamp: Date.now(),
      size
    });
  }

  get(name: string): any | null {
    const entry = this.cache.get(name);
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(name);
      return null;
    }

    return entry.plugin;
  }

  has(name: string): boolean {
    return this.get(name) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { count: number; totalSize: number } {
    let totalSize = 0;
    let count = 0;

    for (const [, entry] of this.cache) {
      if (Date.now() - entry.timestamp <= this.TTL) {
        totalSize += entry.size;
        count++;
      }
    }

    return { count, totalSize };
  }
}

/**
 * FullCalendar Plugin Registry
 */
export class FullCalendarPluginRegistry {
  private plugins = new Map<string, PluginDefinition>();
  private cache = new PluginCache();
  private loadStats: PluginLoadStats[] = [];
  private preloadPromises = new Map<string, Promise<any>>();

  constructor() {
    this.registerDefaultPlugins();
  }

  /**
   * Register default FullCalendar plugins
   */
  private registerDefaultPlugins(): void {
    // Core interaction plugin (always needed)
    this.register({
      name: 'interaction',
      views: ['*'], // Required for all views
      priority: 100,
      size: 45, // KB
      loader: () => import(
        /* webpackChunkName: "fullcalendar-interaction" */
        '@fullcalendar/interaction'
      )
    });

    // Day grid plugin (month view)
    this.register({
      name: 'daygrid',
      views: ['dayGridMonth', 'dayGridWeek'],
      priority: 90,
      size: 75, // KB
      loader: () => import(
        /* webpackChunkName: "fullcalendar-daygrid" */
        '@fullcalendar/daygrid'
      )
    });

    // Time grid plugin (week/day views)
    this.register({
      name: 'timegrid',
      views: ['timeGridWeek', 'timeGridDay'],
      priority: 80,
      size: 85, // KB
      loader: () => import(
        /* webpackChunkName: "fullcalendar-timegrid" */
        '@fullcalendar/timegrid'
      )
    });

    // List plugin (list views)
    this.register({
      name: 'list',
      views: ['listWeek', 'listMonth', 'listDay'],
      priority: 70,
      size: 35, // KB
      loader: () => import(
        /* webpackChunkName: "fullcalendar-list" */
        '@fullcalendar/list'
      )
    });

    // Note: Resource plugins can be added later if needed
    // this.register({
    //   name: 'resource-common',
    //   views: ['resourceTimeGridWeek', 'resourceDayGridMonth'],
    //   priority: 60,
    //   size: 120, // KB
    //   loader: () => import('@fullcalendar/resource-common'),
    //   dependencies: ['interaction']
    // });
  }

  /**
   * Register a plugin
   */
  register(plugin: PluginDefinition): void {
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Load plugins for a specific view
   */
  async loadPluginsForView(view: string): Promise<{
    plugins: any[];
    stats: PluginLoadStats[];
    totalSize: number;
    totalLoadTime: number;
  }> {
    const startTime = performance.now();
    const requiredPlugins = this.getPluginsForView(view);
    const loadedPlugins: any[] = [];
    const loadStats: PluginLoadStats[] = [];
    let totalSize = 0;

    // Sort by priority (higher priority loads first)
    requiredPlugins.sort((a, b) => b.priority - a.priority);

    // Load plugins in parallel where possible
    const loadPromises = requiredPlugins.map(async (pluginDef) => {
      const pluginStartTime = performance.now();
      let plugin: any;
      let cacheHit = false;

      // Check cache first
      if (this.cache.has(pluginDef.name)) {
        plugin = this.cache.get(pluginDef.name);
        cacheHit = true;
      } else {
        // Load plugin
        const module = await pluginDef.loader();
        plugin = module.default || module;
        this.cache.set(pluginDef.name, plugin, pluginDef.size);
      }

      const loadTime = performance.now() - pluginStartTime;
      
      const stats: PluginLoadStats = {
        pluginName: pluginDef.name,
        loadTime,
        cacheHit,
        size: pluginDef.size,
        timestamp: Date.now()
      };

      loadStats.push(stats);
      totalSize += pluginDef.size;

      return plugin;
    });

    // Wait for all plugins to load
    const plugins = await Promise.all(loadPromises);
    loadedPlugins.push(...plugins);

    const totalLoadTime = performance.now() - startTime;

    // Store stats
    this.loadStats.push(...loadStats);

    logger.info(`✅ Loaded ${plugins.length} FullCalendar plugins for ${view} in ${totalLoadTime.toFixed(2)}ms`);
    logger.info(`📊 Total size: ${totalSize}KB, Cache hits: ${loadStats.filter(s => s.cacheHit).length}/${loadStats.length}`);

    return {
      plugins: loadedPlugins,
      stats: loadStats,
      totalSize,
      totalLoadTime
    };
  }

  /**
   * Get plugins required for a specific view
   */
  private getPluginsForView(view: string): PluginDefinition[] {
    const required: PluginDefinition[] = [];

    for (const [, plugin] of this.plugins) {
      if (plugin.views.includes('*') || plugin.views.includes(view)) {
        required.push(plugin);
      }
    }

    return required;
  }

  /**
   * Preload plugins for common views
   */
  async preloadCommonViews(views: string[] = ['dayGridMonth', 'timeGridWeek']): Promise<void> {
    logger.info(`🔄 Preloading plugins for views: ${views.join(', ')}`);

    const preloadPromises = views.map(async (view) => {
      if (this.preloadPromises.has(view)) {
        return this.preloadPromises.get(view);
      }

      const promise = this.loadPluginsForView(view).catch(error => {
        logger.warn(`⚠️ Failed to preload plugins for ${view}:`, error);
        return null;
      });

      this.preloadPromises.set(view, promise);
      return promise;
    });

    await Promise.allSettled(preloadPromises);
    logger.info(`✅ Preloading completed for ${views.length} views`);
  }

  /**
   * Get cached plugins for a view (synchronous)
   */
  getCachedPluginsForView(view: string): any[] | null {
    const requiredPlugins = this.getPluginsForView(view);
    const cachedPlugins: any[] = [];

    for (const pluginDef of requiredPlugins) {
      const cached = this.cache.get(pluginDef.name);
      if (!cached) {
        return null; // Not all plugins are cached
      }
      cachedPlugins.push(cached);
    }

    return cachedPlugins;
  }

  /**
   * Get registry statistics
   */
  getStats(): RegistryStats {
    const cacheStats = this.cache.getStats();
    const totalLoadTime = this.loadStats.reduce((sum, stat) => sum + stat.loadTime, 0);
    const cacheHits = this.loadStats.filter(stat => stat.cacheHit).length;

    return {
      totalPlugins: this.plugins.size,
      loadedPlugins: this.loadStats.length,
      cachedPlugins: cacheStats.count,
      totalLoadTime,
      totalSize: cacheStats.totalSize,
      cacheHitRate: this.loadStats.length > 0 ? (cacheHits / this.loadStats.length) * 100 : 0
    };
  }

  /**
   * Clear all caches and stats
   */
  reset(): void {
    this.cache.clear();
    this.loadStats = [];
    this.preloadPromises.clear();
    logger.info('🧹 FullCalendar plugin registry reset');
  }

  /**
   * Get estimated size for a view
   */
  getEstimatedSizeForView(view: string): number {
    const requiredPlugins = this.getPluginsForView(view);
    return requiredPlugins.reduce((total, plugin) => total + plugin.size, 0);
  }

  /**
   * Get load performance report
   */
  getPerformanceReport(): {
    averageLoadTime: number;
    cacheHitRate: number;
    totalPluginsLoaded: number;
    slowestPlugin: PluginLoadStats | null;
    fastestPlugin: PluginLoadStats | null;
    } {
    if (this.loadStats.length === 0) {
      return {
        averageLoadTime: 0,
        cacheHitRate: 0,
        totalPluginsLoaded: 0,
        slowestPlugin: null,
        fastestPlugin: null
      };
    }

    const nonCachedStats = this.loadStats.filter(stat => !stat.cacheHit);
    const averageLoadTime = nonCachedStats.length > 0 
      ? nonCachedStats.reduce((sum, stat) => sum + stat.loadTime, 0) / nonCachedStats.length
      : 0;

    const cacheHits = this.loadStats.filter(stat => stat.cacheHit).length;
    const cacheHitRate = (cacheHits / this.loadStats.length) * 100;

    const slowestPlugin = nonCachedStats.reduce((slowest, current) => 
      current.loadTime > (slowest?.loadTime || 0) ? current : slowest, null as PluginLoadStats | null);

    const fastestPlugin = nonCachedStats.reduce((fastest, current) => 
      current.loadTime < (fastest?.loadTime || Infinity) ? current : fastest, null as PluginLoadStats | null);

    return {
      averageLoadTime,
      cacheHitRate,
      totalPluginsLoaded: this.loadStats.length,
      slowestPlugin,
      fastestPlugin
    };
  }
}

// Global registry instance
export const pluginRegistry = new FullCalendarPluginRegistry(); 