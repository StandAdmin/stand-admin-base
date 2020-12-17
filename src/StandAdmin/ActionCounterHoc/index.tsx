import React from 'react';

interface IActionCounterState {
  counterMap: { [key: string]: number };
}

export default function() {
  return (WrappedComponent: React.ComponentType<any>) =>
    class Comp extends React.Component<any, IActionCounterState> {
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

      getActionCount = (action?: string) => {
        const { counterMap } = this.state;

        if (action) {
          return counterMap[action] || 0;
        }

        return Object.keys(counterMap).reduce(
          (accumulator, key) => accumulator + counterMap[key],
          0,
        );
      };

      render() {
        const {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        } = this;

        const ctx = {
          increaseActionCount,
          decreaseActionCount,
          getActionCount,
        };

        return <WrappedComponent {...this.props} {...ctx} />;
      }
    };
}
