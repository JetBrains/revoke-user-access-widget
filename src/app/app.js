import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import MultiTable from '@jetbrains/ring-ui/components/table/multitable';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import '@jetbrains/ring-ui/components/form/form.scss';

import UserSelect from './UserSelect';
import UserProperties from './UserProperties';
import GroupsTable from './GroupsTable';
import TeamsTable from './TeamsTable';
import ProjectRolesTable from './ProjectRolesTable';
import LoginsTable from './LoginsTable';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import styles from './app.css';

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      loadingUser: false,
      groupSelection: new Selection(),
      teamSelection: new Selection(),
      rolesSelection: new Selection(),
      loginSelection: new Selection(),
      hubURL: ''
    };
    this.loadHubService();
  }

  loadHubService() {
    this.props.dashboardApi.fetchHub('api/rest/services/0-0-0-0-0', {
      query: {
        fields: 'homeUrl'
      }
    }).then(service => {
      let hubURL = service.homeUrl;
      hubURL = hubURL && hubURL.replace(/\/$/, '');
      this.setState({hubURL});
    });
  }

  reloadUser = async user => {
    this.setState({
      selectedUser: user,
      loadingUser: true,
      groupSelection: new Selection(),
      teamSelection: new Selection(),
      rolesSelection: new Selection(),
      loginSelection: new Selection()
    });
    const detailedUser = await this.props.dashboardApi.fetchHub(
      `api/rest/users/${user.id}`, {
        query: {
          fields: 'id,login,name,banned,profile(avatar,email(email,verified)),' +
          'groups(id,name),' +
          'teams(id,project(id,name)),' +
          'projectRoles(id,project(id,name),role(id,name)),' +
          'details(id,authModuleName,lastAccessTime,login,email,userid,commonName,nameId,fullName)'
        }
      });
    (detailedUser.projectRoles || []).forEach(projectRole => {
      projectRole.key = projectRole.id;
    });
    this.setState({
      selectedUser: detailedUser,
      loadingUser: false
    });
  };

  onGroupSelect = selection => this.setState({groupSelection: selection});

  onTeamSelect = selection => this.setState({teamSelection: selection});

  onProjectRoleSelect = selection => this.setState({rolesSelection: selection});

  onLoginSelect = selection => this.setState({loginSelection: selection});

  onCancel = () => {
    this.setState({selectedUser: null});
  };

  async removeFromGroup(group, user) {
    return this.props.dashboardApi.fetchHub(
      `api/rest/usergroups/${group.id}/users/${user.id}`, {
        method: 'DELETE'
      });
  }

  async removeFromTeam(team, user) {
    return this.props.dashboardApi.fetchHub(
      `api/rest/projectteams/${team.id}/ownUsers/${user.id}`, {
        method: 'DELETE'
      });
  }

  async revokeProjectRole(user, projectRole) {
    return this.props.dashboardApi.fetchHub(
      `api/rest/users/${user.id}/projectroles/${projectRole.id}`, {
        method: 'DELETE'
      });
  }

  async removeLogin(user, login) {
    return this.props.dashboardApi.fetchHub(
      `api/rest/users/${user.id}/userdetails/${login.id}`, {
        method: 'DELETE'
      });
  }

  onRevokeAccess = async () => {
    const {
      selectedUser,
      groupSelection,
      teamSelection,
      rolesSelection,
      loginSelection
    } = this.state;

    await Promise.all([...groupSelection.getSelected()].
      map(group => this.removeFromGroup(group, selectedUser)));
    await Promise.all([...teamSelection.getSelected()].
      map(team => this.removeFromTeam(team, selectedUser)));
    await Promise.all([...rolesSelection.getSelected()].
      map(projectRole => this.revokeProjectRole(selectedUser, projectRole)));
    await Promise.all([...loginSelection.getSelected()].
      map(login => this.removeLogin(selectedUser, login)));

    return this.reloadUser(selectedUser);
  };

  render() {
    const {
      selectedUser,
      loadingUser,
      groupSelection,
      teamSelection,
      rolesSelection,
      loginSelection,
      hubURL
    } = this.state;

    return (
      <div className={styles.widget}>
        <UserSelect
          fetchHub={this.props.dashboardApi.fetchHub}
          selected={selectedUser}
          onSelect={this.reloadUser}
        />

        {selectedUser &&
        <div className={styles['user-panel']}>
          <UserProperties
            user={selectedUser}
            hubURL={hubURL}
          />
          <MultiTable>
            <GroupsTable
              data={selectedUser.groups || []}
              loading={loadingUser}
              selection={groupSelection}
              onSelect={this.onGroupSelect}
              hubURL={hubURL}
            />
            <TeamsTable
              data={selectedUser.teams || []}
              selection={teamSelection}
              onSelect={this.onTeamSelect}
              hubURL={hubURL}
            />
            <ProjectRolesTable
              data={selectedUser.projectRoles || []}
              selection={rolesSelection}
              onSelect={this.onProjectRoleSelect}
              hubURL={hubURL}
            />
            <LoginsTable
              data={selectedUser.details || []}
              selection={loginSelection}
              onSelect={this.onLoginSelect}
            />
          </MultiTable>

          <Panel>
            <Button
              primary={true}
              onClick={this.onRevokeAccess}
            >{'Revoke selected items'}</Button>
            <Button
              onClick={this.onCancel}
            >{'Finish'}</Button>
          </Panel>
        </div>}

      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) =>
  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  )
);
