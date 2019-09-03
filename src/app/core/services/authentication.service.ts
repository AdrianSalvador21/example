import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppConfig} from '../../configs/app.config';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.sessionManager + 'auth/login',
      {
        userName: username.toUpperCase(),
        domainApplication: 'CONSOLE',
        applicationID: 'UNIVERSAL_CLIENT',
        aditionalData: {},
        password: password,
        role: '',
        userAgent: 'Consola - sitio alterno'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  logout() {
    const sessionData = JSON.parse(localStorage.getItem(AppConfig.sessionLocalStorageKey));
    if (sessionData !== null) {
      const sessionID = sessionData.sessionID;
      localStorage.removeItem(AppConfig.sessionLocalStorageKey);
      return this.http.get<any>(AppConfig.endpoints.sessionManager + 'session/close',
        {
          headers: {
            'sessionID': sessionID
          }
        }).subscribe(res => {
      });
    }
  }

  getRoles(userName: string, sessionID?: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_ROLES_BY_USER_APP/JSON/CUSTOM/0/ADAPTOR',
      {
        userId: userName.toUpperCase(),
        app: 'UNIVERSAL_CLIENT'
      },
      {
        headers: {
          sessionID: !!sessionID ? sessionID : ''
        }
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  getProfileGroupsByUser(userName: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_PROFILE_GROUPS_BY_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        applicationId: 'UNIVERSAL_CLIENT',
        domainApplication: 'CONSOLE'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  addProfileGroupToUser(userName: string, profileGroup: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/ADD_PROFILE_GROUP_TO_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        applicationId: 'UNIVERSAL_CLIENT',
        domainApplication: 'CONSOLE',
        profileGroup: profileGroup
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  removeProfileGroupToUser(userName: string, profileGroup: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/REMOVE_PROFILE_GROUP_TO_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        applicationId: 'UNIVERSAL_CLIENT',
        domainApplication: 'CONSOLE',
        profileGroup: profileGroup
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  deleteProfileGroup(profileGroupId: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/DEL_PROF_GROUP/JSON/CUSTOM/0/ADAPTOR',
      {
        profileGroupId: profileGroupId,
        applicationId: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  enableProfileGroup(profileGroupId: string, enableStatus: number) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/ENABLE_PROF_GROUP/JSON/CUSTOM/0/ADAPTOR',
      {
        profileGroupId: profileGroupId,
        domainApplication: 'CONSOLE',
        applicationId: 'UNIVERSAL_CLIENT',
        enableStatus: enableStatus
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  setMainProfileGroupToUser(userName: string, profileGroup: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/SET_MAIN_PROFILE_GROUP_TO_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        applicationId: 'UNIVERSAL_CLIENT',
        domainApplication: 'CONSOLE',
        profileGroup: profileGroup
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  getUser(username: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/VERIFY_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: username.toUpperCase(),
        domainApp: 'CONSOLE'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  updateUserRoles(username: string, roles: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/UPDATE_USERPROFILES/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: username.toUpperCase(),
        domainApp: 'CONSOLE',
        roles: roles
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  getMenuByUser(username: string) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_MENU_BY_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: username.toUpperCase(),
        domainApplication: 'CONSOLE',
        applicationID: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (!!response && response.errorCode === '0' && response.data && response.data[0] && response.data[0].length !== 0) {
          (<Array<any>>response.data[0]).sort((a, b) => {
            return (<number>a.ORDINAL) - (<number>b.ORDINAL);
          });
        }
        return response;
      }));
  }

  getFullMenu() {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_MENU_BY_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: '',
        domainApplication: 'CONSOLE',
        applicationID: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (!!response && response.errorCode === '0' && response.data && response.data[0] && response.data[0].length !== 0) {
          response.data[0].forEach((menuItem) => {
            menuItem.ALLOWED_PROFILES = menuItem.ALLOWED_PROFILES.split(';');
          });
          (<Array<any>>response.data[0]).sort((a, b) => {
            return (<number>a.ORDINAL) - (<number>b.ORDINAL);
          });
        }
        return response;
      }));
  }

  getHomeUrl(userName) {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_HOME_URL/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        domainApplication: 'CONSOLE',
        applicationId: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        return response;
      }));
  }

  inupProfileGroups(profileGroupsData) {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/INUP_ROLE_PROFILE/JSON/CUSTOM/0/ADAPTOR',
      {
        profileGroups: profileGroupsData,
        domainApplication: 'CONSOLE',
        applicationID: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        return response;
      }));
  }

  getProfileGroups() {
    localStorage.setItem('inProcess', 'inProcess');
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/GET_PROFILE_GROUPS/JSON/CUSTOM/0/ADAPTOR',
      {
        applicationId: 'UNIVERSAL_CLIENT'
      })
      .pipe(map(response => {
        localStorage.removeItem('inProcess');
        if (!!response.data[0] && response.data[0].length !== 0) {
          response.data[0].forEach(profileGroup => {
            profileGroup.DATAMENU = (<string>profileGroup.DATAMENU).split(';');
            profileGroup.DATAPROFILE = (<string>profileGroup.DATAPROFILE).split(';');
          });
        }
        return response;
      }));
  }

  setProfileGroupsToUser(userName: string, profileGroups: string, mainProfileGroup: string) {
    return this.http.post<any>(AppConfig.endpoints.dynamicServiceBroker + 'SABADELL/UI/SET_PROF_GROUP_TO_USER/JSON/CUSTOM/0/ADAPTOR',
      {
        userName: userName.toUpperCase(),
        domainApplication: 'CONSOLE',
        applicationId: 'UNIVERSAL_CLIENT',
        profileGroups: profileGroups,
        mainProfileGroup: mainProfileGroup
      })
      .pipe(map(response => {
        return response;
      }));
  }
}
