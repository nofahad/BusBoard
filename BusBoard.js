
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')

async function getNextBusArrivals(){

  console.log('Please enter the Bus Stop Code: '); 
  const BusStopCode = readline.prompt();
      
  const NextBusArrivalsResponse = await fetch('https://api.tfl.gov.uk/StopPoint/'+BusStopCode+'/Arrivals') 
  const NextBusArrivalsData = await NextBusArrivalsResponse.json(); 
  console.log(NextBusArrivalsData);
                        
}
getNextBusArrivals();
