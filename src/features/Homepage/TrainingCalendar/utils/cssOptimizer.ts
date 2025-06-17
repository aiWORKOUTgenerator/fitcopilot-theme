/**
 * FullCalendar CSS Optimizer
 * 
 * Dynamically loads only the CSS needed for specific calendar views
 * Reduces initial CSS bundle size by loading styles on-demand
 */

export interface CSSLoadResult {
  view: string;
  stylesLoaded: string[];
  loadTime: number;
  totalSize: number;
}

/**
 * CSS cache to avoid re-loading styles
 */
const cssCache = new Set<string>();

/**
 * Load CSS for specific FullCalendar view
 * 
 * @param view - Calendar view name
 * @returns Promise resolving to load result
 */
export const loadCalendarCSS = async (view: string): Promise<CSSLoadResult> => {
  const startTime = performance.now();
  const stylesLoaded: string[] = [];
  let totalSize = 0;

  try {
    // Core FullCalendar styles (always needed)
    if (!cssCache.has('core')) {
      await loadStylesheet('fullcalendar-core', '/wp-content/themes/fitcopilot/node_modules/@fullcalendar/core/main.css');
      cssCache.add('core');
      stylesLoaded.push('core');
      totalSize += 45; // Estimated KB
    }

    // View-specific styles
    switch (view) {
      case 'dayGridMonth':
      case 'dayGridWeek':
        if (!cssCache.has('daygrid')) {
          await loadStylesheet('fullcalendar-daygrid', '/wp-content/themes/fitcopilot/node_modules/@fullcalendar/daygrid/main.css');
          cssCache.add('daygrid');
          stylesLoaded.push('daygrid');
          totalSize += 25; // Estimated KB
        }
        break;

      case 'timeGridWeek':
      case 'timeGridDay':
        if (!cssCache.has('timegrid')) {
          await loadStylesheet('fullcalendar-timegrid', '/wp-content/themes/fitcopilot/node_modules/@fullcalendar/timegrid/main.css');
          cssCache.add('timegrid');
          stylesLoaded.push('timegrid');
          totalSize += 30; // Estimated KB
        }
        break;

      case 'listWeek':
      case 'listMonth':
      case 'listDay':
        if (!cssCache.has('list')) {
          await loadStylesheet('fullcalendar-list', '/wp-content/themes/fitcopilot/node_modules/@fullcalendar/list/main.css');
          cssCache.add('list');
          stylesLoaded.push('list');
          totalSize += 15; // Estimated KB
        }
        break;
    }

    const loadTime = performance.now() - startTime;

    console.log(`✅ Loaded ${stylesLoaded.length} CSS files for ${view} in ${loadTime.toFixed(2)}ms`);

    return {
      view,
      stylesLoaded,
      loadTime,
      totalSize
    };

  } catch (error) {
    console.error('❌ Failed to load FullCalendar CSS:', error);
    throw new Error(`Failed to load CSS for view: ${view}`);
  }
};

/**
 * Load a stylesheet dynamically
 * 
 * @param id - Unique identifier for the stylesheet
 * @param href - URL to the stylesheet
 * @returns Promise that resolves when stylesheet is loaded
 */
const loadStylesheet = (id: string, href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if stylesheet is already loaded
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));

    document.head.appendChild(link);
  });
};

/**
 * Preload CSS for common views
 * 
 * @param views - Array of view names to preload
 */
export const preloadCalendarCSS = async (views: string[] = ['dayGridMonth', 'timeGridWeek']): Promise<void> => {
  console.log(`🔄 Preloading FullCalendar CSS for views: ${views.join(', ')}`);

  const preloadPromises = views.map(view => 
    loadCalendarCSS(view).catch(error => {
      console.warn(`⚠️ Failed to preload CSS for ${view}:`, error);
      return null;
    })
  );

  await Promise.allSettled(preloadPromises);
  console.log(`✅ CSS preloading completed for ${views.length} views`);
};

/**
 * Remove all dynamically loaded FullCalendar CSS
 */
export const clearCalendarCSS = (): void => {
  const stylesheets = ['fullcalendar-core', 'fullcalendar-daygrid', 'fullcalendar-timegrid', 'fullcalendar-list'];
  
  stylesheets.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  });

  cssCache.clear();
  console.log('🧹 FullCalendar CSS cleared');
};

/**
 * Get CSS loading statistics
 */
export const getCSSStats = () => {
  return {
    loadedStyles: Array.from(cssCache),
    totalLoaded: cssCache.size,
    estimatedSize: cssCache.size * 25 // Rough estimate in KB
  };
};

/**
 * Check if CSS is loaded for a specific view
 * 
 * @param view - Calendar view name
 * @returns Boolean indicating if CSS is loaded
 */
export const isCSSLoadedForView = (view: string): boolean => {
  // Core is always required
  if (!cssCache.has('core')) {
    return false;
  }

  // Check view-specific CSS
  switch (view) {
    case 'dayGridMonth':
    case 'dayGridWeek':
      return cssCache.has('daygrid');
    case 'timeGridWeek':
    case 'timeGridDay':
      return cssCache.has('timegrid');
    case 'listWeek':
    case 'listMonth':
    case 'listDay':
      return cssCache.has('list');
    default:
      return cssCache.has('daygrid'); // Default fallback
  }
}; 