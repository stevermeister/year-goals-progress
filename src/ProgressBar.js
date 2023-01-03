import React from 'react';

function ProgressBar(props) {

  return (
      <div className="progressbar-container">
        <div className="progressbar-complete" style={{ width: `${Math.floor(props.number/props.total*100)}%` }}>
          <div className="progressbar-liquid"></div>
        </div>
        <span className="progress">{props.number}/{props.total}</span>
      </div>
  );
}

export default ProgressBar;