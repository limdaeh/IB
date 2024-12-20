class EncryptionSystem {
    constructor() {
        this.alphabet = " АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ,.-?!\";:)(".split('');
        this.secretKey = [];
    }

    createRandomKey() {
        this.secretKey = [...this.alphabet].sort(() => Math.random() - 0.5);
    }

    encryptMessage(plainText) {
        if (this.secretKey.length === 0) {
            throw new Error('Пожалуйста, создайте ключ перед шифрованием.');
        }
        if (!plainText.trim()) {
            throw new Error('Сообщение не может быть пустым.');
        }
        if (/[^А-Яа-яЁё.,!?\";:( )\-\s]/.test(plainText)) {
            throw new Error('Сообщение содержит неподдерживаемые символы.');
        }
        return plainText.toUpperCase().split('').map(char => {
            const charIndex = this.alphabet.indexOf(char);
            return charIndex !== -1 ? this.secretKey[charIndex] : char;
        }).join('');
    }

    decryptMessage(encryptedText) {
        if (!encryptedText) {
            throw new Error('Невозможно расшифровать пустое сообщение.');
        }
        return encryptedText.split('').map(char => {
            const charIndex = this.secretKey.indexOf(char);
            return charIndex !== -1 ? this.alphabet[charIndex] : char;
        }).join('');
    }

    getSecretKey() {
        return this.secretKey.join('');
    }

    breakCipher(encryptedText) {
        const frequencyOrder = ' ОЕАНИТСЛВРКДМУПЯЬЫГБЧЗЖЙШХЮЭЦЩФЪЁ,.-?!\";:)('.split('');
        const encrypted = encryptedText.toUpperCase();
        const frequencyCount = {};
        encrypted.split('').forEach(char => {
            frequencyCount[char] = (frequencyCount[char] || 0) + 1;
        });
        const sortedByFreqency = Object.keys(frequencyCount).sort((a, b) => frequencyCount[b] - frequencyCount[a]);
        const hypothesizedKey = {};
        sortedByFreqency.forEach((char, index) => {
            hypothesizedKey[char] = frequencyOrder[index] || char;
        });
        return encrypted.split('').map(char => hypothesizedKey[char] || char).join('');
    }
}
const encryptionSystem = new EncryptionSystem();

document.getElementById('generateKey').addEventListener('click', () => {
    encryptionSystem.createRandomKey();
    document.getElementById('key').value = encryptionSystem.getSecretKey();
});

document.getElementById('encryptBtn').addEventListener('click', () => {
    const plainText = document.getElementById('message').value;
    try {
        const encryptedText = encryptionSystem.encryptMessage(plainText);
        document.getElementById('result').value = encryptedText;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('decryptBtn').addEventListener('click', () => {
    const encryptedText = document.getElementById('result').value;
    try {
        const decryptedText = encryptionSystem.decryptMessage(encryptedText);
        document.getElementById('result').value = decryptedText;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('crackBtn').addEventListener('click', () => {
    const encryptedText = document.getElementById('result').value;
    const crackedText = encryptionSystem.breakCipher(encryptedText);
    document.getElementById('result').value = crackedText;
});
