import { Card, Tabs } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import Analytics from './Dashboard/Analytics';
import Contacts from './Dashboard/Contacts';
import DashBoard from './Dashboard/Dashboard';
import Inbox from './Dashboard/Inbox';
import Subscriptions from './Dashboard/Subscriptions';
import Themes from './Dashboard/Themes';


function App() {

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'dashboard-1',
      content: 'Dashboard',
      panelID: 'dashboard-content-1',
      component: <DashBoard/>,
    },
    {
      id: 'inbox-1',
      content: 'Inbox',
      panelID: 'inbox-content-1',
      component: <Inbox/>
    },
    {
      id: 'contacts-1',
      content: 'Contacts',
      panelID: 'contacts-content-1',
      component: <Contacts/>
    },
    {
      id: 'analytics-1',
      content: 'Analytics',
      panelID: 'analytics-content-1',
      component: <Analytics/>
    },
    {
      id: 'subscription-1',
      content: 'Subscriptions',
      panelID: 'subscriptions-content-1',
      component: <Subscriptions/>
    },
    {
      id: 'themes-1',
      content: 'Themes',
      panelID: 'themes-content-1',
      component: <Themes/>
    },
  ];


  return (
    <div className="App">
     <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section>
          {tabs[selected].component}
        </Card.Section>
      </Tabs>
    </Card>
    </div>
  );
}

export default App;
