/* eslint-disable */

class ObsceneFilter {
  private badPatterns = [
    '^(о|а)н(о|а)нист.*',
    '^лошар.*',
    '^к(а|о)злина$',
    '^к(о|а)зел$',
    '^сволоч(ь|ъ|и|уга|ам|ами).*',
    '^лох[уеыаоэяию].*',
    '.*урод(ы|у|ам|ина|ины).*',
    '.*бля(т|д).*', '.*гандо.*',
    '^м(а|о)нд(а|о).*',
    '.*сперма.*',
    '.*[уеыаоэяию]еб$',
    '^сучк(а|у|и|е|ой|ай).*',
    '^придур(ок|ки).*',
    '^д(е|и)би(л|лы).*',
    '^сос(ать|и|ешь|у)$',
    '^залуп.*',
    '^муд(е|ил|о|а|я|еб).*',
    '.*шалав(а|ы|ам|е|ами).*',
    '.*пр(а|о)ст(и|е)т(у|е)тк(а|и|ам|е|ами).*',
    '.*шлюх(а|и|ам|е|ами).*',
    '.*ху(й|и|я|е|л(и|е)).*',
    '.*п(и|е|ы)зд.*',
    '^бл(я|т|д).*',
    '(с|сц)ук(а|о|и|у).*',
    '^еб.*',
    '.*(д(о|а)лб(о|а)|разъ|разь|за|вы|по)ебы*.*',
    '.*пид(а|о|е)р.*',
    '.*хер.*',
  ];

  private goodPatterns = [
    '.*психу.*',
    '.*к(о|а)манд.*',
    '.*истр(е|и)блять.*',
    '.*л(о|а)х(о|а)трон.*',
    '.*(о|а)ск(о|а)рблять.*',
    'хул(е|и)ган',
    '.*м(а|о)нд(а|о)рин.*',
    '.*р(а|о)ссл(а|о)блять.*',
    '.*п(о|а)тр(е|и)блять.*',
    '.*@.*\\.(ру|сом|нет)$',
  ];

  private goodWords = [
    'дезмонда',
    'застрахуйте',
    'одномандатный',
    'подстрахуй',
    'психуй',
  ];

  private letters: Record<string, string> = {
    a: 'а',
    b: 'в',
    c: 'с',
    d: 'д',
    e: 'е',
    f: 'ф',
    g: 'д',
    h: 'н',
    i: 'и',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    v: 'в',
    x: 'х',
    y: 'у',
    w: 'ш',
    z: 'з',
    ё: 'е',
    6: 'б',
    9: 'д',
  };

  public containsMat(text: string) {
    text = this.cleanBadSymbols(text.toLowerCase());

    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      const word = this.convertEngToRus(words[i]);

      if (this.isInGoodWords(word) && this.isInGoodPatterns(word)) continue;

      if (this.isInBadPatterns(word)) return true;
    }

    return this.containsMatInSpaceWords(words);
  }

  private convertEngToRus(word: string) {
    for (let j = 0; j < word.length; j++) {
      for (const key in this.letters) {
        if (word.charAt(j) == key) word = word.substring(0, j) + this.letters[key] + word.substring(j + 1, word.length);
      }
    }

    return word;
  }

  private cleanBadSymbols(text: string) {
    return text.replace(/[^a-zA-Zа-яА-Яё0-9\s]/g, '');
  }

  private isInGoodWords(word: string) {
    for (let i = 0; i < this.goodWords.length; i++) {
      if (word == this.goodWords[i]) return true;
    }

    return false;
  }

  private isInBadPatterns(word: string) {
    for (let i = 0; i < this.badPatterns.length; i++) {
      const pattern = new RegExp(this.badPatterns[i]);
      if (pattern.test(word)) return true;
    }

    return false;
  }

  private isInGoodPatterns(word: string) {
    for (let i = 0; i < this.goodPatterns.length; i++) {
      const pattern = new RegExp(this.goodPatterns[i]);
      if (pattern.test(word)) return true;
    }

    return false;
  }

  private containsMatInSpaceWords(words: string[]) {
    const spaceWords = this.findSpaceWords(words);

    for (let i = 0; i < spaceWords.length; i++) {
      const word = this.convertEngToRus(spaceWords[i]);

      if (this.isInBadPatterns(word)) return true;
    }

    return false;
  }

  private findSpaceWords(words: string[]) {
    const out = [];
    let spaceWord = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (word.length <= 3) {
        spaceWord += word;
        continue;
      }

      if (spaceWord.length >= 3) {
        out.push(spaceWord);
        spaceWord = '';
      }
    }

    return out;
  }

  addBadPattern(pattern: string) {
    this.badPatterns.push(pattern);
  }

  addGoodPattern(pattern: string) {
    this.goodPatterns.push(pattern);
  }

  addGoodWord(pattern: string) {
    this.goodWords.push(pattern);
  }
}

export default new ObsceneFilter();
