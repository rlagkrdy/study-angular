import {
  Environment,
  AppType,
  Configuration,
} from '../../../../src/core/environment';

export const environment: Environment = {
  production: false,
  appType: AppType.Web,
  configuration: Configuration.Stage,
  baseUrl: 'http://localhost:4200',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};
