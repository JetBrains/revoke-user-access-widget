import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from '@jetbrains/ring-ui/components/select/select';
import {H1} from '@jetbrains/ring-ui/components/heading/heading';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      data: []
    };
  }

  async getUsers(query, skip) {
    return this.props.dashboardApi.fetchHub(
      'api/rest/users', {
        query: {
          query: query && `nameStartsWith: {${query}}`,
          fields: 'id,login,name,profile(avatar,email(email)),total',
          orderBy: 'login',
          $skip: skip,
          $top: 20
        }
      }
    );
  }

  async loadUsers(query, loadMore = false) {
    const {data: oldData} = this.state;
    this.setState({
      loadingUsers: true,
      query
    });
    const userPage = await this.getUsers(query, loadMore ? oldData.length : 0);
    const newData = userPage.users.map(user => ({
      key: user.id,
      label: `${user.name} (${user.login})`,
      description: ((user.profile || {}).email || {}).email,
      icon: user.profile.avatar.url,
      user
    }));
    this.setState({
      loadingUsers: false,
      data: loadMore ? oldData.concat(newData) : newData
    });
  }

  selectUser(user) {
    this.setState({selectedUser: user})
  }

  render() {
    const {data, query, loadingUsers, selected} = this.state;

    return (
      <div>
        <H1>Select User to Wipe</H1>
        <Select
          multiple={false}
          loading={loadingUsers}
          filter={{fn: () => true}}
          onOpen={() => this.loadUsers('')}
          onClose={() => this.setState({data: []})}
          onFilter={query => this.loadUsers(query)}
          onLoadMore={() => this.loadUsers(query, true)}
          onSelect={item => this.setState({selected: item})}
          selected={selected}
          data={data}
        />

        <H1>{selected && selected.user.login}</H1>
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
