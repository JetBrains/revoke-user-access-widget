import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class GroupsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array,
    hubURL: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  columns = [{
    id: 'name',
    title: 'Group',
    getValue: group => (
      <Link href={`${this.props.hubURL}/groups/${group.id}`} target="_blank">{group.name}</Link>
    )
  }];

  renderTable() {
    return (
      <Table
        caption="Groups"
        columns={this.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default GroupsTable;
