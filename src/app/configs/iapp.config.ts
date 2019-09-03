export interface IAppConfig {
  sessionLocalStorageKey: string;
  useActiveDirectory: boolean;
  version: string;
  routes: any;
  endpoints: any;
  timeBetweenBatchVerification: number;
  batchVerificationTimeout: number;
  sessionTime: number;
  timeBeforeClose: number;
  paths: any;
  reports: any;
  dateFormat: string;
  longTimeFormat: string;
  timeFormat: string;
  isoDateFormat: string;
  dateAndTimeFormat: string;
  dateAndTimeFormatTwo: string;
  userName: any;
}
