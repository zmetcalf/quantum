import React from 'react';
import _ from 'lodash';

export default class {
  constructor() {
    this.column      = 'user_email';
    this.value       = '';
    this.list        = [];
    this.operator    = '';
    this.operators   = [];
    this.filterComp  = null;
    this.predicates  = [
      { title: 'User Email', type: 'string', value: 'user_email' },
      { title: 'Screen Width', type: 'number', value: 'screen_width' },
      { title: 'Screen Height', type: 'number', value: 'screen_height' },
      { title: '# of Visits', type: 'number', value: 'visits' },
      { title: 'First Name', type: 'string', value: 'user_first_name' },
      { title: 'Last Name', type: 'string', value: 'user_last_name' },
      { title: 'Page Response time (ms)', type: 'number', value: 'page_response' },
      { title: 'Domain', type: 'string', value: 'domain' },
      { title: 'Page Path', type: 'string', value: 'path' },
    ];

    this.setOperators();

    // Set Bindings since these will be called from Form
    this.setColumn       = this.setColumn.bind(this);
    this.getSearchObject = this.getSearchObject.bind(this);
    this.getColumnType   = this.getColumnType.bind(this);
    this.setOperator     = this.setOperator.bind(this);
    this.setValue        = this.setValue.bind(this);
    this.addToList       = this.addToList.bind(this);
    this.removeFromList  = this.removeFromList.bind(this);
  }

  getSearchObject() {
    if(!this.column || !(this.value || this.list.length) || this.operator) return;
    return {
      column: this.column,
      list: list.length ? list : undefined,
      value: value || undefined,
      operator: this.operator,
    };
  }

  getColumnType() {
    const predicate = _.find(this.predicates, { value: this.column });
    return predicate ? predicate.type : 'string';
  }

  setColumn(e) {
    debugger;
    this.column = e.target.value;
    this.setOperators();
  }

  setOperator(e) {
    this.operator = e.target.value;
  }

  setOperators() {
    switch(this.column) {
      case 'user_email':
      case 'user_first_name':
      case 'user_last_name':
      case 'domain':
      case 'path':
        this.operators = [
          'equals',
          'contains',
          'starts with',
          'in list',
        ];
        break;
      case 'screen_width':
      case 'screen_height':
      case 'visits':
      case 'page_response':
        this.operators = [
          'equals',
          'between',
          'greater than',
          'less than',
          'in list',
        ];
        break;
    }
  }

  setValue(e) {
    this.list = [];
    this.value = e.target.value;
  }

  addToList(e) {
    this.value = '';
    this.list = [...this.list, e.target.value];
  }

  removeFromList(e) {
    this.value = '';

    const index = this.list.indexOf(e.target.value);
    if(!index) return;

    this.list = [
      ...list.slice(0, index),
      ...list.slice(index + 1)
    ];
  }
}
