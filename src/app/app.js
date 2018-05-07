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
      loginSelection: new Selection()
    };
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

  onRevokeAccess = async () => {
    const {
      selectedUser/*,
      groupSelection,
      teamSelection,
      rolesSelection,
      loginSelection*/
    } = this.state;
    // groupSelection.getSelected().forEach(group => console.log('Remove group', group));
    // teamSelection.getSelected().forEach(team => console.log('Remove team', team));
    // rolesSelection.getSelected().forEach(projectRole => console.log('Remove project role', projectRole));
    // loginSelection.getSelected().forEach(login => console.log('Remove login', login));
    return this.reloadUser(selectedUser);
  };

  render() {
    const {
      selectedUser,
      loadingUser,
      groupSelection,
      teamSelection,
      rolesSelection,
      loginSelection
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
          <UserProperties user={selectedUser}/>
          <MultiTable>
            <GroupsTable
              data={selectedUser.groups || []}
              loading={loadingUser}
              selection={groupSelection}
              onSelect={this.onGroupSelect}
            />
            <TeamsTable
              data={selectedUser.teams || []}
              selection={teamSelection}
              onSelect={this.onTeamSelect}
            />
            <ProjectRolesTable
              data={selectedUser.projectRoles || []}
              selection={rolesSelection}
              onSelect={this.onProjectRoleSelect}
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
            >{'Cancel'}</Button>
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
