import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import MultiSelect from '@kenshooui/react-multi-select';
import { AppContext } from 'components';
import { GamesController, UsersController } from 'controllers';

import styles from './GameEditContainer.module.scss';

class GameEditContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameId: props.match.params.id,
      data: {
        name: '',
        buyin: '',
        rebuy: '',
        fee: '',
        active: true
      },
      players: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    this.context.showLoading();
    let data = await GamesController.getGameById(this.state.gameId);

    await this.setState({ data });
    await this.setState({ players: data.players });

    let users = [];
    const usersData = await UsersController.getUsers();
    usersData &&
      usersData.length !== 0 &&
      (await usersData.map((user, index) => {
        return users.push({
          id: index,
          email: user.email,
          userId: user.id,
          label: `${user.firstName} ${user.lastName}`,
          disabled: !user.active
        });
      }));

    await this.setState({ users });
    this.context.hideLoading();
  }

  infoChanged(key, value) {
    let { data } = this.state;
    data[key] = value;
    this.setState({ data });
  }

  handleActiveChange = (value) => {
    let { data } = this.state;
    data.active = value;
    this.setState({ data });
  };

  async handleChange(players) {
    await this.setState({ players });
  }

  updateClicked = async () => {
    if (!this.validate()) {
      return;
    }
    this.context.showLoading();
    let data = this.state.data;
    data.players = this.state.players;
    try {
      await GamesController.updateGame(data);
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
    let { name, buyin, rebuy } = this.state.data;
    if (!name) {
      alert("Game Name can't be empty!");
      return false;
    }
    if (this.state.players.length === 0) {
      alert('Please add players!');
      return false;
    }
    if (buyin <= 0) {
      alert("Buy In can't be zero!");
      return false;
    }
    if (rebuy <= 0) {
      alert("Rebuy can't be zero!");
      return false;
    }

    return true;
  };

  render() {
    const { users, players } = this.state;

    return (
      <div className={styles.wrapper}>
        <h1> Edit Game </h1>
        <div className={styles.container}>
          <div className={styles.inputItem}>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Game Name *</span>
              <input
                name="name"
                className={styles.input}
                value={this.state.data.name}
                onChange={(e) => this.infoChanged('name', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Players</span>
              <MultiSelect
                items={users}
                selectedItems={players}
                onChange={this.handleChange}
                showSelectedItems={true}
                wrapperClassName={styles.selector}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Buy In($) *</span>
              <input
                name="buyin"
                className={styles.input}
                type="number"
                value={this.state.data.buyin}
                onChange={(e) => this.infoChanged('buyin', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Rebuy($) *</span>
              <input
                name="rebuy"
                className={styles.input}
                type="number"
                value={this.state.data.rebuy}
                onChange={(e) => this.infoChanged('rebuy', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Fee($) </span>
              <input
                name="fee"
                className={styles.input}
                type="number"
                value={this.state.data.fee}
                onChange={(e) => this.infoChanged('fee', e.target.value)}
              />
            </div>
            <div className={styles.inputItemRow}>
              <span className={styles.fieldName}>Status</span>
              <Switch
                onChange={this.handleActiveChange}
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

GameEditContainer.contextType = AppContext;

GameEditContainer.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default GameEditContainer;
