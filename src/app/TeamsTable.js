import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class TeamsTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array,
    hubURL: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  columns = [{
    id: 'project',
    title: 'Team',
    getValue: team => (team.project &&
      <Link href={`${this.props.hubURL}/projects-administration/${team.project.id}?tab=team`} target="_blank">{team.project.name}</Link>
    )
  }];

  renderTable() {
    return (
      <Table
        caption="Teams"
        columns={this.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default TeamsTable;
