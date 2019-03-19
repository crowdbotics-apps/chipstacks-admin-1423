import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

import { AppContext } from 'components';
import { GamesController } from 'controllers';

import styles from './GameAddContainer.module.scss';

const emailRegEx =
  // eslint-disable-next-line max-len
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class GameAddContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: { firstName: '', lastName: '', email: '', active: true }
    };

    this.handleChange = this.handleChange.bind(this);
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

  addClicked = async () => {
    if (!this.validate()) {
      return;
    }
    this.context.showLoading();
    console.log(this.state.data);
    try {
      await GamesController.addGame(this.state.data);
      this.props.history.goBack();
    } catch (error) {
      alert(error.message);
    }
    this.context.hideLoading();
  };

  cancelClicked = () => {
    this.props.history.goBack();
  };

  validate = () => {
    let { firstName, email } = this.state.data;
    if (!firstName) {
      alert("First Name can't be empty!");
      return false;
    }
    if (!email) {
      alert("Email can't be empty!");
      return false;
    }
    if (!emailRegEx.test(email)) {
      alert('Email is not valid!');
      return false;
    }
    return true;
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <h1> Add Game </h1>
        <div className={styles.container}>
          <div className={styles.inputItem}>
            <div className={styles.inputItemRow}>
              <span>First Name *</span>
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
              <span>Email *</span>
              <input
                name="email"
                value={this.state.data.email}
                onChange={(e) => this.infoChanged('email', e.target.value)}
              />
            </div>
            {/* <div className={styles.inputItemRow}>
              <span>Status</span>
              <Switch
                onChange={this.handleChange}
                checked={this.state.data.active}
                id="normal-switch"
              />
            </div> */}
          </div>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.btnSave} onClick={this.addClicked}>
            Create Game
          </div>
          <div className={styles.btnCancel} onClick={this.cancelClicked}>
            Cancel
          </div>
        </div>
      </div>
    );
  }
}

GameAddContainer.contextType = AppContext;

GameAddContainer.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default GameAddContainer;
