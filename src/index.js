import Rx from 'rx';

//functional
function main(sources) {
  const click = sources.DOM;
  const sinks = {
    DOM:  click
        .startWith(null)
        .flatMapLatest(() =>
          Rx.Observable.timer(0, 1000)
            .map(i => `seconds elapsed ${i}`)
        ),
    Log: Rx.Observable.timer(0,2000)
        .map(i => 2*i),
  };
  return sinks;
}

// source: input (read) effects
// sink: output (write) effects

//imperative
function DOMDriver(text) {
  text.subscribe(text => {
    const container = document.querySelector('#root');
    container.textContent = text;
  });

  // input from DOM (clicks from user)
  const DOMSource = Rx.Observable.fromEvent(document, 'click');
  return DOMSource;
}

//imperative
function consoleLogDriver(text) {
  text.subscribe(text => console.log(text));
}


function run(mainFn, drivers) {
  const proxySources = {};
  //create a source for each driver
  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject();
  });
  const sinks = mainFn(proxySources);
  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key]);
    source.subscribe(x => proxySources[key].onNext(x)); //feed event
  });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

run(main, drivers);
