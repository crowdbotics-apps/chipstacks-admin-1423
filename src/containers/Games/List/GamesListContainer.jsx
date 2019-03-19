import React from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'components';
import { GamesController } from 'controllers';
import moment from 'moment';
import styles from './GamesListContainer.module.scss';

class GamesListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      'No',
      'First Name',
      'Last Name',
      'Email',
      'Sign Up Date',
      'Games',
      'Active',
      'Actions'
    ];

    this.state = {
      data: [],
      keyword: ''
    };
  }

  async componentDidMount() {
    await this.reload();
  }

  reload = async () => {
    this.context.showLoading();

    let data = await GamesController.getGames();

    data = data.filter((game) =>
      (game.firstName + ' ' + game.lastName)
        .toLowerCase()
        .includes(this.state.keyword.toLowerCase())
    );

    await this.setState({
      data
    });
    this.context.hideLoading();
  };

  addClicked = () => {
    this.props.history.push('/games/add');
  };

  editClicked = (gameId) => () => {
    this.props.history.push(`/games/edit/${gameId}`);
  };

  deactivateClicked = (gameId) => async () => {
    var res = window.confirm('Do you want to deactivate this game?');
    if (res) {
      await GamesController.deactivateGame(gameId);
      await this.reload();
    }
  };

  activateClicked = (gameId) => async () => {
    var res = window.confirm('Do you want to activate this game?');
    if (res) {
      await GamesController.activateGame(gameId);
      await this.reload();
    }
  };

  searchInputChanged = (e) => {
    this.setState(
      {
        keyword: e.target.value
      },
      async () => {
        if (!this.state.keyword) {
          await this.reload();
        }
      }
    );
  };

  searchInputKeyPressed = async (e) => {
    if (e.charCode === 13) {
      // enter pressed
      await this.reload();
    }
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.searchbar}>
            <i className={`fa fa-search ${styles.iconSearch}`} />
            <input
              type="text"
              placeholder="Type game name here and press enter to get the result..."
              value={this.state.keyword}
              onChange={this.searchInputChanged}
              onKeyPress={this.searchInputKeyPressed}
            />
          </div>
          <div onClick={this.addClicked}>
            <i className={`fa fa-plus ${styles.icon}`} />
            Add
          </div>
        </div>
        {this.state.data.length ? (
          <table>
            <thead>
              <tr className={styles.header}>
                {this.columns.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((item, index) => (
                <tr key={item.id}>
                  <td>{`${index + 1}`}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.createdAt &&
                      moment(item.createdAt).format('DD/MM/YYYY')}
                  </td>
                  <td>{item.games}</td>
                  <td>{item.active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <span onClick={this.editClicked(item.id)}>
                      <i
                        className={`fa fa-pencil-square-o ${styles.iconPencil}`}
                      />
                    </span>
                    {item.active ? (
                      <span onClick={this.deactivateClicked(item.id)}>
                        <i className={`fa fa-trash-o ${styles.iconTrash}`} />
                      </span>
                    ) : (
                      <span onClick={this.activateClicked(item.id)}>
                        <i className={`fa fa-refresh ${styles.iconRefresh}`} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h3>No Search Result</h3>
        )}
      </div>
    );
  }
}

GamesListContainer.contextType = AppContext;

GamesListContainer.propTypes = {
  history: PropTypes.object
};

export default GamesListContainer;
