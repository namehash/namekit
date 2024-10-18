def capitalize_words(s: str) -> str:
    return ' '.join(word.capitalize() for word in s.split(' '))
