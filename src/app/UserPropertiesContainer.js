import {connect} from 'react-redux';

import UserProperties from './UserProperties';

const UserPropertiesContainer = connect(
  state => ({
    user: state.selectedUser,
    hubURL: state.hubURL
  })
)(UserProperties);

export default UserPropertiesContainer;
