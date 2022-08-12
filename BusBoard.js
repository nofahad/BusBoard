
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')


async function getNextBusArrivals(BusStopCode){
        
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

//Find Two Stop Points within Radius and Print Next Bus Arrivals for them

async function getStopPointsWithinRadius(){

    console.log('Please enter the PostCode: '); 
    const PostCode = readline.prompt();
    
    //Fetching the coordinates for the given postcode
    const  PostCodeResponse= await fetch('http://api.postcodes.io/postcodes/'+PostCode);
    const PostCodeData = await PostCodeResponse.json(); 
    const {longitude, latitude}= PostCodeData.result;
    
    //Passing the coordinates to get Stops within the Radius
    const StopRadiusResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram`) 
    const StopRadiusData = await StopRadiusResponse.json();    
    //console.log(StopRadiusData);

    //Print Next Bus Arrival Info for Two Stop Points Within Radius

    for(let i=0; i<1; i++){
      const BusStopCode = StopRadiusData.stopPoints[i].naptanId; //Getting Bus Stop Code from Stops Within Radius Data
      console.log('Next Bus Arrival Info for Bus Stop Code ' + StopRadiusData.stopPoints[i].naptanId + ' near ' + PostCode)
      getNextBusArrivals(BusStopCode);
    }
     
}



getStopPointsWithinRadius();

