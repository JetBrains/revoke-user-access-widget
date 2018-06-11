import React from 'react';
import PropTypes from 'prop-types';
import Tag from '@jetbrains/ring-ui/components/tag/tag';
import Link from '@jetbrains/ring-ui/components/link/link';

import styles from './app.css';


const renderProperty = property => (property.value && (
  <div className="ring-form__group" key={property.key || property.name}>
    <label className="ring-form__label">{property.name}</label>
    <div className="ring-form__control">
      {property.value}
      {property.tag &&
      <Tag
        readOnly={true}
        className={styles['banned-tag']}
      >{property.tag}</Tag>}
    </div>
  </div>
));

const UserProperties = ({user, hubURL}) => {
  const email = (user.profile || {}).email || {};

  const properties = [{
    name: 'Name',
    value: user.name,
    tag: user.banned && 'banned'
  }, {
    name: 'Login',
    value: user.login
  }, {
    name: 'Email',
    value: email.email,
    tag: email.verified != null && (
      email.verified ? 'verified' : 'not verified'
    )
  }, {
    name: 'Profile',
    value: (
      <Link href={`${hubURL}/users/${user.id}`}>{'Full user account'}</Link>
    )
  }];

  return (
    <form className={'ring-form'}>
      <div className={styles['property-form']}>
        {properties.map(renderProperty)}
      </div>
    </form>
  );
};


UserProperties.propTypes = {
  user: PropTypes.object.isRequired,
  hubURL: PropTypes.string
};

export default UserProperties;
