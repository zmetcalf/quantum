import uuid from 'uuid/v1';
import _ from 'lodash';

export default class {
  constructor() {
    this.column      = 'user_email';
    this.value       = '';
    this.list        = [];
    this.operator    = '';
    this.operators   = [];
    this.filterComp  = null;
    this.uuid        = uuid();
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
  }

  getSearchObject() {
    if(!this.column || !(this.value || this.list.length) || !this.operator) return;
    if(this.operator === 'in list')
      return {
        column: this.column,
        list: this.value.split(','),
        operator: this.operator,
      };
    else
      return {
        column: this.column,
        list: this.list.length ? this.list : undefined,
        value: this.value || undefined,
        operator: this.operator,
      };
  }

  getColumnType() {
    const predicate = _.find(this.predicates, { value: this.column });
    return predicate ? predicate.type : 'string';
  }

  setColumn(e) {
    this.column = e.target.value;
    this.setOperators();
    this.operator = '';
  }

  setOperator(e) {
    this.operator = e.target.value;
    this.list = [];
    this.value = '';
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

  setBetween(first, second) {
    this.value = '';
    if(!first) first = this.list.length ? this.list[0] : 0;
    if(!second) second = this.list.length === 2 ? this.list[1] : 0;
    this.list = [first, second];
  }
}
