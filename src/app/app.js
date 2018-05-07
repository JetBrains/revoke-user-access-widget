import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import MultiTable from '@jetbrains/ring-ui/components/table/multitable';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import Tag from '@jetbrains/ring-ui/components/tag/tag';

import UserSelect from './UserSelect';
import GroupsTable from './GroupsTable';
import TeamsTable from './TeamsTable';
import ProjectRolesTable from './ProjectRolesTable';

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
      groupSelection: new Selection()
    };
  }

  onUserSelect = async user => {
    this.setState({
      selectedUser: user,
      loadingUser: true,
      groupSelection: new Selection()
    });
    const detailedUser = await this.props.dashboardApi.fetchHub(
      `api/rest/users/${user.id}`, {
        query: {
          fields: 'id,login,name,banned,profile(avatar,email(email,verified)),' +
          'groups(id,name),' +
          'teams(id,project(id,name)),' +
          'projectRoles(id,project(id,name),role(id,name)),' +
          'details(id,authModuleName,lastAccessTime)'
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

  render() {
    const {selectedUser, loadingUser} = this.state;

    return (
      <div className={styles.widget}>
        <div>
          <UserSelect
            fetchHub={this.props.dashboardApi.fetchHub}
            onSelect={this.onUserSelect}
          />
          {selectedUser && selectedUser.banned &&
          <Tag
            readOnly={true}
            className={styles['banned-tag']}
          >{'Banned'}</Tag>
          }
        </div>

        {selectedUser &&
        <div className={styles['user-panel']}>
          <MultiTable>
            <GroupsTable
              data={selectedUser.groups || []}
              loading={loadingUser}
            />
            <TeamsTable
              data={selectedUser.teams || []}
            />
            <ProjectRolesTable
              data={selectedUser.projectRoles || []}
            />
          </MultiTable>
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
