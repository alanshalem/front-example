import { createContext } from 'react';

const defaultGS = {
  updateView: async () => {},
  views: [],
};

export const StateContext = createContext<State>(defaultGS);

export type State = {
  updateView: (doc: View) => Promise<void>;
  views: View[];
};

export type View = {};
