import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class TeamsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array
  };

  static columns = [{
    id: 'project',
    title: 'Team',
    getValue(team) {
      return (team.project &&
        <Link href={`projects/${team.project.id}`} target="_blank">{team.project.name}</Link>
      );
    }
  }];

  constructor(props) {
    super(props);
  }

  renderTable() {
    return (
      <Table
        caption="Teams"
        columns={TeamsTable.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default TeamsTable;
