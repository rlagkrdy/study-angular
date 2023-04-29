import { InjectionToken } from "@angular/core";
import { B4sGroupValueAccessor } from "./types";
import { Environment } from "../../../../../../src/core/environment";
import { NotifierAdapter } from "../../../../../../src/core/notifier/notifier-adapter";

export const ENVIRONMENT = new InjectionToken<Environment>("environment");

export const NOTIFIER = new InjectionToken<NotifierAdapter>("notifier");

export const B4S_GROUP_VALUE_ACCESSOR =
  new InjectionToken<B4sGroupValueAccessor>("nik-group-value-accessor");
