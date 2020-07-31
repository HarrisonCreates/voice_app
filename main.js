if (annyang) {
  // Let's define a command.
  const commands = {
    'good morning': turn_on_lights,
    'turn lights on': turn_on_lights,
    'turn lights off': turn_off_lights,
    'good night': turn_off_lights
  };

  // Add our commands to annyang
  annyang.addCommands(commands);
}

function report_error(e){
  console.log(e);
}

function turn_on_lights(){
  console.log("Turning on lights...");
  //Ajax calls would go here...
}

function turn_off_lights(){
  console.log("Turning off lights...");
  //Ajax calls would go here...
}

document.querySelector('.mic').addEventListener('click', (e) => {
  annyang.start();
  console.log("Listening: " + annyang.isListening());
});

annyang.addCallback('error', function() {
  console.log("An error occurred...");
});

annyang.addCallback('errorNetwork', report_error, this);

annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
  console.log(userSaid); // sample output: 'hello'
  console.log(commandText); // sample output: 'hello (there)'
  console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
});
