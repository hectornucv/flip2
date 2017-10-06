import Velocity from 'velocity-animate';
/*=========================================
=            Create Bundle CSS            =
=========================================*/
//anything imported into bundle.scss is but into dist/bundle.scss
//you probably don't ever need to touch this.
require('../scss/bundle.scss');

/*========================================
=            Create Bundle.js            =
========================================*/
//anything included below will be included in the bundle.js


//NPM

//CUSTOM
require('./_flip2win.js');
require('./_gameScript.js');


