import Cycle from '@cycle/core';
import {label, input, h1, hr, span, div, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  //Restricts interest in input elements
  //Returns an observable of input events happening on that field (input dom events)
  const inputEv$ = sources.DOM.select('.fieldclass').events('input');
  // Get each event, get target (actual dom element), get string inside element
  const name$ = inputEv$.map(ev => ev.target.value).startWith(''); //needs a start with so name$ not empty
  // every time the user makes change, create a new dom elem
  const sinks = {
    DOM: name$.map(name =>
      div([
        label('Name:'),
        input('.fieldclass', {type: 'text'}),
        hr(),
        h1(`Hello ${name}!`),
      ])
    )
  }
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#root'),
}

Cycle.run(main, drivers);
