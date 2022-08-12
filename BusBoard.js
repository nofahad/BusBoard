
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

    for(let i=0; i<2; i++){

      const BusStopCode = StopRadiusData.stopPoints[i].naptanId; //Getting Bus Stop Code from Stops Within Radius Data
      
      //Printing Bus Arrival Info by calling getNextBusArrivals Function
      console.log('Next Bus Arrival Info for Bus Stop Code ' + StopRadiusData.stopPoints[i].naptanId + ' near ' + PostCode)
      await getNextBusArrivals(BusStopCode);
    }
     
}

// Display Direction to the Nearest stop using journey planner

async function JourneyPlannerDirections(){

  console.log('Please enter the Starting PostCode: '); 
  const PostCode1 = readline.prompt();
  
  console.log('Please enter the Destination PostCode: '); 
  const PostCode2 = readline.prompt();
  
  //Fetching the directions to the nearest BusStop

  const  DirectionResponse= await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${PostCode1}/to/${PostCode2}`);
  const DirectionData = await DirectionResponse.json(); 
  const Detail = DirectionData.journeys[0].legs[0].instruction.detailed;
  const Directions = DirectionData.journeys[0].legs[0].instruction;

  //Prints where to go to reach nearest Bus Stop
  console.log(`To go to the nearest Bus Stop : ${Detail}`);

  //Prints the Direction to the nearest Bus Stop
  console.log(`\nTo ${Detail} . Follow these directions: `)
  for(let i=0; i<Directions.steps.length; i++){
     console.log(Directions.steps[i].descriptionHeading + Directions.steps[i].description);
  }
  

}

JourneyPlannerDirections()


