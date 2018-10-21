import React, { Component } from 'react';
import _ from 'lodash';

import Row from './Row';
import RowComponent from './RowComponent';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      searchItems: [new Row()],
      error: '',
    };
    this.search    = this.search.bind(this);
    this.addRow    = this.addRow.bind(this);
    this.removeRow = this.removeRow.bind(this);
  }

  search() {
    if(!this.state.searchItems.length) return;
    const self = this;
    if(this.error) this.setState({ error: '' });

    fetch(`/api/session?filters=${JSON.stringify(
      _.chain(this.state.searchItems)
       .map(item => item.getSearchObject())
       .compact()
       .value()
    )}`)
    .then(response => response.json())
    .then(json => self.setState({ results: json }))
    .catch(e => self.setState({ error: e }));
  }

  addRow() {
    this.setState({ searchItems: [...this.state.searchItems, new Row()] });
  }

  removeRow(row) {
    const index = this.state.searchItems.indexOf(row);
    if(index === -1) return;

    this.setState({ searchItems: [
      ...this.state.searchItems.slice(0, index),
      ...this.state.searchItems.slice(index + 1)
    ] });
  }

  render() {
    const {
      results,
      searchItems,
    } = this.state;

    return (
      <section>
        <h1>SEARCH FOR SESSIONS</h1>
        <hr/>
        {searchItems.map((row, index) => (
          <RowComponent row={row}
                        parentListLength={searchItems.length}
                        removeRow={this.removeRow}
                        key={row.uuid} />
        ))}

        <button onClick={this.addRow} type='button' className='btn btn-primary' style={{marginTop: 20 + 'px'}}>AND</button>

        <hr/>
        <button onClick={this.search} type='button' className='btn btn-primary float-right' style={{marginBottom: 20 + 'px'}}>Search</button>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>User Email</th>
              <th scope='col'>Screen Width</th>
              <th scope='col'>Screen Height</th>
              <th scope='col'># of Visits</th>
              <th scope='col'>First Name</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>Page Response time (ms)</th>
              <th scope='col'>Domain</th>
              <th scope='col'>Page Path</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                <th>{index}</th>
                <th>{row.user_email}</th>
                <th>{row.screen_width}</th>
                <th>{row.screen_height}</th>
                <th>{row.visits}</th>
                <th>{row.user_first_name}</th>
                <th>{row.user_last_name}</th>
                <th>{row.page_response}</th>
                <th>{row.domain}</th>
                <th>{row.path}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default Form;
