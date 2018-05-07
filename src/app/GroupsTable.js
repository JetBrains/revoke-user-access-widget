import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class GroupsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array
  };

  static columns = [{
    id: 'name',
    title: 'Group',
    getValue(group) {
      return (
        <Link href={`groups/${group.id}`} target="_blank">{group.name}</Link>
      );
    }
  }];

  constructor(props) {
    super(props);
  }

  renderTable() {
    return (
      <Table
        caption="Groups"
        columns={GroupsTable.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default GroupsTable;
