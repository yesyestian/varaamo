import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../i18n/injectT';

function ResourceCalendarOverlay({ children }) {
  return (
    <div className="app-ResourceCalendarOverlay">
      <div className="app-ResourceCalendarOverlay__overlay">
        <div className="app-ResourceCalendarOverlay__content">
          {children}
        </div>
      </div>
    </div>
  );
}

ResourceCalendarOverlay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default injectT(ResourceCalendarOverlay);
