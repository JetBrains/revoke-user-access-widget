import React from 'react';
import {connect} from 'react-redux';
import Table from '@jetbrains/ring-ui/components/table/table';
import Link from '@jetbrains/ring-ui/components/link/link';

import {selectGroups} from './ReduxStore';

const columns = hubURL => [{
  id: 'name',
  title: 'Groups',
  getValue: group => (
    <Link href={`${hubURL}/groups/${group.id}`} target="_blank">{group.name}</Link>
  )
}];

const GroupsTable = connect(
  state => ({
    columns: columns(state.hubURL),
    data: state.selectedUser.groups || [],
    loading: state.loadingUser,
    selection: state.groupSelection
  }),
  dispatch => ({
    onSelect: selection => dispatch(selectGroups(selection))
  })
)(Table);

export default GroupsTable;
