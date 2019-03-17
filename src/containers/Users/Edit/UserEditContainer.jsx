import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

import { AppContext } from 'components';
import { UsersController } from 'controllers';

import styles from './UserEditContainer.module.scss';

class UserEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: props.match.params.id,
      data: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    this.context.showLoading();
    let data = await UsersController.getUserById(this.state.userId);

    await this.setState({ data });
    console.log(this.state.data);
    this.context.hideLoading();
  }

  infoChanged(key, value) {
    let { data } = this.state;
    data[key] = value;
    this.setState({ data });
  }

  handleChange = (value) => {
    let { data } = this.state;
    data.active = value;
    this.setState({ data });
  };

  updateClicked = async () => {
    this.context.showLoading();
    console.log(this.state.data);
    try {
      await UsersController.updateUser(this.state.data);
      this.props.history.goBack();
    } catch (error) {
      alert(error.message);
    }
    this.context.hideLoading();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Edit User </h1>
        <div className={styles.container}>
          <div className={styles.inputItem}>
            <div className={styles.inputItemRow}>
              <span>First Name</span>
              <input
                name="firstName"
                value={this.state.data.firstName}
                onChange={(e) => this.infoChanged('firstName', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span>Last Name</span>
              <input
                name="lasttName"
                value={this.state.data.lastName}
                onChange={(e) => this.infoChanged('lastName', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span>Email Name</span>
              <input
                readOnly
                name="email"
                value={this.state.data.email}
                onChange={(e) => this.infoChanged('email', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span>Status</span>
              <Switch
                onChange={this.handleChange}
                checked={this.state.data.active}
                id="normal-switch"
              />
            </div>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.btnSave} onClick={this.updateClicked}>
            Update
          </div>
          <div className={styles.btnCancel} onClick={this.cancelClicked}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

UserEditContainer.contextType = AppContext;

UserEditContainer.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default UserEditContainer;
