import {IAppConfig} from './iapp.config';
import {AppConfig} from './app.config';

export const AppConfigDev: IAppConfig = {
  ...AppConfig,
  useActiveDirectory: false,
  endpoints: { // Replaced with dev values in non production deployments
    dynamicServiceBroker: 'http://10.248.11.20:8080/DynamicServiceBroker/webapi/',
    sessionManager: 'http://10.248.11.20:8080/SecurityManager/AuthenticationManager/webapi/',
    uploadUrl: 'http://10.248.11.20:8080/AdministrationServices/Services/upload',
    reportGenerator: 'http://10.248.11.20:8080/reportGenerator-service/webapi/report/generateReportInBytes'
  },
  paths: {
    'reports': '/var/2innovateit/reports_src/'
  }
};
