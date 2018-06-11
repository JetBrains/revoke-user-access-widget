import React from 'react';
import PropTypes from 'prop-types';

import MultiTable from '@jetbrains/ring-ui/components/table/multitable';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import '@jetbrains/ring-ui/components/form/form.scss';

import styles from './app.css';
import UserSelect from './UserSelect';
import UserPropertiesContainer from './UserPropertiesContainer';
import GroupsTable from './GroupsTable';
import TeamsTable from './TeamsTable';
import ProjectRolesTable from './ProjectRolesTable';
import LoginsTable from './LoginsTable';

const Optional = ({data, children}) => ((data || []).length ? (
  <div className={styles['property-table']}>{children}</div>
) : '');

Optional.propTypes = {
  data: PropTypes.array,
  children: PropTypes.element
};

const Widget = (
  {
    onUserSelect,
    hubService,
    selectedUser,
    revokingAccess,
    onRevokeAccess,
    onCancel
  }
) => (
  <div className={styles.widget}>
    <UserSelect
      onSelect={onUserSelect}
      hubService={hubService}
    />

    {selectedUser && (
      <div className={styles['user-panel']}>
        <UserPropertiesContainer/>
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
        <Panel>
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
    )}
  </div>
);

Widget.propTypes = {
  onUserSelect: PropTypes.func.isRequired,
  onRevokeAccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  revokingAccess: PropTypes.bool.isRequired,
  hubService: PropTypes.object.isRequired
};

export default Widget;
