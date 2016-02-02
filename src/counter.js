import Cycle from '@cycle/core';
import {button, p, label, span, div, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  const decrementClick$ = sources.DOM
    .select('.decrement').events('click');
  const incrementClick$ = sources.DOM
    .select('.increment').events('click');
  // give meaning to click stream (action basically)
  const decrementAction$ = decrementClick$.map(ev => -1);
  const incrementAction$ = incrementClick$.map(ev => +1);
  // Rx flow...
  // 10------------------ (observable of 10)
  // ------(-1)---(-1)--- (decrementactionstream)
  // 10-----(-1)---(-1)-- (merge)
  // 10-----9-------8---- (scan)
  // value of number over time
  const number$ = Rx.Observable.of(10)
    .merge(decrementAction$).merge(incrementAction$)
    .scan((previousValue, currentValue) => previousValue + currentValue);

  const sinks = {
    DOM: number$.map(number =>
      div([
        button('.decrement', ['Decrement']),
        button('.increment', ['Increment']),
        p([
          label(String(number))
        ]),
      ])
    )
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#root'),
}

Cycle.run(main, drivers);
