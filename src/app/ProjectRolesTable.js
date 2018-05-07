import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

class ProjectRolesTable extends Component {
  static propTypes = {
    ...Table.propTypes,
    columns: PropTypes.array
  };

  static columns = [{
    id: 'role',
    title: 'Role',
    getValue(projectRole) {
      return (
        <Link href={`roles/${projectRole.role.id}`} target="_blank">{projectRole.role.name}</Link>
      );
    }
  }, {
    id: 'project',
    title: 'Project',
    getValue(projectRole) {
      return (projectRole.project &&
        <Link href={`projects/${projectRole.project.id}`} target="_blank">{projectRole.project.name}</Link>
      );
    }
  }];

  constructor(props) {
    super(props);
  }

  renderTable() {
    return (
      <Table
        caption="Project Roles"
        columns={ProjectRolesTable.columns}
        {...this.props}
      />
    );
  }

  render() {
    return this.props.data.length ? this.renderTable() : '';
  }
}

export default ProjectRolesTable;
