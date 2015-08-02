var EVENT_NAME = 'free time'
var NUM_DAYS_TO_SCHEDULE = 1
var MINUTES_BETWEEN_EVENTS = 5


// These are all +1 from what you would normally expect, because getRange is one based.
// TODO(geoff): these should probably be figured out on the fly, and not hardcoded.
var PRIORITY_COL = 1
var PROJECT_COL = 2
var TOPIC_COL = 3
var DUR_COL = 4
var COMPLETE_COL = 5
var DESCRIPTION_COL = 6

// Some constants used here and there.
var NUM_HEADER_ROWS = 1
var TOTAL_COLS = 7

function main() {
  // Sort the data.
  sortAndReWrite()
  // Figure the events.
  var freeTimes = getFreeTimes()
  // Schedule them.
  scheduleFreeTime(freeTimes)
}

function scheduleFreeTime(freeTimes){
  
  var sheet = SpreadsheetApp.getActiveSheet();
  // Get the projects, and at this point we know it should be sorted.
  var data = sheet.getRange(NUM_HEADER_ROWS + 1, 1, sheet.getLastRow() - NUM_HEADER_ROWS, TOTAL_COLS).getValues();
  
  for(i in freeTimes){
    var freeTime = freeTimes[i]
    var start = freeTime.getStartTime().getTime()
    var end = freeTime.getEndTime().getTime()
    // Iterate over all the projects, and try to fill them with the highest priorty projects first. 
    for(j in data){
      // If we have hit completed projects, we know that we have tried all the uncompleted projects.
      if(data[j][COMPLETE_COL-1]=='t'){
        break
      }
      var eventDuration = data[j][DUR_COL-1] * 60 * 1000
      if(start + eventDuration < end){
        createEvent(start, start+eventDuration,  data[j])
        start = start + eventDuration + (MINUTES_BETWEEN_EVENTS  * 60 * 1000)
      }
    }
    freeTime.deleteEvent()
  }

}

function createEvent(startTime, endTime,  dataEntry){ 
  CalendarApp.getDefaultCalendar().createEvent(
    dataEntry[PROJECT_COL - 1],
     new Date(startTime),
     new Date(endTime),
     {description: dataEntry[DESCRIPTION_COL - 1]});
}

// Get the events between (now, now + NUM_DAYS_TO_SCHEDULE) labeled EVENT_NAME
function getFreeTimes(){
 var now = new Date();
 var numDaysFromNow = new Date(now.getTime() + (NUM_DAYS_TO_SCHEDULE* 24 * 60 * 60 * 1000));
 var events = CalendarApp.getDefaultCalendar().getEvents(now, numDaysFromNow,
     {search: EVENT_NAME});
  return events
}

function sortAndReWrite(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var header = sheet.getRange(NUM_HEADER_ROWS , 1, NUM_HEADER_ROWS, TOTAL_COLS).getValues()
  var data = sheet.getRange(NUM_HEADER_ROWS + 1, 1, sheet.getLastRow() - NUM_HEADER_ROWS, TOTAL_COLS).getValues();
  data.sort(projectComparator)
  sheet.clearContents();
  everything = header.concat(data)
  sheet.getRange(1, 1, everything.length, everything[0].length).setValues(everything);
}


// sorts two projects by completeness (with uncompleted projects coming first), then by priorty (with high priorty first)
// and then finally by name.
function projectComparator(a,b){
  
  if(a[COMPLETE_COL-1] != b[COMPLETE_COL-1]){
    // we want to compare t and f, but in reverse order.
    return a[COMPLETE_COL-1] < b[COMPLETE_COL-1] ? - 1 : a[COMPLETE_COL-1] > b[COMPLETE_COL-1] ?  1 : 0;
  }
  
  if(a[PRIORITY_COL-1] != b[PRIORITY_COL-1]){
    return b[PRIORITY_COL-1] - a[PRIORITY_COL-1]
  }
  
  return a[PROJECT_COL-1] < b[PROJECT_COL-1] ? -1 : a[PROJECT_COL-1] > b[PROJECT_COL-1] ? 1 : 0;
}
