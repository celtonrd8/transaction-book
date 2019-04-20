import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { createConnection  } from 'typeorm';
import { Company, Deposit, Sales } from './entity';

import Root from './Root';

import './app.global.scss';
(async () => {
  try {
    console.log('Connection DB... by Default..');

    await createConnection({
      type: 'sqlite',
      synchronize: true,
      logging: true,
      logger: 'simple-console',
      database: './database.sqlite',
      entities: [Company, Deposit, Sales],
    });
  } catch (e) {
    console.log(e.message);
  }
})();

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById('root')
);

if ((module as any).hot) {
  (module as any).hot.accept('./Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./Root').default;
    render(
      <AppContainer>
        <NextRoot />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
