import uuid from 'uuid/v1';
import _ from 'lodash';

export default class {
  constructor() {
    this.column      = 'user_email';
    this.value       = '';
    this.betweenHigh = 0;
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
    if(!this.column || !this.value || (this.operator === 'between' && !this.betweenHigh) || !this.operator) return;
    return {
      column: this.column,
      value: this.value || undefined,
      betweenHigh: this.betweenHigh || undefined,
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
    this.value = e.target.value;
  }

  setBetween(first, second) {
    this.value = first ? first : (this.value ||  0);
    this.betweenHigh = second ? second : (this.betweenHigh || 0);
  }
}
