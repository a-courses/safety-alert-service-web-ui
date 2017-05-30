import app from './app';

describe('Safety alert service', () => {

  describe('AlertController', () => {
    let ctrl;

    beforeEach(() => {
      angular.mock.module(app);

      angular.mock.inject(($controller) => {
        ctrl = $controller('AlertController', {});
      });
    });

    it('should contain the starter url', () => {
    });
  });
});