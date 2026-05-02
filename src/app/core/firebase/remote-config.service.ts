import { Injectable } from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getBoolean,
  getString,
} from '@angular/fire/remote-config';
import { REMOTE_CONFIG_DEFAULTS } from '../constants/remote-config-keys';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  constructor(private rc: RemoteConfig) {
    this.rc.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 60 * 1000,
    };

    this.rc.defaultConfig = {
      ...REMOTE_CONFIG_DEFAULTS,
    };
  }

  async init() {
    try {
      await fetchAndActivate(this.rc);
    } catch (e) {
      return;
    }
  }

  getBooleanType(key: string): boolean {
    return getBoolean(this.rc, key);
  }

  getStringType(key: string): string {
    return getString(this.rc, key);
  }
}
