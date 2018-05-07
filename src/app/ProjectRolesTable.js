import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class ProjectRolesTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array,
    hubURL: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  columns = [{
    id: 'role',
    title: 'Role',
    getValue: projectRole => (
      <Link href={`${this.props.hubURL}/roles/${projectRole.role.id}`} target="_blank">{projectRole.role.name}</Link>
    )
  }, {
    id: 'project',
    title: 'Project',
    getValue: projectRole => (projectRole.project &&
      <Link href={`${this.props.hubURL}/projects-administration/${projectRole.project.id}?tab=access`} target="_blank">{projectRole.project.name}</Link>
    )
  }];

  renderTable() {
    return (
      <Table
        caption="Project Roles"
        columns={this.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default ProjectRolesTable;
