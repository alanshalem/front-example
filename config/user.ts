import { MODULE_ID } from './constants.js';
import { Typings } from '@galicia-toolkit/core';

const user: Typings.User = {
  name: 'veronica maria',
  lastname: 'aberg cobo',
  gender: 'F',
  birthday: '25/07/1947',
  theme: 'classic',
  functionalities: {
    id: MODULE_ID.PARENT,
    title: 'Funcionalidad Padre',
    description: 'descripción de la funcionalidad padre',
    level: 0,
    visibility: true,
    uri: '/',
    targetAction: 'link',
    availability: {
      out_of_service: null,
      business_hours: {
        includes_holidays: true,
        includes: null,
        message: null,
      },
    },
    type: 'MenuLink',
    children: [
      {
        id: MODULE_ID.FIRST_FUNCTIONALITY,
        title: 'Funcionalidad hija',
        description: '',
        level: 0,
        visibility: true,
        uri: null,
        targetAction: 'fn',
        availability: {
          out_of_service: null,
          business_hours: {
            includes_holidays: true,
            includes: null,
            message: null,
          },
        },
        type: 'MenuLink',
        children: [],
      },
      {
        id: MODULE_ID.SECOND_FUNCTIONALITY,
        title: 'Funcionalidad hija sideDrawer',
        description: '',
        level: 1,
        visibility: true,
        uri: null,
        targetAction: 'fn',
        availability: {
          out_of_service: null,
          business_hours: {
            includes_holidays: true,
            includes: null,
            message: null,
          },
        },
        type: 'MenuLink',
        children: [],
      },
      {
        id: MODULE_ID.THIRD_FUNCTIONALITY,
        title: 'Funcionalidad en una ruta',
        description: '',
        level: 1,
        visibility: true,
        uri: '/link/:param',
        targetAction: 'link',
        type: 'MenuLink',
        children: [],
      },
    ],
  },
  employee: false,
};

export default user;
