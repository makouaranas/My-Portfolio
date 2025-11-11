// Chatbot with AI integration - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotBox = document.getElementById('chatbotBox');
    const closeChatbot = document.getElementById('closeChatbot');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // API Key
    const API_KEY = "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";

    // Chat context to maintain conversation history
    let chatContext = [
        {
            role: "system",
            content: `You are a helpful assistant for Anas Makouar's portfolio website. 
            You should know that:
            - Anas Makouar is a Software Engineer & Full Stack Developer from Morocco
            - He specializes in web and application development
            - His email is makouaranass@gmail.com
            - He's skilled in React, Node.js, Python, and other technologies
            - He's currently pursuing a Master's in Electrical Engineering and Embedded Systems
            Keep responses concise and friendly. If asked about contact, provide the email address.`
        }
    ];

    // Toggle chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotBox.classList.toggle('active');
        if (chatbotBox.classList.contains('active')) {
            userInput.focus();
        }
    });

    // Close chatbot
    closeChatbot.addEventListener('click', () => {
        chatbotBox.classList.remove('active');
    });

    // Send message function
    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message !== '') {
            addMessage('user', message);
            
            chatContext.push({
                role: "user",
                content: message
            });
            
            userInput.value = '';
            showTypingIndicator();
            getAIResponse();
        }
    }

    sendMessage.addEventListener('click', sendUserMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Add message to chat UI
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const icon = document.createElement('i');
        icon.className = type === 'user' ? 'fas fa-user' : 'fas fa-robot';
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(messageText);
        chatbotMessages.appendChild(messageDiv);
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<i class="fas fa-robot"></i><p>Typing...</p>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = chatbotMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Get AI response using OpenRouter API
    async function getAIResponse() {
        try {
            console.log('Sending request to OpenRouter...');
            
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Portfolio Chatbot'
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: chatContext
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response:', textResponse);
                throw new Error('Received HTML instead of JSON. API may be down or key is invalid.');
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.error?.message || `API returned status ${response.status}`);
            }
            
            removeTypingIndicator();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                
                chatContext.push({
                    role: "assistant",
                    content: aiResponse
                });
                
                addMessage('bot', aiResponse);
            } else {
                console.error('Invalid response structure:', data);
                throw new Error('Invalid API response structure');
            }
        } catch (error) {
            console.error('Full error:', error);
            removeTypingIndicator();
            
            let errorMessage = 'Sorry, I encountered an error. ';
            
            if (error.message.includes('HTML') || error.message.includes('JSON')) {
                errorMessage += 'The API key might be invalid or expired. Please check the console for details.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Cannot connect to the AI service. Please check your internet connection.';
            } else {
                errorMessage += error.message;
            }
            
            addMessage('bot', errorMessage);
        }

        // Limit context size
        if (chatContext.length > 10) {
            chatContext = [
                chatContext[0],
                ...chatContext.slice(-9)
            ];
        }
    }
});

// Add typing animation
const style = document.createElement('style');
style.textContent = `
    .typing-indicator p {
        display: flex;
        align-items: center;
    }
    .typing-indicator p::after {
        content: '...';
        width: 20px;
        animation: typing 1.5s infinite;
        margin-left: 5px;
    }
    @keyframes typing {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
    }
`;
document.head.appendChild(style);
