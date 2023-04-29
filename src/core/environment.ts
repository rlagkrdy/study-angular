export enum AppType {
  App = "app",
  Web = "web",
  Admin = "admin",
}

export enum Configuration {
  Dev,
  Stage,
  Prod,
}

export interface Environment {
  production: boolean;
  cordova?: boolean;
  appType: AppType;
  configuration: Configuration;
  baseUrl?: string;
  firebase?: {
    apiKey: string;
    authDomain: string;
    databaseURL?: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  algolia?: {
    appId: string;
    searchKey: string;
  };
  publicData?: {
    neighborhoodForecastKey?: string;
  };
  bigquery?: {
    user: string;
  };
}
