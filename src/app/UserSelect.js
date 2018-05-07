import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';

class UserSelect extends Component {
  static propTypes = {
    fetchHub: PropTypes.func,
    onSelect: PropTypes.func,
    selected: PropTypes.object
  };

  static user2item(user) {
    return {
      key: user.id,
      label: `${user.name} (${user.login})`,
      description: ((user.profile || {}).email || {}).email,
      icon: user.profile.avatar.url,
      user
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loadingUsers: false,
      query: ''
    };
  }

  async getUsers(query, skip) {
    return this.props.fetchHub(
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

  async loadData(query, loadMore = false) {
    const {data: oldData} = this.state;
    this.setState({
      loadingUsers: true,
      query
    });
    const userPage = await this.getUsers(query, loadMore ? oldData.length : 0);
    const newData = userPage.users.map(UserSelect.user2item);
    this.setState({
      loadingUsers: false,
      data: loadMore ? oldData.concat(newData) : newData
    });
  }

  filter = {fn: () => true};

  onOpen = () => this.loadData('');

  onClose = () => this.setState({data: []});

  onFilter = query => this.loadData(query);

  onLoadMore = () => this.loadData(this.state.query, true);

  onSelect = item => {
    this.props.onSelect(item.user);
  };

  render() {
    const {data, loadingUsers} = this.state;
    const {selected} = this.props;
    const selectedItem = selected && UserSelect.user2item(selected);

    return (
      <Select
        label="Select user"
        multiple={false}
        loading={loadingUsers}
        filter={this.filter}
        onOpen={this.onOpen}
        onClose={this.onClose}
        onFilter={this.onFilter}
        onLoadMore={this.onLoadMore}
        onSelect={this.onSelect}
        selected={selectedItem}
        size={Select.Size.FULL}
        minWidth={MinWidth.TARGET}
        data={data}
      />
    );
  }
}

export default UserSelect;
