
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync');

async function getNextBusArrivals(){

  //Asking user to input Stop code
  console.log('Please enter the Bus Stop Code: '); 
  const BusStopCode = readline.prompt();
      
  //Fetching Bus Arrivals using Bus StopCode
  const NextBusArrivalsResponse = await fetch('https://api.tfl.gov.uk/StopPoint/'+BusStopCode+'/Arrivals');
  const NextBusArrivalsData = await NextBusArrivalsResponse.json(); 
  
  // Prints only Key information about upcoming buses instead of whole json response

   const UpcomingBuses = [];

   for(let i=0 ; i<5 ; i++){

     let BusInfo = {'Bus Number': NextBusArrivalsData[i].lineName,
                    'Destination Name': NextBusArrivalsData[i].destinationName,
                    'Going Towards': NextBusArrivalsData[i].towards,
                    'Expected Arrival Time': NextBusArrivalsData[i].expectedArrival};
    
     UpcomingBuses.push(BusInfo);
   }

   
console.log(UpcomingBuses); 
                        
}
getNextBusArrivals();
