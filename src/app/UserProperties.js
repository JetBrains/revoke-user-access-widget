import 'babel-polyfill';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tag from '@jetbrains/ring-ui/components/tag/tag';
import Link from '@jetbrains/ring-ui/components/link/link';
import '@jetbrains/ring-ui/components/form/form.scss';

import styles from './app.css';

class UserProperties extends Component {
  static propTypes = {
    user: PropTypes.object,
    hubURL: PropTypes.string
  };

  static renderProperty(property) {
    return (property.value &&
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
    );
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {user, hubURL} = this.props;
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
        {properties.map(UserProperties.renderProperty)}
      </form>
    );
  }
}

export default UserProperties;
