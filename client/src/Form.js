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
    if(!index) return;

    this.setState({ searchItems: [
      ...this.state.searchItems.slice(0, index),
      ...this.state.searchItems.slice(index + 1)
    ] });
  }

  getFilterComp(row) {
    switch(row.operator) {
      case 'equals':
        return row.getColumnType() === 'string' ? (
          <input type='text' className='form-control' onChange={row.setValue}/>
        ) : (
          <input type='number' className='form-control' onChange={row.setValue}/>
        );
      case 'contains':
      case 'starts with':
          return <input type='text' className='form-control' onChange={row.setValue}/>
      case 'greater than':
      case 'less than':
          return <input type='number' className='form-control' onChange={row.setValue}/>
      case 'in list':

      case 'between':


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
          <div key={index} className='form-row'>
            <div className='col' onClick={() => this.removeRow(row)}> - </div>
            <div className='col'>
              <select className='form-control' onClick={row.setColumn}>
                {row.predicates.map((predicate, index) => (
                  <option key={index} value={predicate.value}>{predicate.title}</option>
                ))}
              </select>
            </div>
            {row.column ?
              <div className='col'>
                <select className='form-control' onClick={e => {row.setOperator(e); this.forceUpdate();}}>
                    <option></option>
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
        <button onClick={this.search} type='button' className='btn btn-primary'>Search</button>
      </section>
    );
  }
}

export default Form;
