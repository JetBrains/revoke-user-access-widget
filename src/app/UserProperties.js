import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@jetbrains/ring-ui/components/badge/badge';
import Island from '@jetbrains/ring-ui/components/island/island';
import {UserCard} from '@jetbrains/ring-ui/components/user-card/user-card';

import styles from './app.css';


const UserProperties = ({user, hubURL}) => {
  const email = (user.profile || {}).email || {};

  const userCardModel = {
    login: user.login,
    name: user.name,
    email: email.email,
    avatarUrl: user.profile.avatar.url,
    href: `${hubURL}/users/${user.id}`,
    banned: user.banned,
    online: user.banned,
    banReason: user.banReason
  };

  return (
    <Island className={styles.userInfoContainer}>
      <UserCard
        className={styles.userInfo}
        user={userCardModel}
      >
        {
          email.verified != null &&
          <Badge
            valid={email.verified}
            className={styles.userTag}
          >
            {email.verified ? 'email verified' : 'email not verified'}
          </Badge>
        }
      </UserCard>
    </Island>
  );
};


UserProperties.propTypes = {
  user: PropTypes.object.isRequired,
  hubURL: PropTypes.string
};

export default UserProperties;
