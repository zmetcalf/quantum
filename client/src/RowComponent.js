import React, { Component } from 'react';

class RowComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      operator: props.row.operator,
      value: props.row.value,
      betweenHigh: props.row.betweenHigh,
    };

    this.setColumn   = this.setColumn.bind(this);
    this.setOperator = this.setOperator.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setBetween = this.setBetween.bind(this);
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
                 value={this.props.value}
                 onChange={this.setValue}/>
      case 'between':
        return (
          <div>
            <input type='number' className='form-control' value={this.props.value} onChange={e => this.setBetween(e.target.value)}/>
            <input type='number' className='form-control' value={this.props.beteenHigh} onChange={e => this.setBetween(null, e.target.value)}/>
          </div>
        );
    }
    return null;
  }

  setColumn(e) {
    this.props.row.setColumn(e);
    this.setState({ operator: '' });;
  }

  setOperator(e) {
    this.props.row.setOperator(e);
    this.setState({ operator: e.target.value, betweenHigh: 0, value: '' });
  }

  setValue(e) {
    this.props.row.setValue(e);
    this.setState({ betweenHigh: 0, value: e.target.value });
  }

  setBetween(first, second) {
    const value = first ? first : (this.state.value ||  0);
    const betweenHigh = second ? second : (this.state.betweenHigh || 0);
    this.props.row.setBetween(value, betweenHigh);
    this.setState({ betweenHigh, value });
  }

  render() {
    const {
      row,
      parentListLength,
    } = this.props;

    const {
      operator,
    } = this.state;

    return (
      <div key={row.uuid} className='form-row'>
        {parentListLength > 1 ?
          <div className='col' onClick={() => this.removeRow(row)}> - </div> :
          <div className='col'></div>
        }
        <div className='col'>
          <select className='form-control' onChange={this.setColumn}>
            {row.predicates.map((predicate, index) => (
              <option key={index} value={predicate.value}>{predicate.title}</option>
            ))}
          </select>
        </div>
        {row.column ?
          <div className='col'>
            <select className='form-control' value={operator} onChange={this.setOperator}>
                <option value=''></option>
              {row.operators.map((operator, index) => (
                <option key={index} value={operator}>{operator}</option>
              ))}
            </select>
          </div>
        : null}
        <div className='col'>{this.getFilterComp(row)}</div>
      </div>
    );
  }
};

export default RowComponent;
