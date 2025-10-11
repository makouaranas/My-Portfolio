// Chatbot with AI integration
document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotBox = document.getElementById('chatbotBox');
    const closeChatbot = document.getElementById('closeChatbot');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');

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
            // Add user message to UI
            addMessage('user', message);
            
            // Add user message to context
            chatContext.push({
                role: "user",
                content: message
            });
            
            // Clear input
            userInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Get AI response
            getAIResponse();
        }
    }

    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);

    // Send message on Enter key
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
        
        // Scroll to bottom
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
            // Load API key from config
            const config = await fetch('config.json').then(res => res.json());
            
            if (!config.OPENAI_API_KEY) {
                throw new Error('API key not found in config');
            } 

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
                    'HTTP-Referer': window.location.href, // Required by OpenRouter
                    'X-Title': 'Portfolio Chatbot' // Optional - shows in OpenRouter dashboard
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo", // You can change this to any supported model
                    messages: chatContext,
                    max_tokens: 150,
                    temperature: 0.7,
                    top_p: 1.0,
                    frequency_penalty: 0,
                    presence_penalty: 0
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API Error:', errorData);
                throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator();

            if (data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                
                // Add AI response to context
                chatContext.push({
                    role: "assistant",
                    content: aiResponse
                });
                
                // Add AI response to UI
                addMessage('bot', aiResponse);
            } else {
                throw new Error('Invalid API response structure');
            }
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            
            removeTypingIndicator();
            
            // Provide more specific error messages
            if (error.message.includes('API key')) {
                addMessage('bot', 'Configuration error: API key is missing or invalid. Please contact the administrator.');
            } else if (error.message.includes('fetch')) {
                addMessage('bot', 'Network error: Unable to reach the AI service. Please check your internet connection.');
            } else if (error.toString().includes('Invalid API response')) {
                addMessage('bot', 'Processing error: Received unexpected response from AI service. Please try again.');
            } else {
                addMessage('bot', `I apologize, but I encountered an error: ${error.message}`);
            }
        }

        // Limit context size to prevent token limit issues
        if (chatContext.length > 10) {
            chatContext = [
                chatContext[0], // Keep system message
                ...chatContext.slice(-9) // Keep last 9 messages
            ];
        }
    }

    // Error handling for network issues
    window.addEventListener('offline', () => {
        addMessage('bot', 'I apologize, but I\'ve lost my internet connection. Please check your connection and try again.');
    });
});

// Add typing indicator animation styles
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