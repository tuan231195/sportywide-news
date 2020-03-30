import React from 'react';
import { ContainerInstance } from 'typedi';

export const ContainerContext = React.createContext<ContainerInstance>(null);
