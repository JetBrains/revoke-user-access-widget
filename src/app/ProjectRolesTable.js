import React from 'react';
import {connect} from 'react-redux';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

import {selectRoles} from './ReduxStore';

const columns = hubURL => [{
  id: 'role',
  title: 'Project Roles',
  getValue: projectRole => (projectRole.role &&
    <Link
      href={`${hubURL}/roles/${projectRole.role.id}`}
      target="_blank"
    >{projectRole.role.name}</Link>
  )
}, {
  id: 'project',
  title: 'Project',
  getValue: projectRole => (projectRole.project &&
    <Link
      href={`${hubURL}/projects-administration/${projectRole.project.id}?tab=access`}
      target="_blank"
    >{projectRole.project.name}</Link>
  )
}];

const ProjectRolesTable = connect(
  state => ({
    columns: columns(state.hubURL),
    data: state.selectedUser.projectRoles || [],
    selection: state.roleSelection
  }),
  dispatch => ({
    onSelect: selection => dispatch(selectRoles(selection))
  })
)(Table);

export default ProjectRolesTable;
