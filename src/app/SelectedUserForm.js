import React from 'react';
import PropTypes from 'prop-types';

import MultiTable from '@jetbrains/ring-ui/components/table/multitable';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';

import UserSelect from './UserSelect';
import UserPropertiesContainer from './UserPropertiesContainer';
import GroupsTable from './GroupsTable';
import TeamsTable from './TeamsTable';
import ProjectRolesTable from './ProjectRolesTable';
import LoginsTable from './LoginsTable';

import styles from './app.css';

const Optional = ({data, children}) => ((data || []).length ? (
  <div className={styles['property-table']}>{children}</div>
) : '');

Optional.propTypes = {
  data: PropTypes.array,
  children: PropTypes.element
};

const SelectedUserForm = (
  {
    onUserSelect,
    hubService,
    selectedUser,
    revokingAccess,
    onRevokeAccess,
    onCancel
  }
) => (
  <div>
    <UserSelect
      onUserSelect={onUserSelect}
      hubService={hubService}
    />

    <div className={styles['user-panel']}>
      <UserPropertiesContainer/>
      <div className={styles.userMultiTable}>
        <MultiTable>
          <Optional data={selectedUser.groups}>
            <GroupsTable/>
          </Optional>
          <Optional data={selectedUser.teams}>
            <TeamsTable/>
          </Optional>
          <Optional data={selectedUser.projectRoles}>
            <ProjectRolesTable/>
          </Optional>
          <Optional data={selectedUser.details}>
            <LoginsTable/>
          </Optional>
        </MultiTable>
      </div>
      <Panel className={styles.widgetFooter}>
        <Button
          primary={true}
          loader={revokingAccess}
          onClick={onRevokeAccess}
        >{'Revoke selected items'}</Button>
        <Button
          onClick={onCancel}
        >{'Finish'}</Button>
      </Panel>
    </div>
  </div>
);

SelectedUserForm.propTypes = {
  onUserSelect: PropTypes.func.isRequired,
  onRevokeAccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  revokingAccess: PropTypes.bool.isRequired,
  hubService: PropTypes.object.isRequired
};

export default SelectedUserForm;
