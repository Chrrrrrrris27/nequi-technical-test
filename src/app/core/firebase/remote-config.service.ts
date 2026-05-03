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
  private initPromise: Promise<void> | null = null;
  private isInitialized = false;

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

    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized) {
      return Promise.resolve();
    }

    this.initPromise = this.performInit();
    return this.initPromise;
  }

  private async performInit() {
    try {
      await fetchAndActivate(this.rc);
      this.isInitialized = true;
    } catch (e) {
      this.initPromise = null;
      this.isInitialized = true;
    }
  }

  async getBooleanType(key: string): Promise<boolean> {
    await this.init();
    return getBoolean(this.rc, key);
  }

  async getStringType(key: string): Promise<string> {
    await this.init();
    return getString(this.rc, key);
  }
}
