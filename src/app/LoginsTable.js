import {connect} from 'react-redux';
import Table from '@jetbrains/ring-ui/components/table/table';

import {selectLogins} from './ReduxStore';
import styles from './app.css';


const columns = [{
  id: 'login',
  title: 'Logins',
  className: styles.tableFirstColumn,
  headerClassName: styles.tableFirstColumn,
  getValue(userDetail) {
    return userDetail.login ||
      userDetail.userid ||
      userDetail.commonName ||
      userDetail.nameId ||
      (userDetail.email || {}).email;
  }
}, {
  title: 'Auth Module',
  id: 'authModuleName'
}];

const LoginsTable = connect(
  state => ({
    columns,
    data: state.selectedUser.details || [],
    selection: state.loginSelection
  }),
  dispatch => ({
    onSelect: selection => dispatch(selectLogins(selection))
  })
)(Table);

export default LoginsTable;
