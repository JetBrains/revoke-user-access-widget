import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';

class UserSelect extends Component {
  static propTypes = {
    fetchHub: PropTypes.func,
    onSelect: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loadingUsers: false,
      query: '',
      selected: null
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

  filter = {fn: () => true};

  onOpen = () => this.loadData('');

  onClose = () => this.setState({data: []});

  onFilter = query => this.loadData(query);

  onLoadMore = () => this.loadData(this.state.query, true);

  onSelect = item => {
    this.props.onSelect(item.user);
    this.setState({selected: item});
  };

  render() {
    const {data, loadingUsers, selected} = this.state;

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
        selected={selected}
        minWidth={400}
        data={data}
      />
    );
  }
}

export default UserSelect;
