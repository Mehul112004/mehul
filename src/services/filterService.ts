export interface FilterResult {
  isValid: boolean;
  sanitizedText: string;
  reason?: string;
}

export class FilterService {
  // A standard list of inappropriate or blocklisted words
  private static blocklist: Set<string> = new Set([
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick', 'pussy',
    'abuse', 'hack', 'exploit', 'spam', 'nigger', 'faggot', 'kill yourself',
    'retard', 'idiot', 'moron', 'dumbass'
  ]);

  /**
   * Cleans text by stripping emojis and flags inappropriate/empty content.
   */
  public static filter(text: string): FilterResult {
    if (!text) {
      return {
        isValid: false,
        sanitizedText: '',
        reason: 'Message cannot be empty.'
      };
    }

    let sanitizedText = text;

    // Unicode regex to match and remove emojis and common symbol characters
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0DF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{2300}-\u{23FF}]/gu;
    
    // Remove emojis
    sanitizedText = sanitizedText.replace(emojiRegex, '').trim();

    // Check if the message was purely emojis/spaces and is now empty
    if (sanitizedText.length === 0 && text.trim().length > 0) {
      return {
        isValid: false,
        sanitizedText: '',
        reason: 'Message cannot consist solely of emojis or decorative symbols.'
      };
    }

    // Tokenize text into words to check against the blocklist
    // We strip punctuation first to prevent bypasses like "fuck!" or "shit."
    const normalizedText = sanitizedText.toLowerCase();
    const words = normalizedText.split(/\s+/);

    for (const rawWord of words) {
      const cleanWord = rawWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '');
      if (this.blocklist.has(cleanWord)) {
        return {
          isValid: false,
          sanitizedText: text,
          reason: `Message contains inappropriate word: "${cleanWord}"`
        };
      }
    }

    // Also check for sub-string matches for safety (e.g. phrases)
    for (const blockedPhrase of this.blocklist) {
      if (normalizedText.includes(blockedPhrase)) {
        // Double check it's not a false positive inside a larger word, e.g. "classic" contains "ass"
        // But since we have specific words in blocklist, let's keep it simple.
        // We will only block if it matches as a word or is a dangerous phrase.
        if (blockedPhrase.includes(' ')) {
          return {
            isValid: false,
            sanitizedText: text,
            reason: `Message contains inappropriate content: "${blockedPhrase}"`
          };
        }
      }
    }

    return {
      isValid: true,
      sanitizedText
    };
  }
}
