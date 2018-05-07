import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';

class LoginsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array
  };

  static columns = [{
    id: 'authModuleName',
    title: 'Auth Module'
  }, {
    id: 'login',
    getValue(userDetail) {
      return userDetail.login ||
        userDetail.userid ||
        userDetail.commonName ||
        userDetail.nameId ||
        (userDetail.email || {}).email;
    }
  }, {
    id: 'fullName'
  }];

  constructor(props) {
    super(props);
  }

  renderTable() {
    return (
      <Table
        caption="Logins"
        columns={LoginsTable.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default LoginsTable;
