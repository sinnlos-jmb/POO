const readline = require("readline");  //npm readline
const Ollama = require("./Ollama");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const ollama = new Ollama();

function promptUser() {
	rl.question("🧠 Escribe tu prompt: ", async userPrompt => {
		ollama.setPrompt(userPrompt);
		console.log("\n🤖 Respuesta de Ollama:\n");

		await ollama.getResponse();

		console.log("\n\n✅ Fin de la respuesta.\n");
		rl.close();
	});
}

// Configurar modelo y opciones
ollama.setModel("gemma3:4b"); // phi4-mini:latest "gemma3:1b", "granite3.2:2b", "llama3.2:1b" etc.
ollama.setSystemMessage("Eres un asistente útil.");
ollama.setOptions({ temperature: 0.3, maxTokens: 350, stream: true });

promptUser();