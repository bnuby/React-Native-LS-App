import React from 'react';
import Redirect from './components/Redirect';
import Entry from './screens/Entry';
import Home from "./screens/Home/Home";
import HostStream from './screens/Stream/HostStream';
import JoinStream from './screens/Stream/JoinStream';


const ROUTES = [
  {
    path: '/',
    element: <Entry />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/host',
    element: <HostStream />
  },
  {
    path: '/join',
    element: <JoinStream />
  },
  {
    path: '*',
    element: <Redirect url={'/'} />
  }
];

export default ROUTES;