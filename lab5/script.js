class RSA {
    constructor() {
        this.publicKey = { exponent: null, modul: null };
        this.privateKey = { prime1: null, prime2: null, secretExponent: null };
    }

    static generatePrime(min, max) {
        let candidate;
        const checkPrimed = (value) => {
            if (value < 2) return false;
            for (let div = 2; div * div <= value; div++) {
                if (value % div === 0) return false;
            }
            return true;
        }
        do {
            candidate = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (checkPrimed(candidate) == false);
        return candidate;
    }

    static greatestCommonDivisor(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    static modularInverse(a, m) {
        let [m0, x0, x1] = [m, 0, 1];
        while (a > 1) {
            const quotient = Math.floor(a / m);
            [a, m] = [m, a % m];
            [x0, x1] = [x1 - quotient * x0, x0];
        }
        return x1 < 0 ? x1 + m0 : x1;
    }

    static modExponentiation(base, exp, mod) {
        let result = 1;
        base = base % mod;
        while (exp > 0) {
            if (exp % 2 === 1) result = (result * base) % mod;
            exp = Math.floor(exp / 2);
            base = (base * base) % mod;
        }
        return result;
    }

    static calculateHash(data) {
        return data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    generateKeyPair() {
        const prime1 = RSA.generatePrime(50, 300);
        const prime2 = RSA.generatePrime(50, 300);
        const modul = prime1 * prime2;
        const totient = (prime1 - 1) * (prime2 - 1);
        let exponent = 3;
        while (RSA.greatestCommonDivisor(exponent, totient) !== 1) {
            exponent += 2;
        }

        const secretExponent = RSA.modularInverse(exponent, totient);
        this.publicKey = { exponent, modul };
        this.privateKey = { prime1, prime2, secretExponent };
    }

    encrypt(text) {
        const { exponent, modul } = this.publicKey;
        return [...text].map(char =>
            RSA.modExponentiation(char.charCodeAt(0), exponent, modul)
        );
    }

    decrypt(encryptedText) {
        const { prime1, prime2, secretExponent } = this.privateKey;
        const modul = prime1 * prime2;
        return encryptedText
            .map(code => String.fromCharCode(RSA.modExponentiation(code, secretExponent, modul)))
            .join('');
    }

    sign(data) {
        const hash = RSA.calculateHash(data);
        const { secretExponent } = this.privateKey;
        const modul = this.privateKey.prime1 * this.privateKey.prime2;
        return RSA.modExponentiation(hash, secretExponent, modul);
    }

    verify(data, signature) {
        const { exponent, modul } = this.publicKey;
        const hash = RSA.calculateHash(data);
        const recoveredHash = RSA.modExponentiation(signature, exponent, modul);
        return hash === recoveredHash;
    }
}

const rsa = new RSA();
let encryptedMessage = [];
let currentSignature = '';

document.getElementById('generateKeys').addEventListener('click', () => {
    rsa.generateKeyPair();
    document.getElementById('outputText').textContent = 'Ключи созданы!';
});

document.getElementById('encryptMessage').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    encryptedMessage = rsa.encrypt(message);
    document.getElementById('outputText').textContent = `Зашифрованное сообщение: ${encryptedMessage}`;
});

document.getElementById('decryptMessage').addEventListener('click', () => {
    const decrypted = rsa.decrypt(encryptedMessage);
    document.getElementById('outputText').textContent = `Расшифрованное сообщение: ${decrypted}`;
});

document.getElementById('signMessage').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    currentSignature = rsa.sign(message);
    document.getElementById('outputText').textContent = `Сигнатура: ${currentSignature}`;
});

document.getElementById('verifySignature').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    const isValid = rsa.verify(message, currentSignature);
    document.getElementById('outputText').textContent = `Результат проверки сигнатуры: ${isValid}`;
});