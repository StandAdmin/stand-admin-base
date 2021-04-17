import React from 'react';

import { IActionCounterHocProps } from '../interface';
import { getDisplayName } from '../utils/util';
interface IActionCounterState {
  counterMap: { [key: string]: number };
}

export default function<P extends IActionCounterHocProps = any>() {
  return (WrappedComponent: React.ComponentType<P>) =>
    class ActionCounter extends React.Component<
      Omit<P, keyof IActionCounterHocProps>,
      IActionCounterState
    > {
      public static displayName = `ActionCounter_${getDisplayName<P>(
        WrappedComponent,
      )}`;

      state: IActionCounterState = {
        counterMap: {},
      };

      increaseActionCount = (action = 'submit', num = 1) => {
        this.setState(state => ({
          counterMap: {
            ...state.counterMap,
            [action]: (state.counterMap[action] || 0) + num,
          },
        }));
      };

      decreaseActionCount = (action = 'submit', num = 1) => {
        this.setState(state => ({
          counterMap: {
            ...state.counterMap,
            [action]: (state.counterMap[action] || 0) - num,
          },
        }));
      };

      getActionCount = (action?: string | string[]) => {
        const { counterMap } = this.state;

        const targetKeys: string[] = [];

        if (action) {
          if (Array.isArray(action)) {
            targetKeys.push(...action);
          } else {
            targetKeys.push(action);
          }
        }

        return Object.keys(counterMap).reduce((accumulator, key) => {
          return (
            accumulator +
            (!targetKeys.length || targetKeys.indexOf(key) >= 0
              ? counterMap[key]
              : 0)
          );
        }, 0);
      };

      render() {
        const {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        } = this;

        const hocProps: IActionCounterHocProps = {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        };

        return <WrappedComponent {...(this.props as P)} {...hocProps} />;
      }
    };
}
