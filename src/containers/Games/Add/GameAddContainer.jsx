import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { AppContext } from 'components';
import { GamesController, UsersController } from 'controllers';

import styles from './GameAddContainer.module.scss';
class GameAddContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        name: '',
        buyIn: null,
        rebuy: null,
        active: true,
        players: []
      },
      users: []
    };
  }

  async componentDidMount() {
    let users = [];
    this.context.showLoading();

    const data = await UsersController.getUsers();
    data &&
      data.length !== 0 &&
      (await data.map((user) => {
        users.push(user.email);
      }));
    await this.setState({ users });
    this.context.hideLoading();
  }

  infoChanged(key, value) {
    let { data } = this.state;
    data[key] = value;
    this.setState({ data });
  }

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
    let { name, buyIn, rebuy, players } = this.state.data;
    if (!name) {
      alert("Game Name can't be empty!");
      return false;
    }
    if (buyIn <= 0) {
      alert("Buy In can't be zero!");
      return false;
    }
    if (rebuy <= 0) {
      alert("Buy In can't be zero!");
      return false;
    }
    if (players.length === 0) {
      alert('Please add players!');
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
              <span className={styles.fieldName}>Game Name *</span>
              <input
                name="name"
                value={this.state.data.name}
                onChange={(e) => this.infoChanged('name', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Players</span>
              <Select
                defaultValue={this.state.players}
                isMulti
                name="colors"
                options={this.state.users}
                className="basic-multi-select"
                classNamePrefix="select"
                // styles={customStyles}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Buy In($) *</span>
              <input
                name="buyin"
                type="number"
                value={this.state.data.buyIn}
                onChange={(e) => this.infoChanged('buyin', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Rebuy($) *</span>
              <input
                name="rebuy"
                type="number"
                value={this.state.data.rebuy}
                onChange={(e) => this.infoChanged('rebuy', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <div className={styles.btnSave} onClick={this.addClicked}>
            Save
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
