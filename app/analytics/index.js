import * as models from '../models';
import {ipcRenderer} from 'electron';
import {isDevelopment} from '../common/constants';

let initialized = false;
export async function init (accountId) {
  const settings = await models.settings.getOrCreate();

  if (settings.disableAnalyticsTracking) {
    console.log(`[ga] Not initializing due to user settings`);
    return;
  }

  if (initialized) {
    return;
  }

  initialized = true;

  ipcRenderer.on('analytics-track-event', (_, args) => {
    trackEvent(...args);
  });

  if (window && !isDevelopment()) {
    window.addEventListener('error', e => {
      trackEvent('Error', 'Uncaught Error');
      console.error('Uncaught Error', e);
    });

    window.addEventListener('unhandledrejection', e => {
      trackEvent('Error', 'Uncaught Promise');
      console.error('Unhandled Promise', e);
    });
  }
}

export function trackEvent (...args) {
  // Do on next tick in case it fails or blocks
}

export function setAccountId (accountId) {
  // Do on next tick in case it fails or blocks
}
