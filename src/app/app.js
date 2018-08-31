import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import {setLocale} from 'hub-dashboard-addons/dist/localization';
import React from 'react';
import {Provider} from 'react-redux';
import {render} from 'react-dom';

import '@jetbrains/ring-ui/components/form/form.scss';
import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import createStore, {setHubURL} from './ReduxStore';

import WidgetContainer from './WidgetContainer';
import HubService from './HubService';
import TRANSLATIONS from './translations';


DashboardAddons.registerWidget(dashboardApi => {
  setLocale(DashboardAddons.locale, TRANSLATIONS);

  const store = createStore();
  const hubService = new HubService(dashboardApi.fetchHub);
  hubService.requestHubURL().
    then(hubURL => setHubURL(hubURL));

  return render(
    <Provider store={store}>
      <WidgetContainer hubService={hubService}/>
    </Provider>,
    document.getElementById('app-container')
  );
});
