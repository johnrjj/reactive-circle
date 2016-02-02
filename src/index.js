// import Rx from 'rx';
import Cycle from '@cycle/core';
import {h, h1, span, makeDOMDriver} from '@cycle/dom';

// source: input (read) effects
// sink: output (write) effects

function main(sources) {
  const mouseoverStream = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM:  mouseoverStream
        .startWith(null)
        .flatMapLatest(() =>
          Rx.Observable.timer(0, 1000)
            .map(i =>
              h1({style: {background: 'red'}}, [ /* virtual dom elements */
                span([
                  `Seconds elapsed: ${i}`
                ])
              ])
            )
        ),
    Log: Rx.Observable.timer(0,2000)
        .map(i => 2*i),
  };
  return sinks;
}

function consoleLogDriver(text) {
  text.subscribe(text => console.log(text));
}

const drivers = {
  DOM: makeDOMDriver('#root'),
  Log: consoleLogDriver,
}

Cycle.run(main, drivers);


//old custom code to learn how cyclejs works...dont want to delete it, for reference.


// custom makeDomDriver, toyDOMDriver, before subbing in actual cyclejs DOM Driver
// function makeDOMDriver(mountSelector) {
//   return function DOMDriver(objStream) {
//     function createElement(obj) {
//       const element = document.createElement(obj.tagName);
//       obj.children
//         .filter(c => typeof c === 'object')
//         .map(createElement)
//         .forEach(c => element.appendChild(c));
//       obj.children
//         .filter(c => typeof c === 'string')
//         .forEach(c => element.innerHTML += c);
//       return element;
//     }
//
//     objStream.subscribe(obj => {
//       const container = document.querySelector(mountSelector);
//       container.innerHTML = '';
//       const element = createElement(obj);
//       container.appendChild(element);
//     });
//     // input from DOM (clicks from user)
//     const DOMSource = {
//       selectEvents: function(tagName, eventType) {
//         // returns obsv of events that happen only on elements that match below
//         return Rx.Observable.fromEvent(document, eventType)
//           .filter(ev => ev.target.tagName === tagName.toUpperCase());
//       }
//     }
//     return DOMSource;
//   }
// }

// old custom html functions
// function html(tagName, children) {
//   return {
//     tagName: tagName,
//     children: children,
//   };
// }
//
// function h1(children) {
//   return {
//     tagName: 'H1',
//     children: children,
//   };
// }
//
// function span(children) {
//   return {
//     tagName: 'SPAN',
//     children: children,
//   };
// }



// custom run implementation without cyclejs library below...

// function makeSinkProxies(drivers) {
//   let sinkProxies = {}
//   for (let name in drivers) {
//     sinkProxies[name] = new Rx.ReplaySubject(1)
//   }
//   return sinkProxies
// }
//
// function callDrivers(drivers, sinkProxies) {
//   let sources = {}
//   for (let name in drivers) {
//     sources[name] = drivers[name](sinkProxies[name])
//   }
//   return sources
// }
//
// function run(main, drivers) {
//   let sinkProxies = makeSinkProxies(drivers)
//   let sources = callDrivers(drivers, sinkProxies)
//   let sinks = main(sources)
//   Object.keys(drivers).forEach(key => {
//     const source = drivers[key](sinks[key]);
//   });
// }

// run(main, drivers);
