'use strict';

describe('Bexer', () => {

  it('exports global Bexer variable', () => {
    assert.isDefined(Bexer, 'Bexer is defined');
    assert.isDefined(Bexer.Utils, 'Bexer.Utils is defined');
    assert.isDefined(Bexer.ErrorCatchers, 'Bexer.ErrorCatchers is defined');
    assert.isDefined(Bexer.GetNotifiersSingleton, 'Bexer.GetNotifiersSingleton is defined');
    assert.isDefined(Bexer.install, 'Bexer.Install is defined');
  });

});
