function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  var settings = "a/csumb.edu";
  var temp_url = url.substring(0, 26) + settings + url.substring(25);
  return temp_url;
}

function doGet(e) {
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('dashboard').evaluate().setTitle('GAAME');
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate().setTitle('GAAME');
}

function userAddEntry(aname, course, duedate, milestones) {
  var userEmail = getEmail();
  var calendar = CalendarApp.getCalendarsByName(userEmail)[0];
  var event = calendar.createEvent(aname + ": is Due Today", new Date(duedate),new Date(duedate));
 
  for (index = 0; index < milestones.length; index += 2) {
    event = calendar.createEvent(aname + ':' + milestones[index], new Date(milestones[index+1]),new Date(milestones[index+1]));
  }
  
  return 1357;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

function getEmailString() {
  return JSON.stringify(Session.getActiveUser().getEmail());
}

function getProfilePic() {
  var profile = People.People.get('people/me', {
    personFields: 'photos'
  });
  
  return profile["photos"][0]["url"]; 
}

function getValuesFromForm(form){
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  var duedate = form["duedate"] + " " + form["duedatetime"];
  ws.appendRow([getEmail(), form["title"], form["course"], form["url"], duedate , form["milestone1"], form["date1"],
                  form["milestone2"], form["date2"], form["milestone3"], form["date3"], form["milestone4"], form["date4"], form["milestone5"], form["date5"]]);
  ws.getRange(ws.getLastRow(), 16, 1, 5).insertCheckboxes();
  ws.getRange(ws.getLastRow(), 21, 1, 1).setValue("FALSE");
  //ws.getActiveRange().appendinsertCheckboxes();
}

function getColumnsFromSheet() {
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  
  var values = ws.getDataRange().getValues();
  return JSON.stringify(values);
}

function deleteAssignByRow(rowId) {
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  ws.deleteRow(rowId); 
  
  return 1; 
}

/**
 * Sets the value of the checkbox in the spreasheet when the user toggles a checkbox
 * @Returns array of course assignment's title, course name, followed by milestones, milestone checkbox statuses
 */
function getMilestones(title, course) {
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  var milestones = [];
  var studentEmail = Session.getActiveUser().getEmail();
  var values = ws.getDataRange().getValues();
  //var courses = JSON.parse(values) || [];
  for(var i = 0; i < values.length;i++){
    if (values[i][0] === studentEmail && values[i][2] === course && values[i][1] === title) {
        var current_row = values[i];
        milestones = [values[i][1], values[i][2], current_row[5], current_row[7], current_row[9], current_row[11], 
        current_row[13], current_row[15], current_row[16], current_row[17], current_row[18], current_row[19]];
        
        Logger.log(milestones);
    }
  }
  
  
  return JSON.stringify(milestones); 
}

/**
 * Sets the value of the checkbox in the spreasheet when the user toggles a checkbox
 * @Returns the status of true when a checkbox is checked or false if it is not checked.
 */

function setMilestones(milestoneid, assignmentTitle, course){
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  var milestone = [];
  var studentEmail = Session.getActiveUser().getEmail();
  console.log(studentEmail);
  var values = ws.getDataRange().getValues();
  var isCheckFalse = true;
  //var mid = milestoneid + 14;
  //var milestoneid = pasreInt(assignmentId.charAt(assignmentId.length - 1));
  //var status;
  //var courses = JSON.parse(values) || [];
  for(var i = 0; i < values.length;i++){
    if (values[i][0] === studentEmail && values[i][2] === course && values[i][1] === assignmentTitle) {
        var current_row = values[i];
        // milstone ids
        // 2 3 4 5 6
        //var status =   ws.getRange( i + 1, 16, 1, 5).insertCheckBoxes(); // selects all five checkboxes
         var status = ws.getRange( i + 1, milestoneid + 14 , 1, 1); // seclect one cell - chnage the second parametr to change milestone within same row
         if (!status.isChecked()) {
           status.setValue('TRUE');
         } else {
           status.setValue('FALSE');
         }
         Logger.log(status.isChecked());
    }
  }
  
  
  return status.isChecked(); 
}


// set late status
function setLateStatus(assignmentTitle, course, isLate){
  var id = "1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0";
  var ss = SpreadsheetApp.openById(id);
  var ws = ss.getSheetByName("Assignments");
  var milestone = [];
  var studentEmail = Session.getActiveUser().getEmail();
  
  var values = ws.getDataRange().getValues();
  var isCheckFalse = true;
  for(var i = 0; i < values.length;i++){
    if (values[i][0] === studentEmail && values[i][2] === course && values[i][1] === assignmentTitle) {
        var current_row = values[i];
        // milstone ids
        // 2 3 4 5 6
        var current_row = values[i];
        milestones = [values[i][1], values[i][2], current_row[5], current_row[7], current_row[9], current_row[11], 
        current_row[13], current_row[15], current_row[16], current_row[17], current_row[18], current_row[19]];
        var doneStatus =  current_row[15] == true && current_row[16] == true && current_row[17] == true && current_row[18] == true && current_row[19] == true
       
        //var status =   ws.getRange( i + 1, 16, 1, 5).insertCheckBoxes(); // selects all five checkboxes
         var latestatus = ws.getRange( i + 1, 21 , 1, 1); // seclect one cell - chnage the second parametr to change milestone within same row
         if (isLate === true && doneStatus == false) { // if it's past deadline and milstones not all all checked off, mark late as true
           latestatus.setValue('TRUE');
         } else {
           latestatus.setValue('FALSE');
         }
         //Logger.log(latestatus.val);
    }
  }
  
  
  return latestatus.getValue(); 
}






/**
 * Returns the ID and name of every task list in the user's account.
 * @return {Array.<Object>} The task list data.
 */
function getTaskLists() {
  var taskLists = Tasks.Tasklists.list().getItems();
  if (!taskLists) {
    return [];
  }
  return taskLists.map(function(taskList) {
    return {
      id: taskList.getId(),
      name: taskList.getTitle()
    };
  });
}

/**
 * Returns information about the tasks within a given task list.
 * @param {String} taskListId The ID of the task list.
 * @return {Array.<Object>} The task data.
 */
function getTasks(taskListId) {
  var tasks = Tasks.Tasks.list(taskListId).getItems(); 
  if (!tasks) {
    return [];
  }
  return tasks.map(function(task) {
    return {
      id: task.getId(),
      title: task.getTitle(),
      notes: task.getNotes(),
      completed: Boolean(task.getCompleted())
    };
  }).filter(function(task) { 
    return task.title
  });
}

/**
 * Sets the completed status of a given task.
 * @param {String} taskListId The ID of the task list.
 * @param {String} taskId The ID of the task.
 * @param {Boolean} completed True if the task should be marked as complete, false otherwise.
 */
function setCompleted(taskListId, taskId, completed) {
  var task = Tasks.newTask();
  if (completed) {
    task.setStatus('completed');
  } else {
    task.setStatus('needsAction');
    task.setCompleted(null);
  }
  Tasks.Tasks.patch(task, taskListId, taskId);
}

/**
 * Adds a new task to the task list.
 * @param {String} taskListId The ID of the task list.
 * @param {String} title The title of the new task.
 */
function addTask(taskListId, title, notes = "") {
  var task = Tasks.newTask().setTitle(title);
  task.notes = notes + " Eisenhower Matrix Score";
  Tasks.Tasks.insert(task, taskListId);
}

function sendEmail(recipient, subject, message) {
  MailApp.sendEmail(recipient, subject, message);

  return 1;   
}

function deleteTask(taskListId, taskId) {
  Logger.log(taskListId);
  Logger.log(taskId);
  Tasks.Tasks.remove(taskListId, taskId);
}

function getCalendarBusyDays(){
  var startDate= new Date();
  var endDate = new Date(new Date().setYear(startDate.getFullYear()+1));
 
  var userEmail = getEmail();
  var calendar = CalendarApp.getCalendarsByName(userEmail)[0];
  var events = calendar.getEvents(startDate, endDate);

  // we are checking if the timestamp is in the array, if not we add it to the array
  var days = events.map(function(e){return e.getStartTime().setHours(0,0,0,0); });
  
  var days1 = events.map(function(e){return e.getStartTime(); });
  var uniqueDays= [];
  
  days.forEach(function(d){
    if(uniqueDays.indexOf(d) === -1){
      uniqueDays.push(d);
    }
    //if(!uniqueDays){
      // $('.datepicker-day-button').addClass("disabled");
    //}
     
  }); 
  
  return uniqueDays;
}

function startHours(){
  var startDate= new Date();
  var endDate = new Date(new Date().setYear(startDate.getFullYear()+1));
  
  var userEmail = getEmail();
  Logger.log(userEmail);
  var calendar = CalendarApp.getCalendarsByName(userEmail)[0];
  var events = calendar.getEvents(startDate, endDate);

  // we are checking if the timestamp is in the array, if not we add it to the array
  var dates = events.map(function(e){return e.getStartTime().toString();});

  return dates;
}

function getEvents() {
  var date= (new Date());
  
  var startDate = (date.setMonth(date.getMonth() - 1));
  var startISO = new Date(startDate).toISOString();

  var endDate = date.setMonth(date.getMonth()  + 3);
  var endISO = new Date(endDate).toISOString();
  
  var calendarId = 'primary';
  var optionalArgs = {
    timeMin: startISO,
    timeMax: endISO,
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  };
  var response = Calendar.Events.list(calendarId,optionalArgs);
  var events = response.items;
  if (events.length > 0) {
    var fcEvents = [];
    for (i = 0; i < events.length; i++) {
      var event = events[i];      

      fcEvents.push({
        id: event.id,
        title: event.summary,
        backgroundColor: event.colorId,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        url: event.htmlLink,
        location: event.location,
        description: event.description
      });      
      
    }
    return fcEvents
  } else {
    Logger.log('No events found.');
  }
}



// FACULTY TEAM COURSE CODE BELOW 


//********************************************************************************************************
//                                  FUNCTION TO SET UP THE WEBPAGE                                       *
//********************************************************************************************************
//function doGet(e) {  
 //return HtmlService.createTemplateFromFile('courses').evaluate();
//}

//********************************************************************************************************
//                              FUNCTION TO INCLUDE CSS AND SCRIPT FILE                                  *
//********************************************************************************************************
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

//********************************************************************************************************
//                          FUNCTION TO GET ALL THE COURSES A STUDENT IS TAKING                          *
//********************************************************************************************************
function getCourses(){

  //GETTING STUDENTS EMAIL
  var studentEmail = Session.getActiveUser().getEmail();
  
  //ARRAY OF COURSES STUDENT IS TAKING
  var courseArray = [];
  
  //GETTING DATA BASE AND ITS INFORMATION
  var master = SpreadsheetApp.openById("1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0");
  var sheet = master.getSheetByName("Assingments");
  var numRows = sheet.getLastRow();
  var data = sheet.getRange(1,7, numRows).getValues();
  var len = data.length
  
  //CHECKING IF THE COURSESECTION IS FOUND IN DATABASE
  for(var i = len-1 ; i >0 ; i--){
    sheet = master.getSheetByName(data[i][0]);
    //CALLING 'checkStudent' FUNCTION
    if(checkStudent(sheet,studentEmail) == true){
      var len = courseArray.length
      var found = false
      //CHECKING IF COURSE IS NOT ALREADY IN ARRAY
      for(var x = 0; x < len; x++){
        if(courseArray[x] == data[i][0]){
          found = true;
        }
      }
      if(found == false){
        courseArray.push([data[i][0]]);
      }
    }
  }
  return courseArray;
}

//********************************************************************************************************
//                      FUNCTION THAT WILL CHECK IF THE STUDENT IS FOUND IN THAT COURSE                  *
//********************************************************************************************************
function checkStudent(sheet,studentEmail){
  
  var numRows = sheet.getLastRow();
  var numColumns = sheet.getLastColumn();
  var emaildata = sheet.getRange(1,1,numRows,numColumns).getValues();
  var emailLen = emaildata.length;
  
  
  //CHECK WHAT ROW THE STUDENT IS ON
  var studentRow = -1;
  for(var i = emailLen-1; i > 0 ; i--){  
    if(emaildata[i][2] == studentEmail){
      return true;
    }
  }
  return false;
}

//********************************************************************************************************
//                      FUNCTION TO GET THE ASSIGNMENTS THAT CORRELATE WITH THE COURSE                   *
//********************************************************************************************************
function getAssignments(courseSection){  
  var master = SpreadsheetApp.openById("1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0");
  var sheet = master.getSheetByName("Assingments");
  var numRows = sheet.getLastRow();
  var numColumns = sheet.getLastColumn();
  var data = sheet.getRange(1,1, numRows,numColumns).getValues();
  var len = data.length
  
  var date = Utilities.formatDate(new Date(), "GMT+1", "MM/dd/yyyy");
  var assignmentInfo = "";
  var AssignmentList = [];
    
  //*********** DATE CHECKER TO SEE IF ASSIGNMENT ALREADY PASSED ***********
  for(var i = len - 1 ; i > 0 ; i--){
    if(courseSection == data[i][6]){
      var dueDate = Utilities.formatDate(data[i][5], "GMT+1", "MM/dd/yyyy");
      assignmentInfo = data[i][2] + " - "+data[i][6]+ " - "+dueDate
      AssignmentList.push([assignmentInfo]);
    }
  }
  
  return AssignmentList
}

//********************************************************************************************************
//                      FUNCTION TO GET THE INSTRUCTOR LINK AND RETURN IT FOR DISPLAY                    *
//********************************************************************************************************
function getInstructorLink(AssignmentName,courseSection,dueDate){
  
  var master = SpreadsheetApp.openById("1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0");
  var sheet = master.getSheetByName("Assingments");
  var numRows = sheet.getLastRow();
  var numColumns = sheet.getLastColumn();
  var data = sheet.getRange(1,1, numRows,numColumns).getValues();
  var len = data.length
    
  var instructorLink = "";
  
  
  for(var i = len - 1 ; i > 0 ; i--){
    var sheetDate = Utilities.formatDate(data[i][5], "GMT+1", "MM/dd/yyyy");
    if(AssignmentName == data[i][2] && courseSection == data[i][6] && dueDate == sheetDate){
      instructorLink = data[i][3];
      return instructorLink;
    }
  }
  return instructorLink;
}

//********************************************************************************************************
//                              FUNCTION TO SET STUDENT AS VIEWED                                        *
//********************************************************************************************************
function storeStudentViewed(instructorLink,assignmentName,CourseSectionName, dueDate){
  var studentEmail = Session.getActiveUser().getEmail();
  
  var master = SpreadsheetApp.openById("1ZTBkSj5Mqpn8WMCZXeg3gHh8EehHXZ3m0NJURoOSqp0");
  var sheet = master.getSheetByName(CourseSectionName); 
  
  var numColumns = sheet.getLastColumn();
  var data = sheet.getRange(1,1,1,numColumns).getValues();
  var len = data[0].length;
  
  //CHECK WHAT COLUMN ASSIGNMENT IS ON
  var assingmentColumn = 0;
  for(var i = len-1; i >= 0 ; i--){  
    Logger.log(data[0][i]);
    if(assignmentName == data[0][i]){
      assingmentColumn = i+1;
      Logger.log("ASSIGNMENT COLUMN: "+assingmentColumn);
      break;
    }
  }
  
  var numRows = sheet.getLastRow();
  var emaildata = sheet.getRange(1,1,numRows,numColumns).getValues();
  var emailLen = emaildata.length;
  Logger.log("EMAIL LEN: "+ emailLen);
  
  //CHECK WHAT ROW THE STUDENT IS ON
  var studentRow = 0;
  for(var i = emailLen-1; i > 0 ; i--){  
    if(emaildata[i][2] == studentEmail){
      studentRow = i + 1;
      Logger.log("STUDENT ROW: "+studentRow)
    }
  }
  
  //UPDATING DATES WHEN STUDENT VIEW DOCUMENT
  
  var setViewed = sheet.getRange(studentRow,assingmentColumn).getValue();
  var date = Utilities.formatDate(new Date(), "GMT+1", "MM/dd/yyyy");
  if(setViewed == ""){
    setViewed = "VIEWED - "+ date;
    Logger.log(setViewed);
    sheet.getRange(studentRow,assingmentColumn).setValue(setViewed);
  }
  else{
    var lastDate = setViewed.slice(-10);
    Logger.log(lastDate);
    
    if(lastDate != date){
      var addDate = setViewed + ", "+date;
      sheet.getRange(studentRow,assingmentColumn).setValue(addDate);
    }
  }
  
}

function newTaskList(taskList) {
  var taskList = Tasks.newTaskList().setTitle(taskList);
  Tasks.Tasklists.insert(taskList);
}





