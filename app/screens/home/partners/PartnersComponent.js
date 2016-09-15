import React from 'react';

import vaakaImage from './images/vaaka.png';
import hginvarhaiskasvatusImage from './images/hginvarhaiskasvatus.png';
import kaupunginkirjatoImage from './images/kaupunginkirjato.png';


function renderImage(src, alt) {
  return (
    <div className="partner-image-wrapper">
      <img src={src} alt={alt} />
    </div>
  );
}


function PartnersComponent() {
  return (
    <div className="partners">
      <h2>Varaamossa mukana</h2>
      <div className="partners-images">
        {renderImage(vaakaImage, 'nuorisoasiainkeskus')}
        {renderImage(kaupunginkirjatoImage, 'Helsingin kaupunginkirjasto')}
        {renderImage(hginvarhaiskasvatusImage, 'Helsingin kaupunki - Varhaiskasvatusvirasto')}
      </div>
    </div>
  );
}

export default PartnersComponent;
