# TrainSchedule
### Overview
Created a train schedule application that incorporates Firebase to host arrival and departure data. The app retrieves and manipulates this information and renders it on the page. This application provides up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.
### Instructions
* When adding trains, clients are able to do input the following:
  * Train Name
  * Destination 
  * First Train Time -- in military time
  * Frequency -- in minutes
* The app calculates when the next train will arrive; this is relative to the current time.
* Users from many different machines are able to view the same train times.
### Bonus (Extra Features)

* The "minutes to arrival" and "next train time" text are updated once every minute. This is done by incorporating a SetInterval into the app.
* There are `update` and `remove` buttons for every train. Clients are able to edit the row's elements-- they can change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).
