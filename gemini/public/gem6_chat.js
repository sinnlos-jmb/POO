document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHistory = document.getElementById('chatHistory');
    const temperatureInput = document.getElementById('temperature');
    const modelSelect = document.getElementById('model');

    let conversationHistory = [];

    const sendUserMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        userInput.value = '';
        sendBtn.disabled = true;

        conversationHistory.push({ role: 'user', parts: [{ text: message }] });

        try {
            const response = await fetch('http://localhost:3060/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: message, // For single-turn compatibility if needed
                    history: conversationHistory,
                    temperature: parseFloat(temperatureInput.value),
                    model: modelSelect.value,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiResponse = '';
            const aiMessageElement = appendMessage('ai', '');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                aiResponse += decoder.decode(value, { stream: true });
                aiMessageElement.textContent = aiResponse;
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }

            conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });

        } catch (error) {
            console.error('Fetch error:', error);
            appendMessage('ai', `Error: ${error.message}`);
        } finally {
            sendBtn.disabled = false;
        }
    };

    const appendMessage = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return messageElement;
    };

    sendBtn.addEventListener('click', sendUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
});