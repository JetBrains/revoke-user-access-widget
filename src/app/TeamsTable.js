import React from 'react';
import {connect} from 'react-redux';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

import {selectTeams} from './ReduxStore';

const columns = hubURL => [{
  id: 'project',
  title: 'Teams',
  getValue: team => (team.project &&
    <Link
      href={`${hubURL}/projects-administration/${team.project.id}?tab=team`}
      target="_blank"
    >{team.project.name}</Link>
  )
}];

const TeamsTable = connect(
  state => ({
    columns: columns(state.hubURL),
    data: state.selectedUser.teams || [],
    selection: state.teamSelection
  }),
  dispatch => ({
    onSelect: selection => dispatch(selectTeams(selection))
  })
)(Table);

export default TeamsTable;
