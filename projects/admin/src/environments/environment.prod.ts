import {
  Environment,
  AppType,
  Configuration,
} from "../../../../src/core/environment";

export const environment: Environment = {
  production: true,
  appType: AppType.Admin,
  configuration: Configuration.Prod,
  baseUrl: "http://localhost:4200",
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  },
};
