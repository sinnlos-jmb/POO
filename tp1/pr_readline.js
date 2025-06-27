const readline = require('readline');
const prompt = require('prompt-sync')();



const name = prompt('What is your name?');
console.log(`Hey there ${name}`);


const rl = readline.createInterface({ input:process.stdin, output:process.stdout });
rl.question('ingrese un numero ', (rta) => {
console.log(`el nro ingresado es: ${rta}`);
rl.close();
});