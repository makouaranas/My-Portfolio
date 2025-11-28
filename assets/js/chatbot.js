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
