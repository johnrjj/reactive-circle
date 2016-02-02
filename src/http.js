import Cycle from '@cycle/core';
import {button, h1, h4, a, div, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

function main(sources) {
  const clickEvent$ = sources.DOM
    .select('.get-first').events('click');

  const request$ = clickEvent$.map(() => {
    return {
      url: 'http://jsonplaceholder.typicode.com/users/1',
      method: 'GET',
    };
  });

  // stream that emits response streams
  // -----r--------------r-----------------
  //      \____a_        \____b__
  const response$$ = sources.HTTP
    .filter(response$ => response$.request.url ===
      'http://jsonplaceholder.typicode.com/users/1');

  const response$ = response$$.switch();
  const firstUser$ = response$.map(response => response.body)
    .startWith(null);

  const sinks = {
    DOM: firstUser$.map(firstUser =>
      div([
        button('.get-first', 'Get first user'),
        firstUser === null ? null : div('user-details', [
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', {href:firstUser.website}, firstUser.website),
        ])
      ])
    ),
    HTTP: request$,

  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  HTTP: makeHTTPDriver(),
}

Cycle.run(main, drivers);


// Notes: 
// DOM Read effect: Button click
// HTTP Write: Request sent
// HTTP Read: Response received
// DOM Write effect: Data display
//Remember: write effects - sinks
//          read effects - comes from sources
