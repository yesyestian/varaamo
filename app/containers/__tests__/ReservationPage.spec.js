import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import { UnconnectedReservationPage as ReservationPage } from 'containers/ReservationPage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Container: ReservationPage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const props = {
    actions: { fetchResource: simple.stub() },
    date: '2015-10-10',
    id: resource.id,
    isFetchingResource: false,
    resource: Immutable(resource),
    unit: Immutable(unit),
  };
  const tree = sd.shallowRender(<ReservationPage {...props} />);

  describe('rendering a link to resource page', () => {
    const linkTree = tree.subTree('LinkContainer');

    it('should display a link to this resources page', () => {
      const linkVdom = linkTree.getRenderOutput();
      const expected = `/resources/${props.resource.id}`;

      expect(linkVdom.props.to).to.equal(expected);
    });

    it('should display the link as a Button', () => {
      const buttonTrees = linkTree.everySubTree('Button');

      expect(buttonTrees.length).to.equal(1);
    });

    it('the link button should have text "Tilan tiedot"', () => {
      const buttonVdom = linkTree.subTree('Button').getRenderOutput();

      expect(buttonVdom.props.children).to.equal('Tilan tiedot');
    });
  });

  describe('rendering ResourceHeader', () => {
    const resourceHeaderTrees = tree.everySubTree('ResourceHeader');

    it('should render ResourceHeader component', () => {
      expect(resourceHeaderTrees.length).to.equal(1);
    });

    it('should pass correct props to ResourceHeader component', () => {
      const resourceHeaderVdom = resourceHeaderTrees[0].getRenderOutput();
      const actualProps = resourceHeaderVdom.props;

      expect(actualProps.name).to.equal(props.resource.name.fi);
      expect(typeof actualProps.address).to.equal('string');
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch resource data when component mounts', () => {
      expect(props.actions.fetchResource.callCount).to.equal(1);
    });

    it('should fetch resource with correct arguments', () => {
      const actualArgs = props.actions.fetchResource.lastCall.args;

      expect(actualArgs[0]).to.equal(props.id);
      expect(actualArgs[1].start).to.contain(props.date);
      expect(actualArgs[1].end).to.contain(props.date);
    });
  });
});
