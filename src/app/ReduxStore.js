import {createStore} from 'redux';
import {createAction, createReducer} from 'redux-act';

import Selection from '@jetbrains/ring-ui/components/table/selection';

export const setHubURL = createAction();

export const selectUser = createAction();
export const setUserDetails = createAction();

export const requestUsers = createAction();
export const setUsers = createAction();
export const requestMoreUsers = createAction();
export const setMoreUsers = createAction();

export const selectGroups = createAction();
export const selectTeams = createAction();
export const selectRoles = createAction();
export const selectLogins = createAction();

export const startRevocation = createAction();
export const finishRevocation = createAction();

export const cancel = createAction();

const reducer = createReducer(
  {
    [setHubURL]: (state, hubURL) => ({
      ...state,
      hubURL
    }),
    [selectUser]: (state, selectedUser) => ({
      ...state,
      selectedUser,
      loadingUserDetails: true,

      groupSelection: new Selection(),
      teamSelection: new Selection(),
      roleSelection: new Selection(),
      loginSelection: new Selection()
    }),
    [setUserDetails]: (state, selectedUser) => ({
      ...state,
      selectedUser,
      loadingUserDetails: false,

      groupSelection: new Selection({data: selectedUser.groups || []}),
      teamSelection: new Selection({data: selectedUser.teams || []}),
      roleSelection: new Selection({data: selectedUser.projectRoles || []}),
      loginSelection: new Selection({data: selectedUser.details || []})
    }),
    [requestUsers]: (state, userQuery) => ({
      ...state,
      loadingUsers: true,
      userQuery,
      users: []
    }),
    [setUsers]: (state, users) => ({
      ...state,
      loadingUsers: false,
      users
    }),
    [requestMoreUsers]: state => ({
      ...state,
      loadingUsers: true
    }),
    [setMoreUsers]: (state, users) => ({
      ...state,
      loadingUsers: false,
      users: [...state.users, ...users]
    }),
    [selectGroups]: (state, groupSelection) => ({
      ...state,
      groupSelection
    }),
    [selectTeams]: (state, teamSelection) => ({
      ...state,
      teamSelection
    }),
    [selectRoles]: (state, roleSelection) => ({
      ...state,
      roleSelection
    }),
    [selectLogins]: (state, loginSelection) => ({
      ...state,
      loginSelection
    }),
    [startRevocation]: state => ({
      ...state,
      revokingAccess: true
    }),
    [finishRevocation]: state => ({
      ...state,
      revokingAccess: false
    }),
    [cancel]: state => ({
      ...state,
      selectedUser: null,
      revokingAccess: false
    })
  },
  {
    hubURL: '',

    selectedUser: null,
    loadingUserDetails: false,
    loadingUsers: false,
    userQuery: '',
    users: [],

    groupSelection: new Selection(),
    teamSelection: new Selection(),
    roleSelection: new Selection(),
    loginSelection: new Selection(),

    revokingAccess: false
  }
);

export default () => createStore(reducer);
