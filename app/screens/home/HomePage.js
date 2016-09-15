import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import PurposeListContainer from './purpose-list/PurposeListContainer';
import HomeIntroComponent from './intro/HomeIntroComponent';
import PartnersComponent from './partners/PartnersComponent';

class HomePage extends Component {
  render() {
    return (
      <DocumentTitle title="Etusivu - Varaamo">
        <div className="home-page">
          <HomeIntroComponent />
          <PartnersComponent />
          <h2 id="purpose-category-header">Mitä haluat tehdä?</h2>
          <PurposeListContainer />
        </div>
      </DocumentTitle>
    );
  }
}

HomePage.propTypes = {};

export default HomePage;
