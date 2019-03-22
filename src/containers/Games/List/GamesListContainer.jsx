import React from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'components';
import Pagination from 'react-js-pagination';
import { GamesController } from 'controllers';
import moment from 'moment';
import styles from './GamesListContainer.module.scss';

var _ = require('lodash');
class GamesListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      { title: 'No', key: 'no' },
      { title: 'Game Name', key: 'name' },
      { title: 'Created Date', key: 'createdAt' },
      { title: 'Admin', key: 'admin' },
      { title: 'Participants', key: 'players' },
      { title: 'BuyIn', key: 'buyin' },
      { title: 'Rebuy', key: 'rebuy' },
      { title: 'Fee', key: 'fee' },
      { title: 'Profit/Loss', key: 'profit_loss' },
      { title: 'Active', key: 'active' },
      { title: 'Actions', key: '' }
    ];

    this.state = {
      data: [],
      keyword: '',
      activePage: 1,
      itemPerPage: 10
    };
  }

  async componentDidMount() {
    await this.reload();
  }

  reload = async () => {
    this.context.showLoading();

    let data = await GamesController.getGames();

    data = data.filter((game) =>
      game.name.toLowerCase().includes(this.state.keyword.toLowerCase())
    );

    await this.setState({
      data
    });
    this.context.hideLoading();
  };

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

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

  sortBy(key) {
    let { data } = this.state;
    if (
      key === 'players' ||
      key === 'buyin' ||
      key === 'rebuy' ||
      key === 'fee'
    ) {
      data = _.orderBy(data, key, ['asc']);
    } else {
      data = _.orderBy(data, key);
    }

    this.setState({ data });
  }

  createRow() {
    const { data } = this.state;
    let children = [];
    for (
      var i = (this.state.activePage - 1) * this.state.itemPerPage;
      i < this.state.activePage * this.state.itemPerPage;
      i++
    ) {
      let item = data[i];
      children.push(
        _.isEmpty(item) ? null : (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{item.name}</td>
            <td>
              {item.createdAt && moment(item.createdAt).format('DD/MM/YYYY')}
            </td>
            <td>{item.admin.firstName + ' ' + item.admin.lastName}</td>
            <td>{item.players.length}</td>
            <td>
              $
              {Number(item.buyin)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </td>
            <td>
              $
              {Number(item.rebuy)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </td>
            <td>
              $
              {Number(item.fee)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </td>
            <td>{item.profit_loss}</td>
            <td>{item.active ? 'Active' : 'Inactive'}</td>
            <td>
              <span onClick={this.editClicked(item.id)}>
                <i className={`fa fa-pencil-square-o ${styles.iconPencil}`} />
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
        )
      );
    }
    return children;
  }

  render() {
    const { data } = this.state;

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
        {data.length ? (
          <div>
            <table>
              <thead>
                <tr className={styles.header}>
                  {this.columns.map((item, index) => (
                    <th key={item.key} onClick={() => this.sortBy(item.key)}>
                      {item.title} &#x21C5;
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{this.createRow()}</tbody>
            </table>
            <div className={styles.bottom}>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemPerPage}
                totalItemsCount={data.length}
                onChange={(pageNumber) => this.handlePageChange(pageNumber)}
                innerClass={styles.pagination}
                activeClass={styles.activeItem}
              />
            </div>
          </div>
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
