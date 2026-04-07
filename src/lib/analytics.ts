/**
 * ValiSearch — Analytics Tracking
 * Prepares analytics hooks for PostHog or Plausible integration
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}

/**
 * Track an analytics event
 * In development: logs to console
 * In production: sends to analytics provider (when configured)
 */
export const track = (event: string, properties?: Record<string, unknown>): void => {
  if (import.meta.env.DEV) {
    console.info('[Analytics]', event, properties);
  }
  // TODO: Add PostHog.capture(event, properties) when ready
};

/**
 * Track page view
 */
export const trackPageView = (path: string): void => {
  track('page_viewed', { path });
};

/**
 * Predefined event tracking helpers
 */
export const analytics = {
  // Idea submission
  ideaSubmitted: (ideaLength: number) => 
    track('idea_submitted', { ideaLength }),

  // Analysis lifecycle
  analysisStarted: (ideaPreview: string) => 
    track('analysis_started', { ideaPreview: ideaPreview.slice(0, 50) }),
  
  analysisCompleted: (dataSource: 'ai' | 'mock', score: number) => 
    track('analysis_completed', { dataSource, score }),
  
  analysisFailed: (error: string) => 
    track('analysis_failed', { error: error.slice(0, 100) }),

  // Credit system
  creditDeducted: (remaining: number) => 
    track('credit_deducted', { remaining }),
  
  creditPurchased: (plan: string, amount: number) => 
    track('credit_purchased', { plan, amount }),

  // Upgrade/Payments
  upgradeClicked: (plan: 'pro' | 'premium') => 
    track('upgrade_clicked', { plan }),
  
  checkoutCompleted: (plan: string, price: number) => 
    track('checkout_completed', { plan, price }),

  // Dashboard interactions
  sectionViewed: (section: string) => 
    track('section_viewed', { section }),
  
  kanbanTaskMoved: (taskId: string, from: string, to: string) => 
    track('kanban_task_moved', { taskId, from, to }),

  // Export actions
  exportPdf: (sections: number) => 
    track('export_pdf', { sections }),
  
  exportMarkdown: () => 
    track('export_markdown'),

  // Builder handoff
  builderOpened: (builder: 'lovable' | 'bubble' | '10web') => 
    track('builder_opened', { builder }),

  // Auth events
  userSignedUp: (method: 'email' | 'oauth') => 
    track('user_signed_up', { method }),
  
  userSignedIn: (method: 'email' | 'oauth') => 
    track('user_signed_in', { method }),
  
  userSignedOut: () => 
    track('user_signed_out'),

  // Settings
  apiKeyConfigured: (provider: string) => 
    track('api_key_configured', { provider }),
  
  settingsChanged: (setting: string) => 
    track('settings_changed', { setting }),
} as const;
