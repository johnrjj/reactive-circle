import Rx from 'rx';

//functional
function main(DOMSource) {
  const click = DOMSource;
  return {
    DOM:  click
        .startWith(null)
        .flatMapLatest(() =>
          Rx.Observable.timer(0, 1000)
            .map(i => `seconds elapsed ${i}`)
        ),
    Log: Rx.Observable.timer(0,2000)
        .map(i => 2*i),
  };
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
  const proxyDOMSource = new Rx.Subject(); //rx observable that has nothing happening that we can modify later
  const sinks = mainFn(proxyDOMSource);
  const DOMSource = drivers.DOM(sinks.DOM);
  DOMSource.subscribe(click => proxyDOMSource.onNext(click)); //onnext pushes event to proxy observable
  // Object.keys(drivers).forEach(key => {
  //   drivers[key](sinks[key]);
  // });
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

run(main, drivers);
