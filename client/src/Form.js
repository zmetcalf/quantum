import React, { Component } from 'react';
import _ from 'lodash';

import Row from './Row';

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

  getFilterComp(row) {
    switch(row.operator) {
      case 'in list':
      case 'equals':
      case 'contains':
      case 'starts with':
      case 'greater than':
      case 'less than':
        return <input type={row.getColumnType() === 'string' || row.operator === 'in list' ? 'text' : 'number'}
                 className='form-control'
                 placeholder={row.operator === 'in list' ? 'Seperate by commas' : ''}
                 onChange={row.setValue}/>
      case 'between':
        row.setBetween();
        return (
          <div>
            <input type='number' className='form-control' onChange={e => row.setBetween(e.target.value)}/>
            <input type='number' className='form-control' onChange={e => row.setBetween(null, e.target.value)}/>
          </div>
        );
    }
    return null;
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
          <div key={row.uuid} className='form-row'>
            {searchItems.length > 1 ?
              <div className='col' onClick={() => this.removeRow(row)}> - </div> :
              <div className='col'></div>
            }
            <div className='col'>
              <select className='form-control' onClick={e => { row.setColumn(e); this.forceUpdate(); }}>
                {row.predicates.map((predicate, index) => (
                  <option key={index} value={predicate.value}>{predicate.title}</option>
                ))}
              </select>
            </div>
            {row.column ?
              <div className='col'>
                <select className='form-control' onClick={e => {row.setOperator(e); this.forceUpdate();}}>
                    <option value=''></option>
                  {row.operators.map((operator, index) => (
                    <option key={index} value={operator}>{operator}</option>
                  ))}
                </select>
              </div>
            : null}
            <div className='col'>{this.getFilterComp(row)}</div>
          </div>
        ))}
        <button onClick={this.addRow} type='button' className='btn btn-primary'>AND</button>
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
        <button onClick={this.search} type='button' className='btn btn-primary'>Search</button>
      </section>
    );
  }
}

export default Form;
