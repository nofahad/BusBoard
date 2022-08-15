
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline-sync')


async function getNextBusArrivals(BusStopCode){
        
    //Fetching Bus Arrivals using Bus StopCode
    try {
      const NextBusArrivalsResponse = await fetch('https://api.tfl.gov.uk/StopPoint/' + BusStopCode + '/Arrivals');
      if (NextBusArrivalsResponse.ok) {
        const NextBusArrivalsData = await NextBusArrivalsResponse.json();
  
        // Prints only Key information about upcoming buses instead of whole json response
  
        const UpcomingBuses = [];
  
        for (let i = 0; i < 5; i++) {
  
          let BusInfo = {
            'Bus Number': NextBusArrivalsData[i].lineName,
            'Destination Name': NextBusArrivalsData[i].destinationName,
            'Going Towards': NextBusArrivalsData[i].towards,
            'Expected Arrival Time': NextBusArrivalsData[i].expectedArrival
          };
  
          UpcomingBuses.push(BusInfo);
        }
        console.log(UpcomingBuses);
  
      } else throw ('Error');
  
    } catch (err) {
      console.log(err);
    }
  }  
async function getStopPointsWithinRadius(PostCode){


    console.log('\nPlease enter your search radius:');
    const radius = readline.prompt();

    //Fetching the coordinates for the given postcode
    const  PostCodeResponse= await fetch(`http://api.postcodes.io/postcodes/${PostCode}`);
    const PostCodeData = await PostCodeResponse.json(); 
    const { longitude, latitude } = PostCodeData.result;
    
    //Passing the coordinates to get Stops within the Radius
    const StopRadiusResponse = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`) 
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

async function JourneyPlannerDirections(StartPostCode,DestinationPostCode){

  //Fetching the directions to the nearest BusStop
  const  DirectionResponse= await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${StartPostCode}/to/${DestinationPostCode}`);
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

//Function to get valid postcodes as input
async function ValidatePostCodes(){
  
  do{ 
    
    try {
      //console.log('Please enter a PostCode: '); 
      PostCode = readline.prompt();
      Response= await fetch(`http://api.postcodes.io/postcodes/${PostCode}`);
      Data = await Response.json(); 
      //console.log(Data)
      if (Data.status === 404)     
      
        throw "The PostCode you entered in Invalid !!!";
                 
    }
    catch(error) {
      console.log(error);
    }
  }while(Data.status === 404);

}

//Journey Planner
async function JourneyPlanner(){
  console.log('Please enter the Starting PostCode: ');
  const PostCode1 = await ValidatePostCodes();
  
  console.log('Please enter the Destination PostCode: '); 
  const PostCode2 = await ValidatePostCodes();
  
  console.log('Do You want the directions to the nearest Bus Stop (Y/N): '); 
  const Response = readline.prompt();

  if(Response.toString().toUpperCase() === 'Y'){

    await JourneyPlannerDirections(PostCode1,PostCode2);
    await getStopPointsWithinRadius(PostCode1);

  }else{

    await getStopPointsWithinRadius(PostCode1);
    
  }
}

JourneyPlanner()