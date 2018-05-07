import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Header, {H1} from '@jetbrains/ring-ui/components/heading/heading';
import UserSelect from './UserSelect';
import GroupsTable from './GroupsTable';
import TeamsTable from './TeamsTable';
import MultiTable from '@jetbrains/ring-ui/components/table/multitable';
import Selection from '@jetbrains/ring-ui/components/table/selection';
import Link from '@jetbrains/ring-ui/components/link/link';

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

  async selectUser(user) {
    this.setState({
      selectedUser: user,
      loadingUser: true,
      groupSelection: new Selection()
    });
    const detailedUser = await this.props.dashboardApi.fetchHub(
      `api/rest/users/${user.id}`, {
        query: {
          fields: 'id,login,name,banned,profile(avatar,email(email,verified)),' +
          'groups(id,name,project(id,name)),' +
          'teams(id,project(id,name)),' +
          'projectRoles(project(id,name),role(id,name)),' +
          'details(id,authModuleName,lastAccessTime)'
        }
      });
    this.setState({
      selectedUser: detailedUser,
      loadingUser: false
    });
  }

  render() {
    const {selectedUser, loadingUser, groupSelection} = this.state;

    return (
      <div className={styles.widget}>
        <Header>Select User to Wipe</Header>
        <div>
          <UserSelect
            fetchHub={this.props.dashboardApi.fetchHub}
            onSelect={this.selectUser.bind(this)}
          />
        </div>

        {selectedUser &&
        <div className={styles["user-panel"]}>
          <Header><Link href={`users/${selectedUser.id}`}>{selectedUser.name}</Link></Header>
          <MultiTable>
            <GroupsTable
              data={selectedUser.groups || []}
              loading={loadingUser}
            />
            <TeamsTable
              data={selectedUser.teams || []}
              loading={loadingUser}
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
