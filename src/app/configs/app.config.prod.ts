import {IAppConfig} from './iapp.config';
import {AppConfig} from './app.config';

export const AppConfigProd: IAppConfig = {
  ...AppConfig,
  useActiveDirectory: true,
  endpoints: { // Replaced with dev values in non production deployments
    dynamicServiceBroker: 'http://10.242.99.20:8080/DynamicServiceBroker/webapi/',
    sessionManager: 'http://10.242.99.20:8080/SecurityManager/AuthenticationManager/webapi/',
    uploadUrl: 'http://10.242.99.20:8080/AdministrationServices/Services/upload',
    reportGenerator: 'http://10.242.99.20:8080/reportGenerator-service/webapi/report/generateReportInBytes'
  },
  paths: {
    'reports': '/opt/2innovateit/JASPER/'
  },
  userName: {
    regex: new RegExp(/^[0-9a-zA-Z]$/),
    maxLength: 9
  }
};
