import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

import Selection from '@jetbrains/ring-ui/components/table/selection';

class GroupsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array,
    selection: PropTypes.instanceOf(Selection)
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
    this.state = {
      selection: new Selection()
    };
  }

  onSelect = selection => this.setState({selection});

  renderTable() {
    const {selection} = this.state;

    return (
      <Table
        caption="Groups"
        columns={GroupsTable.columns}
        selection={selection}
        onSelect={this.onSelect}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default GroupsTable;
