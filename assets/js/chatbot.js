document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotBox = document.getElementById('chatbotBox');
    const closeBtn = document.getElementById('closeChatbot');
    const sendBtn = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const messagesContainer = document.getElementById('chatbotMessages');

    // API Configuration
    // WARNING: Storing API keys directly in client-side code is INSECURE.
    // For production, consider using a backend proxy, environment variables,
    // or a secure token exchange mechanism to protect your API key.
    // REPLACE THIS WITH YOUR NEW OPENROUTER API KEY
    const API_KEY = "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";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";
    const MODEL = "openrouter/bert-nebulon-alpha";

    // State
    let chatContext = [];

    // Toggle Chatbot
    chatbotButton.addEventListener('click', () => {
        chatbotBox.classList.add('active');
        chatbotButton.style.display = 'none';
        if (chatContext.length === 0) {
            // Optional: Add initial greeting if empty
        }
    });

    closeBtn.addEventListener('click', () => {
        chatbotBox.classList.remove('active');
        chatbotButton.style.display = 'flex';
    });

    // Send Message Logic
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, 'user');
        userInput.value = '';

        // Add to Context
        chatContext.push({ role: "user", content: message });

        // Show Typing Indicator
        const typingId = showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Portfolio Chatbot"
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content: `You are the AI assistant for Anas Makouar's portfolio.
                            
                            **CRITICAL INSTRUCTION:** 
                            - **KEEP IT SHORT.** Customers are busy. Max 2-3 sentences per answer unless asked for more.
                            - **Answer ONLY what is asked.** Do not volunteer extra info.
                            - **Be Professional but Direct.** No fluff.

                            **SPECIAL MODE: LEAD INTAKE SPECIALIST**
                            - If a user expresses interest in **hiring**, **starting a project**, or **working together**:
                                1.  Switch to "Intake Mode".
                                2.  Ask these 4 questions one by one (wait for answer):
                                    - "What is your Name?"
                                    - "Briefly describe the Project?"
                                    - "What is your Budget?"
                                    - "What is the Deadline?"
                                3.  Once you have ALL 4 answers, output **EXACTLY** this format:
                                    \`[INTAKE_COMPLETE] Name: [Name] | Project: [Project] | Budget: [Budget] | Deadline: [Deadline]\`
                                4.  Do NOT output the summary in normal text, ONLY use the format above.

                            **Profile:**
                            - Name: Anas Makouar
                            - Role: Software Engineer & Full Stack Developer
                            - Location: Fes, Morocco
                            - Email: makouaranass@gmail.com
                            - Phone: +212665748866

                            **Key Skills (Mention only if asked):**
                            - Web: React.js, Next.js, Node.js, Python.
                            - Embedded: Arduino, Raspberry Pi, Circuit Design.
                            - Soft Skills: Problem-solving, Reliability.

                            **Education:**
                            - Master in Electrical Engineering (Pursuing, 2024-2026)
                            - Licentiate in Embedded Systems (2023-2024)

                            **Tone:**
                            - **Concise & Direct:** Get straight to the point.
                            - **Helpful:** Give the answer, then stop.
                            - **Formatting:** Use Markdown for lists if needed, but keep it compact.`
                        },
                        ...chatContext.slice(-10)
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.choices[0].message.content;

            // Remove Typing Indicator
            removeTypingIndicator(typingId);

            // Check for Intake Completion Flag
            if (botReply.includes('[INTAKE_COMPLETE]')) {
                // Extract summary
                const summary = botReply.replace('[INTAKE_COMPLETE]', '').trim();

                // Add a friendly "Ready" message
                await typeMessage("Great! I've prepared your project details. Click below to send them directly to Anas.");

                // Create Action Buttons
                addActionButton("Send via WhatsApp", "fab fa-whatsapp", "#25D366", () => {
                    const text = encodeURIComponent(`Hello Anas, I'd like to discuss a project:\n\n${summary.replace(/ \| /g, '\n')}`);
                    window.open(`https://wa.me/212665748866?text=${text}`, '_blank');
                });

                addActionButton("Send via Email", "fas fa-envelope", "#EA4335", () => {
                    const subject = encodeURIComponent("New Project Inquiry");
                    const body = encodeURIComponent(`Hello Anas,\n\nI'd like to discuss a project:\n\n${summary.replace(/ \| /g, '\n')}`);
                    window.open(`mailto:makouaranass@gmail.com?subject=${subject}&body=${body}`, '_blank');
                });

                // Add to Context (hidden from user view in this specific flow to avoid clutter)
                chatContext.push({ role: "assistant", content: "Intake complete. Options presented." });
            } else {
                // Normal Message
                await typeMessage(botReply);
                chatContext.push({ role: "assistant", content: botReply });
            }

        } catch (error) {
            console.error("Chatbot Error:", error);
            removeTypingIndicator(typingId);
            addMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }

    // Event Listeners for Sending
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Helper Functions
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const icon = document.createElement('i');
        icon.classList.add('fas', sender === 'user' ? 'fa-user' : 'fa-robot');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        if (sender === 'bot' && typeof marked !== 'undefined') {
            contentDiv.innerHTML = marked.parse(text);
        } else {
            contentDiv.innerHTML = `<p>${text}</p>`;
        }

        if (sender === 'user') {
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(icon);
        } else {
            messageDiv.appendChild(icon);
            messageDiv.appendChild(contentDiv);
        }

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    // Typewriter Effect Function
    async function typeMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-robot');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        messageDiv.appendChild(icon);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        // Split by character for smoother effect
        const characters = text.split('');
        let currentText = '';

        for (let i = 0; i < characters.length; i++) {
            currentText += characters[i];

            // Use marked.parse to render Markdown as we type
            if (typeof marked !== 'undefined') {
                contentDiv.innerHTML = marked.parse(currentText);
            } else {
                contentDiv.textContent = currentText;
            }

            scrollToBottom();

            // Faster delay for character-by-character typing (10-20ms is usually good)
            await new Promise(resolve => setTimeout(resolve, 15));
        }
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        messageDiv.id = id;

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-robot');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content', 'typing-indicator');

        // Create 3 dots
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('typing-dot');
            contentDiv.appendChild(dot);
        }

        messageDiv.appendChild(icon);
        messageDiv.appendChild(contentDiv);

        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addActionButton(text, iconClass, color, onClick) {
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('message', 'bot-message');

        const contentDiv = document.createElement('button');
        contentDiv.classList.add('action-button');
        contentDiv.innerHTML = `<i class="${iconClass}"></i> ${text}`;
        contentDiv.style.backgroundColor = color;
        contentDiv.onclick = onClick;

        buttonDiv.appendChild(contentDiv);
        messagesContainer.appendChild(buttonDiv);
        scrollToBottom();
    }
});
