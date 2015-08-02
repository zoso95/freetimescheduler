# freetimescheduler
A simple script to help you use your free time better. What this does is you create a TODO list, and this script will go into your calendar, find 'free time' and schedule your projects during those events. 

To use this do the following steps.

1. Create a Google spreadsheet that contains the row headers "Priority,Project,Topic, Total size,Completed,Description". Priority is a number that will be used to schedule the more important projects first. Project is the project name, and what the entry will appear as in your calendar. Topic is what kind of project this is (doesn't do anything). Total size is the duration in minutes you want to work on it in any given sitting. Complete is either t or f, and this indicates if this should be scheduled or not. Description will be what pops up in your calendar event description. 
2. Populate that list
3. Tools -> Script Editor, and copy the script there. And then go Resources -> Current Projects Trigger, and add a trigger to main, everyday around 3-4 am. 
4. Go into your calendar and create events named 'free time' (without the '). Typically the easiest to make recurring events.
5. All done!
