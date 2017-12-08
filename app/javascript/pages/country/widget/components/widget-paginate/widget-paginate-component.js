import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-paginate-styles.scss';

class WidgetPaginate extends PureComponent {
  render() {
    const { paginate, count, onClickChange } = this.props;

    const showNext = paginate.page * paginate.limit < count;
    const showPrevious = paginate.page > 1;

    return count > paginate.limit ? (
      <div className="c-widget-paginate">
        {showPrevious && (
          <button
            className="c-widget-paginate__icon c-widget-paginate__icon--up"
            onClick={() => onClickChange(-1)}
          >
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down" />
            </svg>
          </button>
        )}
        {showNext && (
          <button
            className="c-widget-paginate__icon"
            onClick={() => onClickChange(1)}
          >
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down" />
            </svg>
          </button>
        )}
      </div>
    ) : null;
  }
}

WidgetPaginate.propTypes = {
  paginate: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onClickChange: PropTypes.func.isRequired
};

export default WidgetPaginate;
