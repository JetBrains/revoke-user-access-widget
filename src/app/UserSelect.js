import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';

import connect from './betterConnect';

import {
  requestMoreUsers,
  requestUsers,
  setMoreUsers,
  setUsers
} from './ReduxStore';

const matchAllFilter = {fn: () => true};

const user2item = user => ({
  key: user.id,
  label: `${user.name} (${user.login})`,
  description: ((user.profile || {}).email || {}).email,
  icon: user.profile.avatar.url,
  user
});

const loadUsers = async (query, dispatch, hubService) => {
  dispatch(requestUsers(query));
  const userPage = await hubService.requestUserPage(query);
  const users = userPage && userPage.users;
  dispatch(setUsers(users));
};

const loadMoreUsers = async (dispatch, hubService, {userQuery, users}) => {
  dispatch(requestMoreUsers());
  const userPage = await hubService.requestUserPage(userQuery, users.length);
  const newUsers = userPage && userPage.users;
  dispatch(setMoreUsers(newUsers));
};

const UserSelect = connect(
  (state, dispatch, {hubService, onSelect}) => ({
    label: 'Select user',
    multiple: false,
    loading: state.loadingUsers,
    filter: matchAllFilter,
    selected: state.selectedUser && user2item(state.selectedUser),
    size: Select.Size.FULL,
    minWidth: MinWidth.TARGET,
    data: state.users.map(user2item),

    onOpen: () => loadUsers('', dispatch, hubService),
    onFilter: query => loadUsers(query, dispatch, hubService),
    onLoadMore: () => loadMoreUsers(dispatch, hubService, state),
    onSelect: item => onSelect(item.user)
  })
)(Select);

UserSelect.propTypes = {
  onSelect: PropTypes.func,
  hubService: PropTypes.object.isRequired
};

export default UserSelect;
