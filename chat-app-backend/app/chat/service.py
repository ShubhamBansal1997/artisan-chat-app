# import openai

# openai.api_key = 'your_openai_api_key'
import random

DUMMY_RESPONSE = [
    "Best three options for you. 1. Go for a walk. 2. Read a book. 3. Watch a movie.",
    "Could be these five options. 1. Take a nap. 2. Call a friend. 3. Try a new recipe. 4. Go for a run. 5. Listen to music.",
    "Here are some random responses for you. 1. The sky is blue. 2. The grass is green. 3. The sun is shining.",
    "Here are some more random responses for you. 1. The birds are chirping. 2. The flowers are blooming. 3. The wind is blowing.",
    "The capital of France is Paris. The Eiffel Tower is a famous landmark in Paris.",
    "Why don’t scientists trust atoms? Because they make up everything!",
    "The meaning of life can be different for everyone. Some find meaning in relationships, others in personal achievements or spirituality.",
    "To reset your password, go to the login page, click on 'Forgot Password,' and follow the instructions sent to your email.",
    "If you enjoy fiction, I’d recommend 'The Great Gatsby' by F. Scott Fitzgerald. For non-fiction, 'Sapiens: A Brief History of Humankind' by Yuval Noah Harari is a great read.",
    "Meditation can reduce stress, improve concentration, and promote a sense of calm. It’s a great practice for overall well-being.",
    "To set up a new email account, choose an email provider, fill out your personal details, and create a strong password. Don’t forget to verify your account through the confirmation email!",
    "Quantum computing is a type of computation that harnesses the principles of quantum mechanics to perform calculations at speeds unattainable by classical computers.",
    "These two random responses you can chose from. 1. The sky is blue. 2. The grass is green.",
    "Some more choices for you. 1. The sun is shining. 2. The birds are chirping.",
]

async def generate_ai_response(user_message: str, content: str) -> str:
    return random.choice(DUMMY_RESPONSE)
    # response = openai.Completion.create(
    #     engine="text-davinci-003",
    #     prompt=f"Assume you are a: {content} \n The user said: {user_message}\nAI response:",
    #     max_tokens=150
    # )
    # return response.choices[0].text.strip()